const API_URL    = 'http://localhost:3000/api/messages';
const UPLOAD_URL = 'http://localhost:3000/api/messages/upload';

const jsonHeaders = (token) => {
    const h = { 'Content-Type': 'application/json' };
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
};

const authHeaders = (token) => {
    const h = {};
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
};

/**
 * Ekstrak userId dari berbagai bentuk objek user.
 * Kembalikan number, atau 0 jika tidak ditemukan.
 */
export const getCurrentUserId = (user) => {
    const raw = user?.id ?? user?.userId ?? user?.user?.id ?? 0;
    return Number(raw) || 0;
};

export const fetchChatSummaries = async (token, userId) => {
    console.log('TOKEN SUMMARY:', token);
    const headers = jsonHeaders(token);
    console.log("HEADERS:", headers);
    const res = await fetch(
        `${API_URL}/chats?userId=${userId}`,
        { headers }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil ringkasan chat');
    return data; // { success, message, data: { friends, messages } }
};

export const fetchChatMessages = async (chatId, token, userId) => {
    console.log('TOKEN CHAT:', token);

    const q = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`${API_URL}/${chatId}${q}`, { headers: jsonHeaders(token) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengambil pesan');
    return Array.isArray(data.data) ? data.data : [];
};

export const postChatMessage = async (chatId, payload, token, userId) => {
    const q = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`${API_URL}/${chatId}${q}`, {
        method: 'POST',
        headers: jsonHeaders(token),
        body: JSON.stringify({ ...payload, senderId: payload.senderId || userId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengirim pesan');
    return data.data;
};

/**
 * Upload gambar ke backend.
 * Backend perlu endpoint: POST /api/messages/upload  (multipart/form-data, field "image")
 * Response: { data: { url: "http://..." } }
 */
export const uploadImage = async (file, token) => {
    const form = new FormData();
    form.append('image', file);
    const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: authHeaders(token), // jangan set Content-Type — biar browser yang set boundary
        body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal upload gambar');
    return data.data?.url || data.url || null;
};