import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { BottomNav } from '../../../ui/bottomNav';
import { fetchChatSummaries, getCurrentUserId } from '../../lib/chatApi';
import { getChatSocket } from '../../lib/chatSocket';
import { useUser } from '../../lib/userContext.jsx';

/* ── Avatar lookup ─────────────────────────────────────────────────────── */
const AVATAR_MAP = {
    gilbert:   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    therania:  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    sastrawan: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    steven:    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
    carita:    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
};

const GROUP_AVATAR   = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200';
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';

const avatarByName = (name = '') => {
    const lower = name.toLowerCase();
    const key   = Object.keys(AVATAR_MAP).find((k) => lower.includes(k));
    return key ? AVATAR_MAP[key] : DEFAULT_AVATAR;
};

const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
        return new Date(isoString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return '';
    }
};

export default function MessageScreen() {
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    const [summaries, setSummaries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [onlineUserIds, setOnlineUserIds] = useState([]);
    const [error, setError] = useState(null);

    const { user } = useUser();
    
    const [chats, setChats] = useState([]);
    const userId = useMemo(() => getCurrentUserId(user), [user]);
    
    // Ambil data backend
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || userId === 0) {
            console.log("Menunggu auth siap: Token atau User ID masih kosong.", { token, userId });
            return;
        }

        console.log("Auth SIAP! Memulai koneksi socket & fetch data untuk userId:", userId);
        setLoading(true);

        let isMounted = true;
        setLoading(true);

        console.log(`Mengambil chat untuk User ID: ${userId} dengan Token Tersedia`);

        if (!token) return;
        const socket = getChatSocket(token, userId);
        fetchChatSummaries(token, userId)
            .then((res) => {
                if (!isMounted) return;
                if (res.success && res.data) {
                    setFriends(res.data.friends || []);
                    setSummaries(res.data.messages || []);
                }
                setLoading(false);
            })
            .catch((err) => {
                if (!isMounted) return;
                console.error('Gagal memuat ringkasan chat:', err);
                setError(err.message);
                setLoading(false);
            });

        // 3. Konfigurasi Socket IO dengan parameter yang valid
        if (socket) {
            socket.on('online:list', (users) => {
                if (isMounted) setOnlineUserIds(users);
            });
            socket.on('online:join', (id) => {
                if (isMounted) setOnlineUserIds((prev) => [...new Set([...prev, id])]);
            });
            socket.on('online:leave', (id) => {
                if (isMounted) setOnlineUserIds((prev) => prev.filter((uid) => uid !== id));
            });
        }

        return () => {
            isMounted = false;
            if (socket) {
                socket.off('online:list');
                socket.off('online:join');
                socket.off('online:leave');
            }
        };
    }, [user]); // Memicu ulang fetch begitu objek user dari context berhasil di-load

    // Fungsi klik teman untuk memulai private chat dinamis
    const handleFriendClick = useCallback((friend) => {
        if (!userId || !friend?.id) return;
        // Gabungkan ID terkecil dan terbesar agar format konsisten, misal "1-2"
        const chatId = userId < friend.id ? `${userId}-${friend.id}` : `${friend.id}-${userId}`;
        navigate(`/messages/${chatId}`);
    }, [userId, navigate]);

    // Filter Pencarian Chat
    const filteredSummaries = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return summaries;
        return summaries.filter((s) =>
            (s.opponentName || '').toLowerCase().includes(q) ||
            (s.text || '').toLowerCase().includes(q)
        );
    }, [summaries, searchQuery]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-background text-foreground min-h-screen pb-24"
        >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-6 pt-8 pb-6 rounded-b-[32px] shadow-md">
                <h1 className="text-2xl font-bold mb-4">Pesan</h1>
                <div className="relative flex items-center bg-background/20 rounded-2xl px-4 py-2.5 backdrop-blur-md">
                    <Search className="text-foreground/70 mr-3 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari obrolan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-foreground placeholder:text-foreground/60 focus:outline-none w-full text-sm"
                    />
                </div>
            </div>

            <div className="px-6 mt-6">
                {/* Daftar Teman */}
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Teman Memasak
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                    {loading ? (
                        <div className="text-xs text-muted-foreground py-2">Memuat teman...</div>
                    ) : friends.length === 0 ? (
                        <div className="text-xs text-muted-foreground py-2 italic">Tidak ada teman lain</div>
                    ) : (
                        friends.map((friend) => {
                            const isOnline = onlineUserIds.includes(Number(friend.id));
                            return (
                                <div
                                    key={friend.id}
                                    onClick={() => handleFriendClick(friend)}
                                    className="flex flex-col items-center flex-shrink-0 cursor-pointer"
                                >
                                    <div className="relative mb-1">
                                        <img
                                            src={friend.avatar || avatarByName(friend.name)}
                                            alt={friend.name}
                                            onError={(e) => {
                                                e.currentTarget.src = avatarByName(friend.name);
                                            }}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-red-400'}`} />
                                    </div>
                                    <span className="text-xs text-foreground font-medium max-w-[64px] truncate text-center">
                                        {friend.name.split(' ')[0]}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Riwayat Obrolan */}
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-5 mb-3">
                    Obrolan Terakhir
                </h2>
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center text-sm text-muted-foreground py-8">Memuat obrolan...</div>
                    ) : filteredSummaries.length === 0 ? (
                        <div className="text-center text-xs text-muted-foreground py-12 italic bg-card rounded-2xl border border-gray-100">
                            Belum ada riwayat pesan.
                        </div>
                    ) : (
                        filteredSummaries.map((summary) => {
                            const isGroup = summary.chatId?.startsWith('group-') || summary.chatId === 'group-1';
                            const online  = !isGroup && onlineUserIds.includes(Number(summary.opponentId));

                            const opponent = {
                                name: summary.opponentName || 'Teman Masak',
                                avatar: summary.opponentAvatar || (isGroup ? GROUP_AVATAR : avatarByName(summary.opponentName)),
                            };

                            return (
                                <motion.div
                                    key={summary.chatId}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(`/messages/${summary.chatId}`)}
                                    className="bg-card rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100 cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    <div className="relative flex-shrink-0">
                                        <img src={opponent.avatar} alt={opponent.name} className="w-14 h-14 rounded-full object-cover" />
                                        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${isGroup ? 'bg-blue-500' : online ? 'bg-green-500' : 'bg-red-400'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-semibold text-foreground text-base truncate">{opponent.name}</h3>
                                            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                                                {formatTime(summary.lastMessageAt || summary.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {summary.text || summary.lastMessage || 'Belum ada pesan'}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
            <BottomNav />
        </motion.div>
    );
}