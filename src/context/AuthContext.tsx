// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isAuthenticated, saveToken, clearSession, getToken } from "../auth";
import API  from "../api/axios";
type AuthContextType = {
  loggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(isAuthenticated());

  useEffect(() => {
    // re-validate on mount in case token expired while app was closed
    setLoggedIn(isAuthenticated());
  }, []);

  const login = (token: string) => {
    saveToken(token);
    setLoggedIn(true);
  };

  const logout = async () => {
    console.log("Logout called")
    const res=await API.post("/boards/logout", {});
    if(res.status==200){
        clearSession();
        setLoggedIn(false);
        // navigate("/login");
        window.location.reload();
    }
  };

  const value = useMemo(() => ({ loggedIn, login, logout }), [loggedIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
