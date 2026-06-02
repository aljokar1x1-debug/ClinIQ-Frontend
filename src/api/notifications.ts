import api from "./axios";

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>("/Notifications");
    return response.data;
  },

  markAsRead: async (id: number): Promise<{ message: string }> => {
    const response = await api.put(`/Notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await api.put("/Notifications/read-all");
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/Notifications/${id}`);
    return response.data;
  },
};
