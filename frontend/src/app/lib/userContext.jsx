import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  // 1. Baca data dari localStorage saat aplikasi pertama kali dimuat
  const [user, setUserState] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  // 2. Update state DAN simpan ke localStorage setiap ada perubahan
  const setUser = (newUser) => {
    if (newUser) {
      const updatedUser = {
        ...newUser,
        isPremium: newUser.isPremium || false,
        nameChangeCount: newUser.nameChangeCount || 0,
      };
      setUserState(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Simpan ke memori browser
    } else {
      setUserState(null);
      localStorage.removeItem("user"); // Hapus memori saat logout
    }
  };

  const updateUserName = (name) => {
    if (user) {
      const updated = {
        ...user,
        name,
        nameChangeCount: (user.nameChangeCount || 0) + 1,
      };
      setUserState(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    }
  };

  const canChangeName = () => {
    if (!user) return false;
    // Premium users can change name unlimited times
    if (user.isPremium) return true;
    // Free users can only change once
    return (user.nameChangeCount || 0) < 1;
  };

  const upgradeToPremium = () => {
    if (user) {
      const updated = { ...user, isPremium: true };
      setUserState(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, updateUserName, canChangeName, upgradeToPremium }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}