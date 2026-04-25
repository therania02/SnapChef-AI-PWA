import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCookingPosts } from "../app/lib/cooking-post-context";
import { toast } from "sonner";

export function CommentsModal({ isOpen, onClose, post }) {
  const [commentText, setCommentText] = useState("");
  const { getComments, addComment, deleteComment } = useCookingPosts();
  const comments = getComments(post?.id);
  const commentsEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      // Focus textarea when modal opens
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(post.id, commentText.trim());
    setCommentText("");
    toast.success("Komentar berhasil ditambahkan!");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    
    // Scroll to bottom after adding comment
    setTimeout(scrollToBottom, 100);
  };

  const handleDelete = (commentId) => {
    deleteComment(post.id, commentId);
    toast.success("Komentar berhasil dihapus!");
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffMs = now - commentDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return commentDate.toLocaleDateString("id-ID", {
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
                Komentar ({comments.length})
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
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        {comment.userAvatar ? (
                          <img
                            src={comment.userAvatar}
                            alt={comment.userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                            ?
                          </div>
                        )}
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1 min-w-0">
                        <div className="bg-muted rounded-2xl px-4 py-3">
                          <p className="font-medium text-sm">
                            {comment.userName}
                          </p>
                          <p className="text-sm mt-1 break-words">
                            {comment.text}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-1 px-4">
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(comment.createdAt)}
                          </span>
                          {comment.userId === "currentUser" && (
                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="text-xs text-destructive hover:underline flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Hapus
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">Belum ada komentar</p>
                  <p className="text-xs mt-1">Jadilah yang pertama berkomentar!</p>
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
                    placeholder="Tulis komentar..."
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