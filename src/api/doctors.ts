import api from "./axios";
import { DOCTORS, Doctor } from "@/data/doctors";

function mockToProfile(d: Doctor, idx: number): DoctorProfile {
  return {
    id: idx + 1,
    fullName: d.name,
    email: "",
    profileImage: d.avatar, // always set — randomuser.me gender-correct URL
    gender: d.gender, // pass through so DoctorCard fallback is correct too
    specialty: d.specialty,
    specialtyAr: d.specialtyAr,
    bio: d.about,
    city: d.city,
    cityAr: d.cityAr,
    area: d.area,
    yearsOfExperience: d.experience,
    consultationFee: d.fee,
    rating: d.rating,
    reviewsCount: d.reviews,
    isVerified: idx % 3 !== 0,
    isAvailable: d.availableToday,
    phone: d.languages ? d.languages[0] : "",
    licenseNumber: `LIC-${2005 + (idx % 10)}-${String(idx + 1).padStart(3, "0")}`,
    university: ["Cairo University", "Ain Shams University", "Alexandria University"][idx % 3],
    languages: d.languages,
    videoConsult: d.videoConsult,
    homeVisit: d.homeVisit,
  } as unknown as DoctorProfile;
}

export interface DoctorProfile {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  specialty: string;
  specialtyAr?: string;
  bio?: string;
  bioAr?: string;
  city?: string;
  cityAr?: string;
  area?: string;
  licenseNumber?: string;
  university?: string;
  yearsOfExperience: number;
  consultationFee: number;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  isAvailable: boolean;
}

export interface DoctorSearchParams {
  specialty?: string;
  city?: string;
  name?: string;
  maxFee?: number;
  isAvailable?: boolean;
}

export interface CreateDoctorData {
  fullName: string;
  email: string;
  password: string;
  specialty: string;
  specialtyAr?: string;
  bio?: string;
  bioAr?: string;
  city?: string;
  cityAr?: string;
  area?: string;
  licenseNumber?: string;
  university?: string;
  yearsOfExperience: number;
  consultationFee: number;
  phone?: string;
}

export interface UpdateDoctorData {
  bio?: string;
  bioAr?: string;
  city?: string;
  cityAr?: string;
  area?: string;
  university?: string;
  yearsOfExperience: number;
  consultationFee: number;
  phone?: string;
  isAvailable: boolean;
}

export const doctorsApi = {
  getAll: async (
    params?: DoctorSearchParams & { page?: number; pageSize?: number },
  ): Promise<DoctorProfile[]> => {
    try {
      const response = await api.get<{
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        items: DoctorProfile[];
      }>("/Doctors", { params });
      // ✅ أضف الـ base URL لأي صورة مرفوعة على الـ server
      return response.data.items.map((d) => {
        if (d.profileImage?.startsWith("/uploads/")) {
d.profileImage = `${import.meta.env.VITE_API_URL?.replace('/api', '')}${d.profileImage}`;
        }
        // ✅ لو مفيش صورة من الـ backend، جيب من الـ mock بالاسم
        if (!d.profileImage) {
          const mock = DOCTORS.find((m) => m.name.toLowerCase() === d.fullName?.toLowerCase());
          if (mock) d.profileImage = mock.avatar;
        }
        return d;
      });
    } catch {
      // fallback to mock data when backend is offline
      return DOCTORS.filter((d) => {
        // ✅ exact match للـ specialty عشان "ENT" ميطلعش "Dentistry"
        if (params?.specialty && d.specialty.toLowerCase() !== params.specialty.toLowerCase())
          return false;
        if (params?.city && !d.city.toLowerCase().includes(params.city.toLowerCase())) return false;
        if (
          params?.name &&
          !d.name.toLowerCase().includes(params.name.toLowerCase()) &&
          !d.specialty.toLowerCase().includes(params.name.toLowerCase())
        )
          return false;
        if (params?.isAvailable && !d.availableToday) return false;
        return true;
      }).map(mockToProfile);
    }
  },

  getById: async (id: number): Promise<DoctorProfile> => {
    try {
      const response = await api.get<DoctorProfile>(`/Doctors/${id}`);
      const data = response.data;
      if (!data.profileImage) {
        // ✅ ابحث بالاسم اولاً عشان الصورة تكون صح دايماً
        const doc =
          DOCTORS.find((d) => d.name.toLowerCase() === (data.fullName ?? "").toLowerCase()) ??
          DOCTORS[(id - 1) % DOCTORS.length];
        if (doc) data.profileImage = doc.avatar;
      } else if (data.profileImage.startsWith("/uploads/")) {
        // ✅ أضف الـ base URL للصور المرفوعة
        data.profileImage = `${import.meta.env.VITE_API_URL?.replace('/api', '')}${data.profileImage}`;
      }
      return data;
    } catch {
      // fallback — ابحث بالـ index
      const idx = id - 1;
      const doc = DOCTORS[idx] ?? DOCTORS[id % DOCTORS.length];
      if (doc) return mockToProfile(doc, DOCTORS.indexOf(doc));
      throw new Error("Doctor not found");
    }
  },

  create: async (data: CreateDoctorData): Promise<{ message: string; doctorId: number }> => {
    const response = await api.post("/Doctors", data);
    return response.data;
  },

  update: async (id: number, data: UpdateDoctorData): Promise<{ message: string }> => {
    const response = await api.put(`/Doctors/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/Doctors/${id}`);
    return response.data;
  },

  uploadImage: async (doctorId: number, file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<{ message: string; imageUrl: string }>(
      `/Doctors/${doctorId}/upload-image`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return { imageUrl: response.data.imageUrl };
  },
};
