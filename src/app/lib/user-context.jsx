import React, { createContext, useContext, useState } from "react";



const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUserState] = useState(null);

  const setUser = (newUser) => {
    if (newUser) {
      setUserState({
        ...newUser,
        isPremium: newUser.isPremium || false,
        nameChangeCount: newUser.nameChangeCount || 0,
      });
    } else {
      setUserState(null);
    }
  };

  const updateUserName = (name) => {
    if (user) {
      setUserState({
        ...user,
        name,
        nameChangeCount: (user.nameChangeCount || 0) + 1,
      });
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
      setUserState({ ...user, isPremium: true });
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