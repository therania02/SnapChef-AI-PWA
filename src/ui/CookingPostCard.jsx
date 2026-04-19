import { motion } from "framer-motion";
import { Heart, MessageCircle, MoreVertical, Globe, Users, Lock, Trash2, Edit } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { CommentsModal } from "./CommentsModal";

export function CookingPostCard({ post, isMyPost = false, onDelete, onUpdatePrivacy }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case "public":
        return <Globe className="h-3 w-3" />;
      case "friends":
        return <Users className="h-3 w-3" />;
      case "private":
        return <Lock className="h-3 w-3" />;
      default:
        return <Globe className="h-3 w-3" />;
    }
  };

  const getPrivacyLabel = (privacy) => {
    switch (privacy) {
      case "public":
        return "Publik";
      case "friends":
        return "Teman";
      case "private":
        return "Privat";
      default:
        return "Publik";
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return postDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
            {post.userAvatar ? (
              <img
                src={post.userAvatar}
                alt={post.userName || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                ?
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-sm">{post.userName || "Guest"}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{getTimeAgo(post.createdAt)}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                {getPrivacyIcon(post.privacy)}
                <span>{getPrivacyLabel(post.privacy)}</span>
              </div>
            </div>
          </div>
        </div>

        {isMyPost && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onUpdatePrivacy?.(post.id, "public")}>
                <Globe className="h-4 w-4 mr-2" />
                Ubah ke Publik
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdatePrivacy?.(post.id, "friends")}>
                <Users className="h-4 w-4 mr-2" />
                Ubah ke Teman
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdatePrivacy?.(post.id, "private")}>
                <Lock className="h-4 w-4 mr-2" />
                Ubah ke Privat
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(post.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Image */}
      <div className="aspect-[4/3] bg-muted">
        <img
          src={post.image}
          alt={post.recipeName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className="flex items-center gap-2 text-sm"
          >
            <Heart
              className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""
                }`}
            />
            <span className={liked ? "text-red-500" : ""}>{likesCount}</span>
          </motion.button>
          <button
            className="flex items-center gap-2 text-sm"
            onClick={() => setShowComments(true)}
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments}</span>
          </button>
        </div>

        {/* Caption */}
        <div>
          <p className="font-medium">{post.recipeName}</p>
          {post.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {post.description}
            </p>
          )}
        </div>
      </div>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        post={post}
      />
    </motion.div>
  );
}