import { io } from 'socket.io-client';
import { API_BASE_URL } from '../../api/config.js';

const SOCKET_URL = API_BASE_URL;

let socketInstance = null;
let currentToken = null;
let currentUserId = null;

export const getAppSocket = (token, userId) => {
    console.log('[APP_SOCKET] getAppSocket called', { token: token ? 'exists' : 'null', userId });

    if (!token || !userId) {
        console.log('[APP_SOCKET] Missing token or userId, returning null');
        return null;
    }

    const uid = Number(userId) || 0;

    if (socketInstance && currentToken === token && currentUserId === uid) {
        console.log('[APP_SOCKET] Reusing existing socket instance');
        return socketInstance;
    }

    if (socketInstance) {
        console.log('[APP_SOCKET] Disconnecting old socket');
        socketInstance.disconnect();
        socketInstance = null;
    }

    currentToken = token;
    currentUserId = uid;

    console.log('[APP_SOCKET] Creating new socket connection to', SOCKET_URL);
    socketInstance = io(SOCKET_URL, {
        autoConnect: true,
        transports: ['websocket'],
        auth: { token, userId: uid }
    });

    socketInstance.on('connect', () => {
        console.log('[APP_SOCKET] Connected!', socketInstance.id);
    });

    socketInstance.on('disconnect', (reason) => {
        console.log('[APP_SOCKET] Disconnected:', reason);
    });

    socketInstance.on('connect_error', (error) => {
        console.error('[APP_SOCKET] Connection error:', error);
    });

    return socketInstance;
};

export const disconnectAppSocket = () => {
    if (socketInstance) {
        console.log('[APP_SOCKET] Disconnecting socket');
        socketInstance.disconnect();
        socketInstance = null;
        currentToken = null;
        currentUserId = null;
    }
};

export default getAppSocket;
