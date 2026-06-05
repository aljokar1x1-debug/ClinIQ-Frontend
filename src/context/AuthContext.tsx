import { createContext, useContext, useState, ReactNode } from "react";
import { authApi, saveAuth, getAuth, clearAuth, AuthResponse } from "@/api/auth";

interface AuthContextType {
  user: AuthResponse | null;
  profileImage: string | null;
  setProfileImage: (url: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  setAuthData: (data: AuthResponse) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(getAuth());
  const [profileImage, setProfileImageState] = useState<string | null>(() => {
    const u = getAuth();
    if (!u) return null;
    return localStorage.getItem(`profile_image_${u.userId}`) ?? null;
  });

  const setProfileImage = (url: string) => {
    setProfileImageState(url);
    const u = getAuth();
    if (u) localStorage.setItem(`profile_image_${u.userId}`, url);
  };

  const login = async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    saveAuth(data);
    setUser(data);
    const saved = localStorage.getItem(`profile_image_${data.userId}`);
    if (saved) setProfileImageState(saved);
  };

  const register = async (fullName: string, email: string, password: string, role: string) => {
    const data = await authApi.register({ fullName, email, password, role });
    saveAuth(data);
    setUser(data);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setProfileImageState(null);
  };

  const setAuthData = (data: AuthResponse) => {
    saveAuth(data);
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, profileImage, setProfileImage, login, register, logout, setAuthData, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
