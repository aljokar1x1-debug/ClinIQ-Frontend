import api from "./axios";

export interface SlotData {
  bookedSlots: { date: string; time: string }[];
  blockedSlots: { date: string; time: string }[];
}

export const scheduleApi = {
  getSlots: async (doctorId: number, date?: string): Promise<SlotData> => {
    const response = await api.get(`/Schedule/${doctorId}`, {
      params: date ? { date } : {},
    });
    return response.data;
  },

  toggleSlot: async (date: string, time: string): Promise<{ message: string }> => {
    const response = await api.put("/Schedule/toggle", { date, time });
    return response.data;
  },
};
