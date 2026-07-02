import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Trash2, Edit2 } from "lucide-react"; 
import { useState, useRef, useEffect } from "react";
import { useCookingPosts } from "../app/lib/cookingPostContext";
import { useUser } from "../app/lib/userContext.jsx"; 
import { toast } from "sonner";
import { useLanguage } from "../app/lib/languageContext.jsx";

export function CommentsModal({ isOpen, onClose, post }) {
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const { user } = useUser(); // Sekarang useUser sudah terdefinisi dan tidak error lagi
  const { getComments, fetchComments, addComment, deleteComment, updateComment } = useCookingPosts(); // Ambil updateComment dari context
  const { language, t } = useLanguage();
  const comments = getComments(post?.id);
  const commentsEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      // Focus textarea ketika modal terbuka
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && post?.id) {
      fetchComments(post.id);
    }
  }, [isOpen, post?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (editingCommentId) {
      // Logic untuk UPDATE KOMENTAR ke Backend jika sedang dalam mode edit
      await updateComment(post.id, editingCommentId, commentText.trim());
      setEditingCommentId(null);
    } else {
      // Logic untuk TAMBAH KOMENTAR BARU ke Backend
      await addComment(post.id, commentText.trim());
      toast.success(t("comments.added"));
    }

    setCommentText("");

    // Reset tinggi textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Gulirkan layar ke bawah setelah selesai submit
    setTimeout(scrollToBottom, 100);
  };

  const handleDelete = (commentId) => {
    if (window.confirm(t("comments.confirm_delete"))) {
      deleteComment(post.id, commentId);
      toast.success(t("comments.deleted"));
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffMs = now - commentDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t("comments.just_now");
    if (diffMins < 60) return t("comments.minutes_ago", { count: diffMins });
    if (diffHours < 24) return t("comments.hours_ago", { count: diffHours });
    if (diffDays < 7) return t("comments.days_ago", { count: diffDays });
    return commentDate.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!post) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl shadow-xl max-h-[85vh] flex flex-col"
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-muted rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {t("comments.title")} ({comments.length})
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-3"
                    >
                      {/* Avatar - Menggunakan Inisial jika tidak ada foto */}
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex-shrink-0 flex items-center justify-center border border-primary/20">
                        {comment.userAvatar ? (
                          <img
                            src={comment.userAvatar}
                            alt={comment.userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-primary font-bold text-xs">
                            {(comment.userName || "U")[0].toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1 min-w-0">
                        <div className="bg-muted rounded-2xl px-4 py-3 relative group">
                          <p className="font-bold text-xs text-primary">
                            {comment.userName || t("home.guest")}
                          </p>
                          
                          {/* Teks Komentar */}
                          <p className="text-sm mt-1 break-words text-slate-700">
                            {comment.text}
                          </p>
                        </div>

                        {/* Actions: Time, Edit, Delete */}
                        <div className="flex items-center gap-3 mt-1 px-2">
                          <span className="text-[10px] text-muted-foreground">
                            {getTimeAgo(comment.createdAt)}
                          </span>

                          {/* HANYA MUNCUL JIKA MILIK USER YANG LOGIN */}
                          {Number(comment.userId) === Number(user?.id) && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setCommentText(comment.text); // Set teks komentar lama ke kolom textarea input agar siap diedit
                                  textareaRef.current?.focus();
                                }}
                                className="text-[10px] font-medium text-primary hover:underline flex items-center gap-1"
                              >
                                <Edit2 className="h-3 w-3" />
                                {t("common.edit")}
                              </button>
                              <button
                                onClick={() => handleDelete(comment.id)}
                                className="text-[10px] font-medium text-destructive hover:underline flex items-center gap-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                {t("common.delete")}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">{t("comments.empty")}</p>
                  <p className="text-xs mt-1">{t("comments.be_first")}</p>
                </div>
              )}
              <div ref={commentsEndRef} />
            </div>

            {/* Input Form */}
            <div className="px-6 py-4 border-t border-border bg-background">
              <form onSubmit={handleSubmit} className="flex gap-3 items-end">
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={editingCommentId ? t("comments.edit_placeholder") : t("comments.write_placeholder")}
                    rows={1}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-muted rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm max-h-32"
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                </div>
                
                {/* Tombol Batal jika dalam mode Edit */}
                {editingCommentId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCommentId(null);
                      setCommentText("");
                    }}
                    className="text-xs text-muted-foreground px-2 py-3 hover:underline"
                  >
                    {t("common.cancel")}
                  </button>
                )}

                <motion.button
                  type="submit"
                  disabled={!commentText.trim()}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-primary text-primary-foreground rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 transition-all hover:bg-primary/90"
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
