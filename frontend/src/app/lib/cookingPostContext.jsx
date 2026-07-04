import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner"; // Pastikan sonner tetap ada
import { useUser } from "../lib/userContext.jsx";
import { API_BASE_URL } from "../api/config";

const CookingPostsContext = createContext(null);

// URL Backend kalian
const API_URL = `${API_BASE_URL}/api`;

// Helper function untuk mendapatkan auth token
const getAuthToken = () => {
  // Try 1: Check localStorage.token (stored separately in login.jsx)
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    return storedToken;
  }

  // Try 2: Check localStorage.user.token (stored as part of user object)
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData.token) {
        return userData.token;
      }
    } catch (error) {
      console.warn("Error parsing user from localStorage:", error);
    }
  }

  return "";
};

// Helper function untuk membuat headers dengan auth
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Mock data (tetap dibiarkan agar UI tidak kosong saat pertama kali load)
const initialPosts = [
  {
    id: 1,
    userId: "user1",
    userName: "Sarah Chen",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
    recipeName: "Salad Segar",
    description: "Salad sayuran segar dengan dressing lemon",
    privacy: "public",
    likes: 24,
    comments: 5,
    createdAt: "2026-03-30T10:30:00",
  }
];

export function CookingPostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [comments, setComments] = useState({});
  const { user } = useUser();
  const userId = user?.id || "user1";
  const userName = user?.name || "Guest";

  // // 1. Ambil data user yang sedang login dari localStorage
  // const user = JSON.parse(localStorage.getItem("user") || "{}");
  // const userId = user.id;
  // const userName = user.name || "Guest";

  // FITUR 1: AMBIL POSTINGAN DARI BACKEND
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        headers: getAuthHeaders()
      });
      const result = await response.json();

      // Pastikan mengambil properti 'data' dari dalam objek hasil respons
      const actualPosts = result.data?.data || [];

      if (response.ok) {
        setPosts(actualPosts);

        // GUNAKAN == (double equals) atau konversi ke Number agar filter tidak gagal
        const mine = actualPosts.filter(p => Number(p.userId) === Number(userId));
        setMyPosts(mine);

        actualPosts.forEach(post => {
          fetchComments(post.id);
        });
      }
    } catch (error) {
      console.error("Gagal mengambil postingan:", error);
      setPosts([]); // Set ke array kosong jika error
    }
  };

  useEffect(() => {
    if (posts.length > 0 && userId) {
      const mine = posts.filter(p => Number(p.userId) === Number(userId));
      setMyPosts(mine);
    }
  }, [posts, userId]);

  // FITUR 2: POST MASAKAN KE BACKEND
  const addPost = async (post) => {
    if (!userId) {
      toast.error("Anda harus login untuk membuat postingan");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          recipeName: post.recipeName || "Masakan Baru",
          description: post.description || "",
          image: post.image || "",
          privacy: post.privacy || "public",
          userId: userId // KIRIM USER ID KE BACKEND
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Gunakan data asli dari database (result.data) untuk update UI
        const dbPost = {
          ...result.data,
          userName: userName, // Tambahkan info user untuk tampilan UI
          userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
          likes: 0,
          comments: 0
        };

        setMyPosts([dbPost, ...myPosts]);
        if (dbPost.privacy === "public") {
          setPosts([dbPost, ...posts]);
        }
        toast.success("Postingan berhasil dibagikan!");
      } else {
        toast.error(result.message || "Gagal simpan ke database");
      }
    } catch (error) {
      console.error("Error API:", error);
      toast.error("Terjadi kesalahan koneksi");
    }
  };

  // FITUR 3: HAPUS MASAKAN DARI BACKEND
  const deletePost = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId: userId }) // Mengirim userId untuk validasi kepemilikan
      });

      if (response.ok) {
        setMyPosts(myPosts.filter((post) => post.id !== postId));
        setPosts(posts.filter((post) => post.id !== postId));
        toast.success("Postingan berhasil dihapus");
      }
    } catch (error) {
      console.error("Error delete API:", error);
      toast.error("Gagal menghapus postingan");
    }
  };

  // FITUR 4: UPDATE POSTINGAN KE BACKEND
  const updatePost = async (postId, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...updatedData, userId: userId })
      });

      if (response.ok) {
        const updateState = (list) => list.map((p) => p.id === postId ? { ...p, ...updatedData } : p);
        setPosts(updateState(posts));
        setMyPosts(updateState(myPosts));
        toast.success("Postingan berhasil diperbarui");
      }
    } catch (error) {
      console.error("Error update post:", error);
      toast.error("Gagal memperbarui postingan");
    }
  };

  const updatePostPrivacy = (postId, newPrivacy) => {
    setMyPosts(myPosts.map((post) => post.id === postId ? { ...post, privacy: newPrivacy } : post));
    setPosts(posts.map((post) => post.id === postId ? { ...post, privacy: newPrivacy } : post));
  };

  const getPublicPosts = () => (Array.isArray(posts) ? posts.filter((post) => post.privacy === "public") : []);
  const getFriendsPosts = () => (Array.isArray(posts) ? posts.filter((post) => post.privacy === "public" || post.privacy === "friends") : []);
  const getComments = (postId) => comments[postId] || [];

  // FITUR 5: AMBIL KOMENTAR DARI BACKEND
  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/comments?postId=${postId}`, {
        headers: getAuthHeaders()
      });
      const result = await response.json();

      const commentData = result.data?.data || [];

      if (response.ok) {
        setComments(prev => ({
          ...prev,
          [postId]: commentData
        }));
      }
    } catch (error) {
      console.error("Gagal ambil komentar:", error);
    }
  };

  // FITUR 6: POST KOMENTAR KE BACKEND
  const addComment = async (postId, text) => {
    if (!userId) {
      toast.error("Silahkan login untuk berkomentar");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          postId: postId,
          text: text,
          userId: userId // KIRIM USER ID KE BACKEND
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const newComment = {
          ...result.data,
          userName: userName,
          userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        };

        setComments({
          ...comments,
          [postId]: [...(comments[postId] || []), newComment],
        });

        const updateCommentCount = (postList) => postList.map((p) =>
          p.id === postId ? { ...p, comments: (p.comments || 0) + 1 } : p
        );
        setPosts(updateCommentCount(posts));
        setMyPosts(updateCommentCount(myPosts));

        return newComment;
      }
    } catch (error) {
      console.error("Error post komentar:", error);
      toast.error("Gagal mengirim komentar");
    }
  };

  // FITUR 7: HAPUS KOMENTAR DARI BACKEND
  const deleteComment = async (postId, commentId) => {
    try {
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId: userId })
      });

      if (response.ok) {
        setComments({
          ...comments,
          [postId]: (comments[postId] || []).filter((c) => c.id !== commentId),
        });

        const updateCount = (list) => list.map((p) =>
          p.id === postId ? { ...p, comments: Math.max((p.comments || 0) - 1, 0) } : p
        );
        setPosts(updateCount(posts));
        setMyPosts(updateCount(myPosts));
        toast.success("Komentar dihapus");
      }
    } catch (error) {
      console.error("Error delete komentar:", error);
    }
  };

  // FITUR 8: UPDATE KOMENTAR KE BACKEND
  const updateComment = async (postId, commentId, newText) => {
    try {
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text: newText, userId: userId })
      });

      if (response.ok) {
        setComments({
          ...comments,
          [postId]: comments[postId].map((c) =>
            c.id === commentId ? { ...c, text: newText } : c
          ),
        });
        toast.success("Komentar diperbarui");
      }
    } catch (error) {
      console.error("Error update komentar:", error);
      toast.error("Gagal memperbarui komentar");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  return (
    <CookingPostsContext.Provider
      value={{
        posts, myPosts, addPost, deletePost, updatePost, updatePostPrivacy,
        getPublicPosts, getFriendsPosts, getComments, fetchComments, addComment, deleteComment, updateComment
      }}
    >
      {children}
    </CookingPostsContext.Provider>
  );
}

export function useCookingPosts() {
  const context = useContext(CookingPostsContext);
  if (!context) throw new Error("useCookingPosts must be used within a CookingPostsProvider");
  return context;
}