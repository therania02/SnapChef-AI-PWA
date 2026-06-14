import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

let socketInstance = null;
let currentToken   = null;
let currentUserId  = null;

/**
 * Ambil atau buat socket.
 * userId (number) dikirim ke server agar server tahu siapa yang connect.
 */
export const getChatSocket = (token, userId) => {
    if (!token || !userId) return null;

    const uid = Number(userId) || 0;

    // Reuse jika token dan userId sama
    if (socketInstance && currentToken === token && currentUserId === uid) {
        return socketInstance;
    }

    // Disconnect yang lama
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }

    currentToken  = token;
    currentUserId = uid;

    socketInstance = io(SOCKET_URL, {
        autoConnect: true,
        transports: ['websocket'],
        auth: { token, userId: uid },
    });

    return socketInstance;
};

/** Putus koneksi (dipanggil saat logout) */
export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance  = null;
        currentToken    = null;
        currentUserId   = null;
    }
};