// contexts/UserContext.tsx
"use client"; // Assurez-vous que ce composant est côté client

import React, { createContext, useContext, useState } from "react";

interface UserContextType {
  email: string;
  setEmail: (email: string) => void;
  userId: number | null;
  setUserId: (userId: number | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState<string>('');
  const [userId, setUserId] = useState<number | null>(null);

  return (
    <UserContext.Provider value={{ email, setEmail, userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
