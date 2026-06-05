import { useSyncExternalStore } from "react";
import { getDoctorImage, getReviewerImage, getTeamImage, getUserImage, subscribeImages } from "@/services/imageStore";

type Kind = "doctor" | "reviewer" | "team" | "user";

function useImage(kind: Kind, id: string): string | null {
  return useSyncExternalStore(
    (cb) => subscribeImages(cb),
    () => {
      if (kind === "doctor") return getDoctorImage(id);
      if (kind === "reviewer") return getReviewerImage(id);
      if (kind === "team") return getTeamImage(id);
      return getUserImage(id);
    },
    () => null,
  );
}

// Team photos
const TEAM_PHOTOS: Record<string, string> = {
  tm1: "https://i.pinimg.com/1200x/54/0a/82/540a8268115c5c900e6d01301ed057bd.jpg",
  tm2: "https://i.pinimg.com/736x/50/85/7b/50857b3983cc20c531ada622720fde73.jpg",
  tm3: "https://i.pinimg.com/736x/c6/25/23/c625238b186de3593df4d1034b079b01.jpg",
};

// ✅ صور المرضى في الـ testimonials
const REVIEWER_PHOTOS: Record<string, string> = {
  t1: "https://i.pinimg.com/736x/60/32/0e/60320ed7462b0b470ac94fb980ce3c42.jpg",
  t2: "https://i.pinimg.com/736x/ed/ee/14/edee14e1370fdd631d9de85d5a0bf6d6.jpg",
  t3: "https://i.pinimg.com/736x/85/8b/6f/858b6facd869efbfa306f69908c7fa30.jpg",
};

function diceBear(kind: Kind, seed: string, id: string) {
  if (kind === "team" && TEAM_PHOTOS[id]) return TEAM_PHOTOS[id];
  if (kind === "reviewer" && REVIEWER_PHOTOS[id]) return REVIEWER_PHOTOS[id]; // ✅
  if (kind === "doctor") {
    const idx = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 50;
    return `https://randomuser.me/api/portraits/men/${idx}.jpg`;
  }
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=2563EB&textColor=ffffff`;
}

export function DoctorAvatar({
  doctorId,
  name,
  className,
  alt,
  kind = "doctor",
}: {
  doctorId: string;
  name: string;
  className?: string;
  alt?: string;
  kind?: Kind;
}) {
  const custom = useImage(kind, doctorId);
  const src = custom || diceBear(kind, name || doctorId, doctorId);
  return <img src={src} alt={alt ?? name} className={className} />;
}
