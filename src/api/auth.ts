import api from "./axios";

export interface AuthResponse {
  token: string;
  fullName: string;
  email: string;
  role: string;
  userId: number;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/Auth/register", data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/Auth/login", data);
    return response.data;
  },
};

export const saveAuth = (data: AuthResponse) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cliniq_token", data.token);
    localStorage.setItem("cliniq_user", JSON.stringify(data));
  }
};

export const getAuth = (): AuthResponse | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("cliniq_user");
  return user ? JSON.parse(user) : null;
};

export const clearAuth = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cliniq_token");
    localStorage.removeItem("cliniq_user");
  }
};
