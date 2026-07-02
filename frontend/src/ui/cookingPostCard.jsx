import { motion } from "framer-motion";
import { Heart, MessageCircle, MoreVertical, Globe, Users, Lock, Trash2, Edit } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdownMenu";
import { CommentsModal } from "./commentsModal";
import { useCookingPosts } from "../app/lib/cookingPostContext.jsx";
import { useLanguage } from "../app/lib/languageContext.jsx";
 
export function CookingPostCard({ post, isMyPost = false, onDelete, onUpdatePrivacy }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const { getComments } = useCookingPosts(); // Ambil dari context
  const { language, t } = useLanguage();
  
  // Gunakan jumlah komentar dari database, atau fallback ke jumlah di context (real-time)
  const displayCommentCount = getComments(post.id).length || post.comments || 0;

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
        return t("home.public");
      case "friends":
        return t("home.friends");
      case "private":
        return t("post.private");
      default:
        return t("home.public");
    }
  };
 
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
 
    if (diffMins < 1) return language === "id" ? "Baru saja" : "Just now";
    if (diffMins < 60) return language === "id" ? `${diffMins} menit lalu` : `${diffMins} minutes ago`;
    if (diffHours < 24) return language === "id" ? `${diffHours} jam lalu` : `${diffHours} hours ago`;
    if (diffDays < 7) return language === "id" ? `${diffDays} hari lalu` : `${diffDays} days ago`;
    return postDate.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border"
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
            <p className="font-medium text-sm text-foreground">{post.userName || t("home.guest")}</p>
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
            <DropdownMenuContent align="end" className="bg-card text-foreground shadow-lg rounded-xl border border-border">
              <DropdownMenuItem onClick={() => onUpdatePrivacy?.(post.id, "public")}>
                <Globe className="h-4 w-4 mr-2" />
                {t("home.public")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdatePrivacy?.(post.id, "friends")}>
                <Users className="h-4 w-4 mr-2" />
                {t("home.friends")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdatePrivacy?.(post.id, "private")}>
                <Lock className="h-4 w-4 mr-2" />
                {t("post.private")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(post.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t("common.delete")}
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
            <span>{displayCommentCount}</span>
          </button>
        </div>
 
        {/* Caption */}
        <div>
          <p className="font-medium text-foreground">{post.recipeName}</p>
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
 
