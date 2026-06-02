import { createContext, useContext, useState, ReactNode } from "react";
import { authApi, saveAuth, getAuth, clearAuth, AuthResponse } from "@/api/auth";

interface AuthContextType {
  user: AuthResponse | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  setAuthData: (data: AuthResponse) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(getAuth());

  const login = async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    saveAuth(data);
    setUser(data);
  };

  const register = async (fullName: string, email: string, password: string, role: string) => {
    const data = await authApi.register({ fullName, email, password, role });
    saveAuth(data);
    setUser(data);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  const setAuthData = (data: AuthResponse) => {
    saveAuth(data);
    setUser(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        setAuthData,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
