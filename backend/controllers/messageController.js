import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const db = require('../models/index.cjs');
const { Message, User } = db;

import BaseController from './baseController.js';

export const DEFAULT_CHAT_AVATAR = (name = 'User') => {
    const safeName = encodeURIComponent(name || 'User');
    return `https://ui-avatars.com/api/?name=${safeName}&background=7a9b76&color=fff`;
};

const isGroupChat = (chatId) =>
    typeof chatId === 'string' && chatId.startsWith('group-');

/** Pecah "1-2" → [1, 2]. Hanya untuk direct chat. */
const getDirectParticipantIds = (chatId) => {
    if (!chatId || isGroupChat(chatId)) return [];
    return chatId
        .split('-')
        .map(Number)
        .filter((n) => Number.isFinite(n) && n > 0);
};

const isParticipant = (chatId, userId) =>
    getDirectParticipantIds(chatId).includes(Number(userId));

const resolveUserId = (req) => {
    const candidate =
        req.user?.id ??
        req.user?.userId ??
        req.user?.user?.id ??
        req.query?.userId ??
        req.body?.senderId ??
        req.headers['x-user-id'] ??
        req.headers['user-id'];
    const parsed = Number(candidate);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

class MessageController extends BaseController {
    /**
     * Mengambil daftar ringkasan chat (Messages) dan daftar teman (Friends)
     * GET /api/messages/chats?userId=...
     */
    getChats = async (req, res) => {
        try {
            const userId = resolveUserId(req);
            if (!userId) {
                return this.sendError(res, 400, 'User ID tidak valid atau tidak ditemukan');
            }

            // 1. Ambal semua user lain sebagai daftar teman
            const allUsers = await User.findAll({
                where: {
                    id: { [db.Sequelize.Op.ne]: userId }
                },
                attributes: ['id', 'name', 'role']
            });

            const friends = allUsers.map(u => ({
                id: u.id,
                name: u.name,
                avatar: DEFAULT_CHAT_AVATAR(u.name), 
                isOnline: false 
            }));

            // 2. Ambil semua pesan untuk dikelompokkan
            const allMessages = await Message.findAll({
                order: [['createdAt', 'ASC']] 
            });

            const chatMap = {};

            for (const msg of allMessages) {
                const chatId = msg.chatId;
                let isParticipant = false;

                if (isGroupChat(chatId)) {
                    isParticipant = true; // Semua user bisa melihat grup di seeder ini
                } else {
                    const pIds = getDirectParticipantIds(chatId);
                    if (pIds.includes(userId)) {
                        isParticipant = true;
                    }
                }

                if (isParticipant) {
                    chatMap[chatId] = msg;
                }
            }

            // 3. Bangun struktur ringkasan chat
            const messagesSummary = [];

            for (const chatId in chatMap) {
                const lastMsg = chatMap[chatId];
                let opponent = null;

                if (isGroupChat(chatId)) {
                    opponent = {
                        id: chatId,
                        name: 'Grup Masak Bareng',
                        avatar: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200'
                    };
                } else {
                    const pIds = getDirectParticipantIds(chatId);
                    const opponentId = pIds.find(id => id !== userId);
                    const opponentUser = friends.find(f => f.id === opponentId);

                    if (opponentUser) {
                        opponent = {
                            id: opponentUser.id,
                            name: opponentUser.name,
                            avatar: opponentUser.avatar
                        };
                    } else {
                        // Jalur penyelamat jika user tidak ditemukan di tabel Friends
                        opponent = {
                            id: opponentId || 0,
                            name: lastMsg.senderId === userId ? 'User Lain' : lastMsg.senderName,
                            avatar: lastMsg.senderId === userId ? DEFAULT_CHAT_AVATAR('User') : lastMsg.senderAvatar
                        };
                    }
                }

                messagesSummary.push({
                    chatId,
                    opponentId: opponent.id,
                    opponentName: opponent.name,
                    opponentAvatar: opponent.avatar,
                    text: lastMsg.text,
                    lastMessageAt: lastMsg.createdAt,
                    createdAt: lastMsg.createdAt,
                    isGroup: isGroupChat(chatId)
                });
            }

            // Urutkan chat terbaru di paling atas
            messagesSummary.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

            return res.status(200).json({
                success: true,
                message: 'Berhasil mengambil ringkasan chat',
                data: {
                    friends: friends,
                    messages: messagesSummary
                }
            });

        } catch (error) {
            console.error('[getChats Error]:', error);
            return this.sendError(res, 500, 'Internal Server Error');
        }
    };

    /** GET /api/messages/:chatId */
    getMessages = async (req, res) => {
        try {
            const { chatId } = req.params;
            const userId = resolveUserId(req);

            if (userId && !isGroupChat(chatId) && !isParticipant(chatId, userId)) {
                return this.sendError(res, 403, 'Anda tidak memiliki akses ke percakapan ini');
            }

            const messages = await Message.findAll({
                where: { chatId },
                order: [['createdAt', 'ASC']],
            });

            return this.sendSuccess(res, 200, 'Berhasil mengambil pesan', messages);
        } catch (error) {
            console.error('[getMessages]', error);
            return this.sendError(res, 500, 'Internal Server Error');
        }
    };

    /** POST /api/messages/:chatId */
    sendMessage = async (req, res) => {
        try {
            const { chatId } = req.params;
            const { text = '', image = '', senderAvatar, reactions = [] } = req.body;
            const userId = resolveUserId(req);

            if (!text.trim() && !image) {
                return this.sendError(res, 400, 'Pesan tidak boleh kosong');
            }

            if (userId && !isGroupChat(chatId) && !isParticipant(chatId, userId)) {
                return this.sendError(res, 403, 'Anda tidak memiliki akses ke percakapan ini');
            }

            // SINKRONISASI NAMA: Cari langsung ke database User jika req.user atau req.body kosong
            let senderName = req.user?.name || req.body.senderName;
            if (!senderName || senderName === 'User') {
                if (userId) {
                    const dbUser = await User.findByPk(userId);
                    if (dbUser?.name) senderName = dbUser.name;
                }
            }
            if (!senderName) senderName = 'User';

            const message = await Message.create({
                chatId,
                senderId: userId,
                senderName,
                senderAvatar: senderAvatar || DEFAULT_CHAT_AVATAR(senderName),
                text,
                image,
                reactions: reactions || [],
            });

            const io = req.app.get('io');
            const pIds = getDirectParticipantIds(chatId);
            const receiverId = pIds.find(id => id !== userId);
            if (io) {
                // chat room (ChatDetail.jsx)
                io.to(`chat:${chatId}`).emit('message:new', message);

                // chat list + unread badge (Message.jsx)
                if (receiverId) {
                    io.to(`user:${receiverId}`).emit('message:new', message);
                }

                // optional: update sender juga biar realtime
                io.to(`user:${userId}`).emit('message:new', message);
            }

            return this.sendSuccess(res, 201, 'Pesan berhasil dikirim', message);
        } catch (error) {
            console.error('[sendMessage]', error);
            return this.sendError(res, 500, 'Internal Server Error');
        }
    };

    /** MOCK UPLOAD: Menghindari error 404 resource */
    uploadMock = async (req, res) => {
        try {
            // Karena ini mock, jika ada file atau tidak, kembalikan gambar placeholder aman
            return res.status(200).json({
                success: true,
                message: 'Upload sukses',
                data: {
                    url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400'
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    };
}

export default new MessageController();