import api from "./axios";

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  patientName: string;
}

export interface AddReviewData {
  doctorId: number;
  rating: number;
  comment: string;
}

export const reviewsApi = {
  getDoctorReviews: async (doctorId: number): Promise<Review[]> => {
    const response = await api.get<Review[]>(`/Reviews/doctor/${doctorId}`);
    return response.data;
  },

  addReview: async (data: AddReviewData): Promise<{ message: string }> => {
    const response = await api.post("/Reviews", data);
    return response.data;
  },
};
