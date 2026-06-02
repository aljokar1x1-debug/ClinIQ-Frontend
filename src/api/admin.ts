import api from "./axios";
import { DoctorProfile } from "./doctors";
import { AppointmentResponse } from "./appointments";

export interface AdminStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
}

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get<AdminStats>("/Admin/stats");
    return response.data;
  },

  getUsers: async (): Promise<AdminUser[]> => {
    const response = await api.get<AdminUser[]>("/Admin/users");
    return response.data;
  },

  toggleUser: async (id: number): Promise<{ message: string }> => {
    const response = await api.put(`/Admin/users/${id}/toggle`);
    return response.data;
  },

  getAllAppointments: async (): Promise<AppointmentResponse[]> => {
    const response = await api.get<AppointmentResponse[]>("/Admin/appointments");
    return response.data;
  },

  getAllDoctors: async (): Promise<DoctorProfile[]> => {
    const response = await api.get<DoctorProfile[]>("/Admin/doctors");
    return response.data;
  },

  verifyDoctor: async (id: number): Promise<{ message: string }> => {
    const response = await api.put(`/Admin/doctors/${id}/verify`);
    return response.data;
  },

  // في الـ adminApi object ضيف:
  getRevenue: async () => {
    const response = await api.get("/Admin/revenue");
    return response.data;
  },
};
