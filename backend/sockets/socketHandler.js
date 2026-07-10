// Map<userId, Set<socketId>>
const userSockets = new Map();

const addSocket = (userId, socketId) => {
    userId = Number(userId);

    if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
    }

    userSockets.get(userId).add(socketId);
};

const removeSocket = (userId, socketId) => {
    userId = Number(userId);

    const sockets = userSockets.get(userId);
    if (!sockets) return;

    sockets.delete(socketId);

    if (sockets.size === 0) {
        userSockets.delete(userId);
    }
};

const isOnline = (userId) => {
    return userSockets.has(Number(userId));
};

const getOnlineUsers = () => {
    return Array.from(userSockets.keys());
};

export const setupSocket = (io) => {
    console.log('[SOCKET] setupSocket called');

    io.on('connection', (socket) => {
        const userId = Number(socket.handshake.auth?.userId);
        console.log(`[SOCKET] New connection: ${socket.id}, userId=${userId}`);

        if (userId && userId > 0) {
            socket.join(`user:${userId}`);
            const wasOffline = !isOnline(userId);

            addSocket(userId, socket.id);
            console.log(`[SOCKET] User ${userId} added to socket pool`, {
                wasOffline,
                totalOnlineUsers: getOnlineUsers().length
            });

            if (wasOffline) {
                io.emit('online:join', userId);
                console.log(`[SOCKET] User ${userId} is now online`);
            }
        }

        // selalu kirim daftar terbaru
        socket.emit('online:list', getOnlineUsers());
        console.log(`[SOCKET] Sent online list to ${socket.id}:`, getOnlineUsers());

        socket.on('online:request_list', () => {
            socket.emit('online:list', getOnlineUsers());
            console.log(`[SOCKET] ${socket.id} requested online list:`, getOnlineUsers());
        });

        socket.on('chat:join', ({ chatId }) => {
            if (!chatId) return;

            socket.join(`chat:${chatId}`);
            console.log(`[SOCKET] ${socket.id} (user=${userId}) joined room chat:${chatId}`);
        });

        socket.on('chat:leave', ({ chatId }) => {
            if (!chatId) return;

            socket.leave(`chat:${chatId}`);
            console.log(`[SOCKET] ${socket.id} (user=${userId}) left room chat:${chatId}`);
        });

        socket.on('disconnect', (reason) => {
            console.log(`[SOCKET] Disconnected: ${socket.id}, userId=${userId}, reason=${reason}`);

            if (userId > 0) {
                removeSocket(userId, socket.id);

                if (!isOnline(userId)) {
                    io.emit('online:leave', userId);
                    console.log(`[SOCKET] User ${userId} is now offline`);
                }
            }
        });
    });
};