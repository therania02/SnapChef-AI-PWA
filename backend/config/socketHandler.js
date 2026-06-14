// Map<userId, Set<socketId>> — satu user bisa punya beberapa tab
const userSockets = new Map();

const addSocket = (userId, socketId) => {
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId).add(socketId);
};

const removeSocket = (userId, socketId) => {
    const sockets = userSockets.get(userId);
    if (!sockets) return;
    sockets.delete(socketId);
    if (sockets.size === 0) userSockets.delete(userId);
};

const isOnline = (userId) => userSockets.has(Number(userId));

export const setupSocket = (io) => {
    io.on('connection', (socket) => {
        const userId = Number(socket.handshake.auth?.userId);

        // ── User connect ───────────────────────────────────────────────────────
        if (userId && userId > 0) {
            const wasOffline = !isOnline(userId);
            addSocket(userId, socket.id);

            if (wasOffline) {
                // Beritahu semua client bahwa user ini online
                io.emit('online:join', userId);
            }
        }

        // Fungsi helper untuk mengirim daftar user online
        const sendOnlineList = () => {
            socket.emit('online:list', Array.from(userSockets.keys()));
        };

        // Kirim langsung saat connect (tetap dipertahankan)
        sendOnlineList();

        // Antisipasi jika client meminta ulang daftar setelah listener mereka siap
        socket.on('online:request_list', () => {
            sendOnlineList();
        });

        // ── Join / leave room chat ─────────────────────────────────────────────
        socket.on('chat:join', ({ chatId }) => {
            if (chatId) socket.join(`chat:${chatId}`);
        });

        socket.on('chat:leave', ({ chatId }) => {
            if (chatId) socket.leave(`chat:${chatId}`);
        });

        // ── Disconnect ─────────────────────────────────────────────────────────
        socket.on('disconnect', () => {
            if (userId && userId > 0) {
                removeSocket(userId, socket.id);
                if (!isOnline(userId)) {
                    // Benar-benar offline (semua tab ditutup)
                    io.emit('online:leave', userId);
                }
            }
        });
    });
};