"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { loadAuth, saveAuth, clearAuth } from "@/lib/utils/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { token: t, user: u } = loadAuth();
    if (t) setToken(t);
    if (u) setUser(u);
  }, []);

  const signIn = ({ token: t, user: u }) => {
    setToken(t);
    setUser(u);
    saveAuth(t, u);
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ token, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
