import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Image as ImageIcon,
  Smile,
  MoreVertical,
  Phone,
  Video,
  X,
  Users,
  Bell,
  Star,
  Trash2,
  Search,
} from "lucide-react";
import { mockChats, mockChatMessages } from "../../lib/data";
import { toast } from "sonner";

const EMOJI_REACTIONS = ["❤️", "👍", "😂", "😮", "😢", "🔥", "🎉"];

export default function ChatDetailScreen() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(mockChatMessages[chatId] || []);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const chat = mockChats.find((c) => c.id === chatId);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: "You",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
      text: messageText,
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
    toast.success("Pesan terkirim");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate image upload
    const reader = new FileReader();
    reader.onload = (event) => {
      const newMessage = {
        id: Date.now().toString(),
        senderId: "me",
        senderName: "You",
        senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
        image: event.target.result,
        text: "📸",
        timestamp: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      toast.success("Foto terkirim");
    };
    reader.readAsDataURL(file);
  };

  const handleReaction = (messageId, emoji) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find((r) => r.emoji === emoji);

          if (existingReaction) {
            // Toggle reaction
            if (existingReaction.userIds.includes("me")) {
              existingReaction.userIds = existingReaction.userIds.filter(
                (id) => id !== "me"
              );
              if (existingReaction.userIds.length === 0) {
                return {
                  ...msg,
                  reactions: reactions.filter((r) => r.emoji !== emoji),
                };
              }
            } else {
              existingReaction.userIds.push("me");
            }
          } else {
            reactions.push({ emoji, userIds: ["me"] });
          }

          return { ...msg, reactions };
        }
        return msg;
      })
    );
    setShowEmojiPicker(null);
  };

  if (!chat) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Chat tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Fixed/Sticky */}
      <div className="sticky top-0 z-40 bg-primary text-primary-foreground px-4 pt-12 pb-4 flex items-center gap-4 shadow-lg">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/messages")}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>

        <div
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={() => setShowContactInfo(true)}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-full h-full object-cover"
              />
            </div>
            {chat.isOnline && !chat.isGroup && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-primary" />
            )}
          </div>
          <div>
            <h2 className="font-medium">{chat.name}</h2>
            <p className="text-xs opacity-90">
              {chat.isGroup
                ? `${chat.participants.length} anggota`
                : chat.isOnline
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => toast.info("Panggilan suara")}
          >
            <Phone className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => toast.info("Panggilan video")}
          >
            <Video className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => toast.info("Menu lainnya")}
          >
            <MoreVertical className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4 max-w-md lg:max-w-full mx-auto lg:mx-0 w-full">
        {messages.map((message, index) => {
          const isMe = message.senderId === "me";
          const showAvatar =
            chat.isGroup &&
            !isMe &&
            (index === messages.length - 1 ||
              messages[index + 1]?.senderId !== message.senderId);

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar for group chat */}
              {chat.isGroup && !isMe ? (
                <div className="w-8 h-8 flex-shrink-0">
                  {showAvatar && (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={message.senderAvatar}
                        alt={message.senderName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ) : null}

              <div className={`flex flex-col ${isMe ? "items-end" : ""}`}>
                {/* Sender name for group chat */}
                {chat.isGroup && !isMe && showAvatar && (
                  <span className="text-xs text-muted-foreground mb-1 ml-2">
                    {message.senderName}
                  </span>
                )}

                <div className="relative group">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`rounded-2xl px-4 py-2 max-w-[280px] ${
                      isMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    }`}
                  >
                    {message.image && (
                      <div className="rounded-xl overflow-hidden mb-2">
                        <img
                          src={message.image}
                          alt="Shared"
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                    {message.text && <p className="break-words">{message.text}</p>}

                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {message.reactions.map((reaction, idx) => (
                          <motion.button
                            key={idx}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleReaction(message.id, reaction.emoji)
                            }
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                              reaction.userIds.includes("me")
                                ? "bg-primary/20 border border-primary"
                                : "bg-muted"
                            }`}
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-xs">
                              {reaction.userIds.length}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {/* Reaction Button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setShowEmojiPicker(
                        showEmojiPicker === message.id ? null : message.id
                      )
                    }
                    className={`absolute -bottom-2 ${
                      isMe ? "left-2" : "right-2"
                    } p-1 bg-card border border-border rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg`}
                  >
                    <Smile className="h-4 w-4" />
                  </motion.button>

                  {/* Emoji Picker */}
                  <AnimatePresence>
                    {showEmojiPicker === message.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`absolute -bottom-12 ${
                          isMe ? "left-0" : "right-0"
                        } bg-card border border-border rounded-2xl p-2 shadow-xl flex gap-1 z-10`}
                      >
                        {EMOJI_REACTIONS.map((emoji) => (
                          <motion.button
                            key={emoji}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleReaction(message.id, emoji)}
                            className="text-xl p-1 hover:bg-muted rounded-lg transition-colors"
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <span
                    className={`text-xs text-muted-foreground mt-1 block ${
                      isMe ? "text-right" : "text-left"
                    }`}
                  >
                    {message.timestamp}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-30">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 flex gap-2 items-end">
          {/* Image Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary/20 transition-colors"
          >
            <ImageIcon className="h-5 w-5" />
          </motion.button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Tulis pesan..."
              className="w-full px-4 py-3 bg-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Send Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className={`p-3 rounded-2xl transition-all ${
              messageText.trim()
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {/* Contact Info Modal */}
      <ContactInfoModal
        isOpen={showContactInfo}
        onClose={() => setShowContactInfo(false)}
        chat={chat}
        messages={messages}
      />
    </div>
  );
}

// Contact Info Modal Component
function ContactInfoModal({ isOpen, onClose, chat, messages }) {
  if (!isOpen) return null;

  // Extract all images from messages
  const sharedMedia = messages
    .filter((msg) => msg.image)
    .map((msg) => ({
      id: msg.id,
      image: msg.image,
      sender: msg.senderName,
      timestamp: msg.timestamp,
    }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="bg-background w-full max-w-md h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-6 flex items-center justify-between">
            <h2 className="text-xl font-medium">Info Kontak</h2>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Profile Section */}
            <div className="p-6 text-center border-b border-border">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-medium mb-1">{chat.name}</h3>
              {chat.isGroup ? (
                <p className="text-sm text-muted-foreground">
                  Grup · {chat.participants.length} anggota
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {chat.isOnline ? "Online" : "Offline"}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-border">
              <ActionButton
                icon={<Phone className="h-5 w-5" />}
                label="Telepon"
                onClick={() => toast.info("Panggilan suara")}
              />
              <ActionButton
                icon={<Video className="h-5 w-5" />}
                label="Video"
                onClick={() => toast.info("Panggilan video")}
              />
              <ActionButton
                icon={<Search className="h-5 w-5" />}
                label="Cari"
                onClick={() => toast.info("Cari pesan")}
              />
            </div>

            {/* Shared Media */}
            <div className="p-6 border-b border-border">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Media, Link, dan Dokumen</h4>
                <button className="text-sm text-primary hover:underline">
                  {sharedMedia.length}
                </button>
              </div>
              {sharedMedia.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {sharedMedia.slice(0, 6).map((media) => (
                    <motion.div
                      key={media.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                    >
                      <img
                        src={media.image}
                        alt="Media"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Belum ada media yang dibagikan
                </p>
              )}
            </div>

            {/* Group Members */}
            {chat.isGroup && (
              <div className="p-6 border-b border-border">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">
                    {chat.participants.length} Anggota
                  </h4>
                  <button className="text-sm text-primary hover:underline">
                    Lihat Semua
                  </button>
                </div>
                <div className="space-y-3">
                  {chat.participants.map((participant) => (
                    <motion.div
                      key={participant.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={participant.avatar}
                            alt={participant.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {participant.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {participant.isOnline
                            ? "Online"
                            : participant.lastSeen || "Offline"}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings */}
            <div className="p-6 space-y-2">
              <SettingItem
                icon={<Bell className="h-5 w-5" />}
                label="Notifikasi"
                onClick={() => toast.info("Pengaturan notifikasi")}
              />
              <SettingItem
                icon={<Star className="h-5 w-5" />}
                label="Pesan Berbintang"
                onClick={() => toast.info("Pesan berbintang")}
              />
              <SettingItem
                icon={<Trash2 className="h-5 w-5" />}
                label="Hapus Chat"
                onClick={() => toast.error("Hapus chat")}
                danger
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ActionButton({ icon, label, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors"
    >
      <div className="text-primary">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </motion.button>
  );
}

function SettingItem({ icon, label, onClick, danger }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-colors ${
        danger ? "text-destructive" : ""
      }`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}