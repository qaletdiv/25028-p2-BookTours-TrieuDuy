"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSession, getUsers, saveSession, saveUsers } from "@/lib/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getSession());
    setLoading(false);
  }, []);

  const register = ({ fullName, email, phone, password }) => {
    const users = getUsers();
    if (users.some((u) => u.email === email.toLowerCase())) {
      return { success: false, error: "Email đã được đăng ký" };
    }

    const newUser = {
      id: Date.now().toString(),
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
      address: "",
    };

    users.push(newUser);
    saveUsers(users);
    return { success: true };
  };

  const login = ({ email, password }) => {
    const users = getUsers();
    const found = users.find(
      (u) => u.email === email.toLowerCase().trim() && u.password === password
    );

    if (!found) {
      return { success: false, error: "Email hoặc mật khẩu không đúng" };
    }

    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    saveSession(safeUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    saveSession(null);
  };

  const updateProfile = (updates) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return;

    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);

    const { password: _, ...safeUser } = users[idx];
    setUser(safeUser);
    saveSession(safeUser);
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
