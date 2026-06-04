"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api, getApiSessionId, setApiSessionId } from "@/lib/api-client";
import { getSession, saveSession } from "@/lib/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const cached = getSession();
      if (cached) setUser(cached);

      if (getApiSessionId()) {
        try {
          const res = await fetch("/api/auth/session", {
            headers: { "X-Session-Id": getApiSessionId() },
          });
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            saveSession(data.user);
          }
        } catch {
          /* keep cached session */
        }
      }

      setLoading(false);
    }

    loadSession();
  }, []);

  const register = async ({ fullName, email, phone, password }) => {
    try {
      await api.register({ fullName, email, phone, password });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const login = async ({ email, password }) => {
    try {
      const data = await api.login({ email, password });
      setApiSessionId(data.sessionId);
      setUser(data.user);
      saveSession(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      /* ignore */
    }
    setApiSessionId(null);
    setUser(null);
    saveSession(null);
  };

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: "Chưa đăng nhập" };

    try {
      const data = await api.updateUser(user.id, updates);
      setUser(data.user);
      saveSession(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
