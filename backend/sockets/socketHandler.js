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
    io.on('connection', (socket) => {
        const userId = Number(socket.handshake.auth?.userId);

        // console.log(
        //     `[SOCKET] Connected: ${socket.id} user=${userId}`
        // );

        if (userId && userId > 0) {
            socket.join(`user:${userId}`);
            const wasOffline = !isOnline(userId);

            addSocket(userId, socket.id);

            if (wasOffline) {
                io.emit('online:join', userId);

                // console.log(
                //     `[ONLINE] User ${userId} online`
                // );
            }
        }

        // selalu kirim daftar terbaru
        socket.emit('online:list', getOnlineUsers());

        socket.on('online:request_list', () => {
            socket.emit('online:list', getOnlineUsers());
        });

        socket.on('chat:join', ({ chatId }) => {
            if (!chatId) return;

            socket.join(`chat:${chatId}`);

            // console.log(
            //     `[ROOM] ${socket.id} joined chat:${chatId}`
            // );
        });

        socket.on('chat:leave', ({ chatId }) => {
            if (!chatId) return;

            socket.leave(`chat:${chatId}`);

            // console.log(
            //     `[ROOM] ${socket.id} left chat:${chatId}`
            // );
        });

        socket.on('disconnect', (reason) => {
            console.log("disconect  reason", reason);

            // console.log(
            //     `[SOCKET] Disconnected: ${socket.id} reason=${reason}`
            // );

            if (userId > 0) {
                removeSocket(userId, socket.id);

                if (!isOnline(userId)) {
                    io.emit('online:leave', userId);

                    // console.log(
                    //     `[ONLINE] User ${userId} offline`
                    // );
                }
            }
        });
    });
};