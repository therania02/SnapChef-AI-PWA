import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, Image as ImageIcon, Smile, Search, X } from 'lucide-react';
import { fetchChatMessages, getCurrentUserId, postChatMessage, uploadImage } from '../../lib/chatApi';
import { getChatSocket } from '../../lib/chatSocket';
import { useUser } from '../../lib/userContext.jsx';
import { toast } from 'sonner';
import { useLanguage } from '../../lib/languageContext.jsx';

/* ── Konstanta ─────────────────────────────────────────────────────────── */
const AVATAR_MAP = {
    gilbert:   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    therania:  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    sastrawan: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    steven:    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
    carita:    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
};
const GROUP_AVATAR   = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200';
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';
const GROUP_CHAT_ID  = 'group-1';
const TIME_GAP_MIN   = 3;

const EMOJI_LIST = [
    '😀','😂','😍','🥰','😎','😢','😡','👍','👎','🙏',
    '❤️','🔥','🎉','✅','💯','🍳','🥘','🍜','🍣','🥗',
];

const ID_MAPPING = {
    1: 'Pak Gilbert Fernando Situmorang',
    2: 'Carita Angel Samudra Tjoatja',
    3: 'Therania',
    4: 'Sastrawan',
    5: 'Steven Lienardi',
};

const avatarByName = (name = '') => {
    const lower = name.toLowerCase();
    const key   = Object.keys(AVATAR_MAP).find((k) => lower.includes(k));
    return key ? AVATAR_MAP[key] : DEFAULT_AVATAR;
};

const fmtTime = (v, language = 'id') =>
    v ? new Date(v).toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : '';

const diffMin = (a, b) =>
    Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 60000;

export default function ChatDetailScreen() {
    const { user } = useUser();
    const { language, t } = useLanguage();
    const { chatId } = useParams();
    const navigate   = useNavigate();
    const location = useLocation();
    const friend = location.state?.friend || null;

    const [messages,     setMessages]     = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [inputText,    setInputText]    = useState('');
    const [searchQuery,  setSearchQuery]  = useState('');
    const [showSearch,   setShowSearch]   = useState(false);
    const [showEmoji,    setShowEmoji]    = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [sending,      setSending]      = useState(false);
    const [onlineUserIds, setOnlineUserIds] = useState([]);

    const token = localStorage.getItem('token');
    console.log("DEBUG AUTH:", {
        user,
        tokenFromContext: user?.token,
        tokenFromStorage: localStorage.getItem("token"),
    });
    const myId   = useMemo(() => getCurrentUserId(user), [user]);
    const myName = useMemo(() => (user?.name || '').trim(), [user]);

    const messagesEndRef = useRef(null);
    const fileInputRef   = useRef(null);

    const opponentId = useMemo(() => {
        if (!chatId || chatId.startsWith('group-') || chatId === GROUP_CHAT_ID) return null;
        const ids = chatId.split('-').map(Number).filter((n) => Number.isFinite(n) && n > 0);
        return ids.find((n) => n !== myId) ?? null;
    }, [chatId, myId]);

    const isMyMessage = useCallback((msg) => {
        const sId = Number(msg.senderId);
        if (myId > 0 && sId > 0) return sId === myId;
        const sName = (msg.senderName || '').trim().toLowerCase();
        return sName !== '' && sName === myName.toLowerCase();
    }, [myId, myName]);

    const chatMeta = useMemo(() => {
        if (!chatId || chatId === GROUP_CHAT_ID || chatId.startsWith('group-')) {
            return { name: t("chat.group_name"), avatar: GROUP_AVATAR, isGroup: true, opponentId: null };
        }
        return { name: friend?.name || ID_MAPPING[opponentId] || t("messages.cooking_friend"), avatar: friend?.avatar || avatarByName(friend?.name ||  ID_MAPPING[opponentId]) || DEFAULT_AVATAR, isGroup: false, opponentId: friend?.id || opponentId };
    }, [chatId, opponentId, friend, t]);

    const isOnline = useMemo(() => {
        if (!chatMeta.opponentId) return false;
        return onlineUserIds.includes(Number(chatMeta.opponentId));
    }, [chatMeta.opponentId, onlineUserIds]);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const currentUid = getCurrentUserId(user);

        if (!chatId || !savedToken || !currentUid) return;
        setLoading(true);

        // Gunakan savedToken untuk fetch data pesan di chat room tertentu
        fetchChatMessages(chatId, savedToken, currentUid)
            .then(setMessages)
            .catch((err) => console.error("Gagal load pesan detail:", err))
            .finally(() => setLoading(false));

    }, [chatId, user]);

    useEffect(() => {
        if (!token) return;
        const socket = getChatSocket(token, myId);
        if (!socket || !chatId) return;

        const handleMessageNew = (msg) => {
            if (msg?.chatId !== chatId) return;
            setMessages((prev) => {
                const idx = prev.findIndex(
                    (m) =>
                        String(m.id).startsWith('temp-') &&
                        Number(m.senderId) === Number(msg.senderId) &&
                        (m.text || '').trim() === (msg.text || '').trim()
                );
                if (idx !== -1) {
                    const next = [...prev];
                    next[idx] = msg;
                    return next;
                }
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        };

        const handleOnlineList = (ids) => {
            setOnlineUserIds((prev) => {
                const merged = new Set([...prev, ...ids.map(Number)]);
                return [...merged];
            });
        };

        const handleOnlineJoin = (id) => {
            setOnlineUserIds((prev) => [...new Set([...prev, Number(id)])]);
        };

        const handleOnlineLeave = (id) => {
            setOnlineUserIds((prev) => prev.filter((uid) => uid !== Number(id)));
        };

        const handleConnect = () => {
            socket.emit('online:request_list');
            if (chatId) {
                socket.emit('chat:join', { chatId });
            }
        };

        socket.on('message:new', handleMessageNew);
        socket.on('online:list', handleOnlineList);
        socket.on('online:join', handleOnlineJoin);
        socket.on('online:leave', handleOnlineLeave);
        socket.on('connect', handleConnect);

        if (socket.connected) {
            handleConnect();
        }

        return () => {
            socket.emit('chat:leave', { chatId });
            socket.off('message:new', handleMessageNew);
            socket.off('online:list', handleOnlineList);
            socket.off('online:join', handleOnlineJoin);
            socket.off('online:leave', handleOnlineLeave);
            socket.off('connect', handleConnect);
        };
    }, [token, chatId, myId]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSend = async (e) => {
        e?.preventDefault();
        const text  = inputText.trim();
        const hasText  = text.length > 0;
        const hasImage = imagePreview !== null;

        if (!hasText && !hasImage) return;
        if (!chatId || sending) return;

        setSending(true);
        setInputText('');
        setShowEmoji(false);

        let imageUrl = '';
        if (hasImage) {
            try {
                imageUrl = await uploadImage(
                    imagePreview.file,
                    token
                );
            } catch (err) {
                toast.error(t("chat.upload_failed"));
                setSending(false);
                return;
            }
            setImagePreview(null);
        }

        const tempId = `temp-${Date.now()}`;
        const optimistic = {
            id:         tempId,
            chatId,
            senderId:   myId,
            senderName: myName || 'User',
            text,
            image:      imageUrl,
            createdAt:  new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimistic]);

        try {
            await postChatMessage(
                chatId,
                { text, image: imageUrl, senderId: myId, senderName: myName || 'User' },
                token,
                myId
            );
        } catch (err) {
            setMessages((prev) => prev.filter((m) => m.id !== tempId));
            toast.error(t("chat.send_failed"));
        } finally {
            setSending(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error(t("chat.image_only")); return; }
        setImagePreview({ file, url: URL.createObjectURL(file) });
        e.target.value = '';
    };

    const insertEmoji = (em) => setInputText((p) => p + em);

    const filtered = useMemo(() => {
        if (!searchQuery.trim()) return messages;
        return messages.filter((m) =>
            (m.text || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [messages, searchQuery]);

    const annotated = useMemo(() =>
        filtered.map((msg, i) => {
            const prev        = filtered[i - 1];
            const sameSender  = prev && String(prev.senderId) === String(msg.senderId);
            const closeInTime = prev && diffMin(prev.createdAt, msg.createdAt) < TIME_GAP_MIN;
            return { ...msg, showName: !(sameSender && closeInTime) };
        })
    , [filtered]);

    const statusLabel = chatMeta.isGroup ? t("chat.group") : isOnline ? t("chat.online") : t("chat.offline");
    const statusDot   = chatMeta.isGroup ? 'bg-blue-400' : isOnline ? 'bg-green-400' : 'bg-red-400';
    const canSend     = (inputText.trim().length > 0 || imagePreview !== null) && !sending;

    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3 shadow-md shrink-0">
                <button onClick={() => navigate(-1)} className="p-1 hover:bg-card/10 rounded-full">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div className="relative">
                    <img src={chatMeta.avatar} alt={chatMeta.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/20" />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-primary ${statusDot}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-sm truncate">{chatMeta.name}</h2>
                    <p className="text-xs text-foreground/80">{statusLabel}</p>
                </div>
                <button onClick={() => { setShowSearch((v) => !v); setSearchQuery(''); }}
                    className="p-2 hover:bg-card/10 rounded-full">
                    <Search className="h-5 w-5" />
                </button>
            </div>

            {/* Search bar */}
            {showSearch && (
                <div className="bg-card p-2 shrink-0 shadow-sm border-b border-border flex gap-2">
                    <input type="text" placeholder={t("chat.search_messages")} value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-muted px-3 py-1.5 rounded-xl text-sm focus:outline-none" />
                    <button onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                        className="text-xs text-muted-foreground px-2">{t("common.cancel")}</button>
                </div>
            )}

            {/* Area pesan */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
                {loading ? (
                    <div className="text-center text-gray-400 text-sm py-8">{t("chat.loading")}</div>
                ) : annotated.length === 0 ? (
                    <div className="text-center text-gray-400 text-xs py-12 italic">
                        {t("chat.no_history")}
                    </div>
                ) : (
                    annotated.map((msg) => {
                        const mine = isMyMessage(msg);
                        return (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${mine ? 'items-end' : 'items-start'} ${msg.showName ? 'mt-3' : 'mt-0.5'}`}
                            >
                                {msg.showName && (
                                    <span className={`text-[11px] font-medium mb-0.5 mx-2 ${mine ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {mine ? myName : (msg.senderName || chatMeta.name)}
                                    </span>
                                )}

                                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                                    mine
                                        ? 'bg-primary text-primary-foreground rounded-br-none'
                                        : 'bg-card text-card-foreground rounded-bl-none border border-border'
                                }`}>
                                    {msg.image && (
                                        <img src={msg.image} alt="foto"
                                            className="max-w-[220px] rounded-xl mb-1 object-cover" />
                                    )}
                                    {msg.text ? (
                                        <p className="leading-relaxed break-words">{msg.text}</p>
                                    ) : null}
                                    <span className={`text-[9px] block text-right mt-1 ${mine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                        {fmtTime(msg.createdAt, language)}
                                        {String(msg.id).startsWith('temp-') && <span className="ml-1 opacity-50">⏳</span>}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Preview gambar */}
            {imagePreview && (
                <div className="bg-card border-t px-4 py-2 flex items-center gap-3 shrink-0">
                    <div className="relative">
                        <img src={imagePreview.url} alt="preview"
                            className="h-20 w-20 object-cover rounded-xl border" />
                        <button onClick={() => setImagePreview(null)}
                            className="absolute -top-2 -right-2 bg-gray-700 text-foreground rounded-full p-0.5">
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {inputText.trim() ? `+ "${inputText.trim()}"` : t("chat.ready_to_send")}
                    </p>
                </div>
            )}

            {/* Emoji picker */}
            {showEmoji && (
                <div className="bg-card border-t px-3 py-2 shrink-0">
                    <div className="flex flex-wrap gap-2">
                        {EMOJI_LIST.map((em) => (
                            <button key={em} onClick={() => insertEmoji(em)}
                                className="text-xl hover:scale-125 transition-transform">
                                {em}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input bar */}
            <form onSubmit={handleSend} className="p-3 bg-card border-t flex items-center gap-2 shrink-0 pb-4">
                <button type="button" onClick={() => fileInputRef.current?.click()}
                    className={`p-2 transition-colors ${imagePreview ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                    <ImageIcon className="h-5 w-5" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*"
                    className="hidden" onChange={handleFileChange} />

                <input
                    type="text"
                    placeholder={imagePreview ? t("chat.caption_placeholder") : t("chat.message_placeholder")}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSend(e); }}
                    className="flex-1 bg-background border border-border rounded-2xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />

                <button type="button" onClick={() => setShowEmoji((v) => !v)}
                    className={`p-2 transition-colors ${showEmoji ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                    <Smile className="h-5 w-5" />
                </button>

                <button type="submit" disabled={!canSend}
                    className="p-2.5 bg-primary text-primary-foreground rounded-xl disabled:opacity-40 transition-opacity">
                    <Send className="h-4 w-4" />
                </button>
            </form>
        </div>
    );
}
