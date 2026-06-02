// Local-storage based image store. Stores base64 data URLs keyed by entity id.
// Designed to be replaceable with a real upload API later.

const SUB = new Set<() => void>();
function notify() {
  SUB.forEach((fn) => fn());
}
export function subscribeImages(cb: () => void) {
  SUB.add(cb);
  return () => SUB.delete(cb);
}

function get(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function set(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
    notify();
    window.dispatchEvent(new StorageEvent("storage", { key }));
  } catch {
    // quota
  }
}

export const doctorKey = (id: string) => `cliniq_doctor_image_${id}`;
export const reviewerKey = (id: string) => `cliniq_reviewer_image_${id}`;
export const teamKey = (id: string) => `cliniq_team_image_${id}`;
export const userKey = (id: string) => `cliniq_user_image_${id}`;

export const getDoctorImage = (id: string) => get(doctorKey(id));
export const setDoctorImage = (id: string, data: string | null) => set(doctorKey(id), data);
export const getReviewerImage = (id: string) => get(reviewerKey(id));
export const setReviewerImage = (id: string, data: string | null) => set(reviewerKey(id), data);
export const getTeamImage = (id: string) => get(teamKey(id));
export const setTeamImage = (id: string, data: string | null) => set(teamKey(id), data);
export const getUserImage = (id: string) => get(userKey(id));
export const setUserImage = (id: string, data: string | null) => set(userKey(id), data);

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}
