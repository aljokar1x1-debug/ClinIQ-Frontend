import api from "./axios";

export interface MedicalRecord {
  id: number;
  type: string;
  title: string;
  notes?: string;
  date: string;
  doctorName?: string;
}

export const medicalRecordsApi = {
  getMy: async (): Promise<MedicalRecord[]> => {
    const response = await api.get<MedicalRecord[]>("/MedicalRecords/my");
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/MedicalRecords/${id}`);
    return response.data;
  },
};
