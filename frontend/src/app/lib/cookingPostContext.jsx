import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner"; // Pastikan sonner tetap ada

const CookingPostsContext = createContext(null);

// URL Backend kalian
const API_URL = 'http://localhost:3000/api';

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
  const [posts, setPosts] = useState(initialPosts);
  const [myPosts, setMyPosts] = useState([]);
  const [comments, setComments] = useState({});

  // FITUR 1: POST MASAKAN KE BACKEND
  const addPost = async (post) => {
    try {
      // 1. Tembak ke API Backend
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeName: post.recipeName || "Masakan Baru",
          description: post.description || "",
          image: post.image || "", // Pastikan mengirim base64 atau URL
          privacy: post.privacy || "public"
        })
      });

      if (response.ok) {
        // 2. Update UI jika berhasil
        const newPost = {
          ...post,
          id: Date.now(), // Gunakan ID sementara untuk UI
          userId: "currentUser",
          userName: "Guest",
          userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
          likes: 0,
          comments: 0,
          createdAt: new Date().toISOString(),
        };
        
        setMyPosts([newPost, ...myPosts]);
        if (post.privacy === "public") {
          setPosts([newPost, ...posts]);
        }
      } else {
        console.error("Gagal simpan ke database");
      }
    } catch (error) {
      console.error("Error API:", error);
    }
  };

  // FITUR 2: HAPUS MASAKAN DARI BACKEND
  const deletePost = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE'
      });
      
      // Update UI (Optimistic Delete)
      setMyPosts(myPosts.filter((post) => post.id !== postId));
      setPosts(posts.filter((post) => post.id !== postId));
      const newComments = { ...comments };
      delete newComments[postId];
      setComments(newComments);
      
    } catch (error) {
      console.error("Error delete API:", error);
    }
  };

  const updatePostPrivacy = (postId, newPrivacy) => {
    setMyPosts(myPosts.map((post) => post.id === postId ? { ...post, privacy: newPrivacy } : post));
    setPosts(posts.map((post) => post.id === postId ? { ...post, privacy: newPrivacy } : post));
  };

  const getPublicPosts = () => posts.filter((post) => post.privacy === "public");
  const getFriendsPosts = () => posts.filter((post) => post.privacy === "public" || post.privacy === "friends");
  const getComments = (postId) => comments[postId] || [];

  // FITUR 3: POST KOMENTAR KE BACKEND
  const addComment = async (postId, text) => {
    try {
      // 1. Tembak ke API Backend
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: postId, text: text })
      });

      // 2. Update UI secara instan
      const newComment = {
        id: Date.now(),
        userId: "currentUser",
        userName: "Guest",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        text,
        createdAt: new Date().toISOString(),
      };

      setComments({
        ...comments,
        [postId]: [...(comments[postId] || []), newComment],
      });

      const updateCommentCount = (postList) => postList.map((post) =>
          post.id === postId ? { ...post, comments: (post.comments || 0) + 1 } : post
      );
      setPosts(updateCommentCount(posts));
      setMyPosts(updateCommentCount(myPosts));

      return newComment;
    } catch (error) {
      console.error("Error post komentar:", error);
    }
  };

  // FITUR 4: HAPUS KOMENTAR DARI BACKEND
  const deleteComment = async (postId, commentId) => {
    try {
      await fetch(`${API_URL}/comments/${commentId}`, { method: 'DELETE' });
      
      setComments({
        ...comments,
        [postId]: (comments[postId] || []).filter((c) => c.id !== commentId),
      });

      const updateCommentCount = (postList) => postList.map((post) =>
          post.id === postId ? { ...post, comments: Math.max((post.comments || 0) - 1, 0) } : post
      );
      setPosts(updateCommentCount(posts));
      setMyPosts(updateCommentCount(myPosts));
    } catch (error) {
      console.error("Error delete komentar:", error);
    }
  };

  return (
    <CookingPostsContext.Provider
      value={{
        posts, myPosts, addPost, deletePost, updatePostPrivacy,
        getPublicPosts, getFriendsPosts, getComments, addComment, deleteComment,
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
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
    recipeName: "Pancake Blueberry",
    description: "Pancake fluffy dengan topping blueberry segar",
    privacy: "friends",
    likes: 18,
    comments: 3,
    createdAt: "2026-03-28T08:15:00",
  },
];

export function CookingPostsProvider({ children }) {
  const [posts, setPosts] = useState(initialPosts);
  const [myPosts, setMyPosts] = useState([
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
      recipeName: "Salad Buah Tropis",
      description: "Campuran buah segar dengan yogurt",
      privacy: "public",
      likes: 15,
      comments: 2,
      createdAt: "2026-03-31T09:00:00",
    },
  ]);

  // Comments data structure: { postId: [comments] }
  const [comments, setComments] = useState({
    1: [
      {
        id: 1,
        userId: "user2",
        userName: "John Doe",
        userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
        text: "Looks delicious! 😋",
        createdAt: "2026-03-30T11:00:00",
      },
      {
        id: 2,
        userId: "currentUser",
        userName: "Guest",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        text: "Saya juga mau coba resep ini!",
        createdAt: "2026-03-30T12:30:00",
      },
    ],
    2: [
      {
        id: 3,
        userId: "user1",
        userName: "Sarah Chen",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        text: "Pizza terbaik yang pernah saya lihat!",
        createdAt: "2026-03-29T19:00:00",
      },
    ],
  });

  const addPost = (post) => {
    const newPost = {
      ...post,
      id: Date.now(),
      userId: "currentUser",
      userName: "Guest",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
    };
    setMyPosts([newPost, ...myPosts]);
    if (post.privacy === "public") {
      setPosts([newPost, ...posts]);
    }
  };

  const deletePost = (postId) => {
    setMyPosts(myPosts.filter((post) => post.id !== postId));
    setPosts(posts.filter((post) => post.id !== postId));
    // Also delete comments for this post
    const newComments = { ...comments };
    delete newComments[postId];
    setComments(newComments);
  };

  const updatePostPrivacy = (postId, newPrivacy) => {
    setMyPosts(
      myPosts.map((post) =>
        post.id === postId ? { ...post, privacy: newPrivacy } : post
      )
    );
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, privacy: newPrivacy } : post
      )
    );
  };

  const getPublicPosts = () => {
    return posts.filter((post) => post.privacy === "public");
  };

  const getFriendsPosts = () => {
    return posts.filter((post) => 
      post.privacy === "public" || post.privacy === "friends"
    );
  };

  // Comment functions
  const getComments = (postId) => {
    return comments[postId] || [];
  };

  const addComment = (postId, text) => {
    const newComment = {
      id: Date.now(),
      userId: "currentUser",
      userName: "Guest",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      text,
      createdAt: new Date().toISOString(),
    };

    setComments({
      ...comments,
      [postId]: [...(comments[postId] || []), newComment],
    });

    // Update comment count in posts
    const updateCommentCount = (postList) =>
      postList.map((post) =>
        post.id === postId
          ? { ...post, comments: (post.comments || 0) + 1 }
          : post
      );

    setPosts(updateCommentCount(posts));
    setMyPosts(updateCommentCount(myPosts));

    return newComment;
  };

  const deleteComment = (postId, commentId) => {
    setComments({
      ...comments,
      [postId]: (comments[postId] || []).filter((c) => c.id !== commentId),
    });

    // Update comment count in posts
    const updateCommentCount = (postList) =>
      postList.map((post) =>
        post.id === postId
          ? { ...post, comments: Math.max((post.comments || 0) - 1, 0) }
          : post
      );

    setPosts(updateCommentCount(posts));
    setMyPosts(updateCommentCount(myPosts));
  };

  return (
    <CookingPostsContext.Provider
      value={{
        posts,
        myPosts,
        addPost,
        deletePost,
        updatePostPrivacy,
        getPublicPosts,
        getFriendsPosts,
        getComments,
        addComment,
        deleteComment,
      }}
    >
      {children}
    </CookingPostsContext.Provider>
  );
}

export function useCookingPosts() {
  const context = useContext(CookingPostsContext);
  if (!context) {
    throw new Error("useCookingPosts must be used within a CookingPostsProvider");
  }
  return context;
}
