import api from "./axios";

export interface CreateAppointmentData {
  doctorId: number;
  appointmentDate: string;
  timeSlot: string;
  type: string;
  notes?: string;
}

export interface AppointmentResponse {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  specialty: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  type: string;
  notes?: string;
  fee: number;
  createdAt: string;
}

export const appointmentsApi = {
  getMy: async (): Promise<AppointmentResponse[]> => {
    const response = await api.get<AppointmentResponse[]>("/Appointments/my");
    return response.data;
  },

  create: async (
    data: CreateAppointmentData,
  ): Promise<{ message: string; appointmentId: number }> => {
    const response = await api.post("/Appointments", data);
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<{ message: string }> => {
    const response = await api.put(`/Appointments/${id}/status`, { status });
    return response.data;
  },

  cancel: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/Appointments/${id}`);
    return response.data;
  },
};
