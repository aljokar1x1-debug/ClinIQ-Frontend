export type Doctor = {
  id: string;
  name: string;
  nameAr: string;
  specialty: string;
  specialtyAr: string;
  subspecialties: string[];
  rating: number;
  reviews: number;
  experience: number;
  fee: number;
  city: string;
  cityAr: string;
  area: string;
  clinic: string;
  about: string;
  languages: string[];
  gender: "male" | "female";
  availableToday: boolean;
  videoConsult: boolean;
  homeVisit: boolean;
  insurance: string[];
  avatar: string;
  lat: number;
  lng: number;
  nextSlot: string;
  education: { degree: string; institution: string; year: number }[];
  awards: string[];
};

const SPECIALTIES = [
  ["Cardiology", "أمراض القلب"],
  ["Dermatology", "الأمراض الجلدية"],
  ["Pediatrics", "طب الأطفال"],
  ["Dentistry", "طب الأسنان"],
  ["Neurology", "طب الأعصاب"],
  ["Orthopedics", "العظام"],
  ["Ophthalmology", "طب العيون"],
  ["Psychiatry", "الطب النفسي"],
  ["Gynecology", "أمراض النساء"],
  ["ENT", "أنف وأذن وحنجرة"],
] as const;

const CITIES = [
  ["Cairo", "القاهرة"],
  ["Alexandria", "الإسكندرية"],
  ["Giza", "الجيزة"],
  ["Dubai", "دبي"],
  ["Riyadh", "الرياض"],
];
const INSURANCES = ["AXA", "Bupa", "MetLife", "Allianz", "MedNet"];

// ── 11 unique doctors — one per specialty + extra cardiology ──────────────
export const DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Sarah Hassan",
    nameAr: "د. سارة حسن",
    specialty: "Cardiology",
    specialtyAr: "أمراض القلب",
    gender: "female",
    avatar: "https://i.pinimg.com/736x/4a/de/6d/4ade6d2a43e9bdf4cb20cf1dc05def79.jpg",
    rating: 4.9,
    reviews: 312,
    experience: 15,
    fee: 400,
    city: "Cairo",
    cityAr: "القاهرة",
    area: "Zamalek",
    clinic: "Zamalek Medical Center",
    about:
      "Board-certified cardiologist with 15+ years treating complex heart conditions. Fellow of the Egyptian Cardiology Society.",
    languages: ["English", "Arabic"],
    availableToday: true,
    videoConsult: true,
    homeVisit: false,
    insurance: ["AXA", "Bupa", "MetLife"],
    lat: 30.062,
    lng: 31.221,
    nextSlot: "Today 4:30 PM",
    education: [
      { degree: "MBBS", institution: "Cairo University", year: 2005 },
      { degree: "MD Cardiology", institution: "Ain Shams University", year: 2010 },
    ],
    awards: ["Top Doctor 2024", "Patient's Choice Award"],
    subspecialties: ["Consultation", "Follow-up"],
  },
  {
    id: "doc-2",
    name: "Dr. Ahmed Mansour",
    nameAr: "د. أحمد منصور",
    specialty: "Neurology",
    specialtyAr: "طب الأعصاب",
    gender: "male",
    avatar: "https://i.pinimg.com/736x/37/25/1e/37251eab10cb27e8b11515a3c78ce64d.jpg",
    rating: 4.8,
    reviews: 265,
    experience: 17,
    fee: 500,
    city: "Giza",
    cityAr: "الجيزة",
    area: "Dokki",
    clinic: "Dokki Medical Center",
    about:
      "Consultant neurologist specializing in epilepsy and stroke management. Trained at Johns Hopkins.",
    languages: ["English", "Arabic", "French"],
    availableToday: true,
    videoConsult: true,
    homeVisit: false,
    insurance: ["AXA", "Bupa"],
    lat: 30.041,
    lng: 31.211,
    nextSlot: "Today 6:00 PM",
    education: [
      { degree: "MBBS", institution: "Ain Shams University", year: 2003 },
      { degree: "MD Neurology", institution: "Ain Shams University", year: 2008 },
    ],
    awards: ["Top Doctor 2024"],
    subspecialties: ["Consultation", "Follow-up", "Surgery"],
  },
  {
    id: "doc-3",
    name: "Dr. Layla Khalil",
    nameAr: "د. ليلى خليل",
    specialty: "Pediatrics",
    specialtyAr: "طب الأطفال",
    gender: "female",
    avatar: "https://i.pinimg.com/1200x/96/0a/92/960a9255469b48797e4c7e68640fd2dd.jpg",
    rating: 4.7,
    reviews: 198,
    experience: 12,
    fee: 300,
    city: "Cairo",
    cityAr: "القاهرة",
    area: "Nasr City",
    clinic: "Nasr City Medical Center",
    about:
      "Pediatric specialist with a warm approach to child healthcare. Expert in developmental delays and childhood immunization.",
    languages: ["English", "Arabic"],
    availableToday: true,
    videoConsult: true,
    homeVisit: true,
    insurance: ["AXA", "MetLife", "Allianz"],
    lat: 30.065,
    lng: 31.342,
    nextSlot: "Today 4:30 PM",
    education: [
      { degree: "MBBS", institution: "Cairo University", year: 2008 },
      { degree: "MD Pediatrics", institution: "Cairo University", year: 2013 },
    ],
    awards: ["Patient's Choice Award"],
    subspecialties: ["Consultation", "Follow-up"],
  },
  {
    id: "doc-4",
    name: "Dr. Omar El-Sayed",
    nameAr: "د. عمر السيد",
    specialty: "Orthopedics",
    specialtyAr: "العظام",
    gender: "male",
    avatar: "https://i.pinimg.com/1200x/54/0a/82/540a8268115c5c900e6d01301ed057bd.jpg",
    rating: 4.6,
    reviews: 143,
    experience: 16,
    fee: 450,
    city: "Alexandria",
    cityAr: "الإسكندرية",
    area: "Smouha",
    clinic: "Smouha Medical Center",
    about:
      "Orthopedic surgeon specializing in sports injuries, joint replacement, and spine surgery.",
    languages: ["English", "Arabic"],
    availableToday: false,
    videoConsult: false,
    homeVisit: false,
    insurance: ["Bupa", "MedNet"],
    lat: 31.213,
    lng: 29.955,
    nextSlot: "Tomorrow 9:00 AM",
    education: [
      { degree: "MBBS", institution: "Alexandria University", year: 2004 },
      { degree: "MD Orthopedics", institution: "Alexandria University", year: 2009 },
    ],
    awards: ["Top Doctor 2023"],
    subspecialties: ["Consultation", "Surgery"],
  },
  {
    id: "doc-5",
    name: "Dr. Nadia Farouk",
    nameAr: "د. نادية فاروق",
    specialty: "Dermatology",
    specialtyAr: "الأمراض الجلدية",
    gender: "female",
    avatar: "https://i.pinimg.com/736x/da/92/56/da9256b9faa75478af8c42b02d895e11.jpg",
    rating: 4.8,
    reviews: 421,
    experience: 10,
    fee: 350,
    city: "Cairo",
    cityAr: "القاهرة",
    area: "Heliopolis",
    clinic: "Heliopolis Medical Center",
    about: "Dermatologist and cosmetologist specializing in acne, hair loss, and laser treatments.",
    languages: ["English", "Arabic", "French"],
    availableToday: true,
    videoConsult: true,
    homeVisit: false,
    insurance: ["AXA", "Bupa", "MetLife", "MedNet"],
    lat: 30.091,
    lng: 31.323,
    nextSlot: "Today 6:00 PM",
    education: [
      { degree: "MBBS", institution: "Ain Shams University", year: 2010 },
      { degree: "MD Dermatology", institution: "Ain Shams University", year: 2015 },
    ],
    awards: ["Top Doctor 2024", "Patient's Choice Award"],
    subspecialties: ["Consultation", "Follow-up"],
  },
  {
    id: "doc-6",
    name: "Dr. Karim Naguib",
    nameAr: "د. كريم نجيب",
    specialty: "Dentistry",
    specialtyAr: "طب الأسنان",
    gender: "male",
    avatar: "https://i.pinimg.com/736x/01/bc/83/01bc83577f3555e523ac2df3770b67b6.jpg",
    rating: 4.7,
    reviews: 389,
    experience: 14,
    fee: 250,
    city: "Giza",
    cityAr: "الجيزة",
    area: "6th of October",
    clinic: "October Medical Center",
    about:
      "Dental surgeon specializing in implants, orthodontics, and cosmetic dentistry. Over 5,000 successful procedures.",
    languages: ["English", "Arabic"],
    availableToday: true,
    videoConsult: false,
    homeVisit: false,
    insurance: ["AXA", "MetLife"],
    lat: 29.972,
    lng: 30.921,
    nextSlot: "Today 4:30 PM",
    education: [
      { degree: "BDS", institution: "Cairo University", year: 2006 },
      { degree: "MD Dentistry", institution: "Cairo University", year: 2011 },
    ],
    awards: ["Top Doctor 2024"],
    subspecialties: ["Consultation", "Surgery"],
  },
  {
    id: "doc-7",
    name: "Dr. Hana Saleh",
    nameAr: "د. هناء صالح",
    specialty: "Gynecology",
    specialtyAr: "أمراض النساء",
    gender: "female",
    avatar: "https://i.pinimg.com/736x/35/60/6f/35606f296e52742f503fb57360c9fafd.jpg",
    rating: 4.9,
    reviews: 287,
    experience: 18,
    fee: 500,
    city: "Cairo",
    cityAr: "القاهرة",
    area: "Maadi",
    clinic: "Maadi Medical Center",
    about:
      "OB-GYN specialist with expertise in high-risk pregnancies, infertility, and minimally invasive surgery.",
    languages: ["English", "Arabic"],
    availableToday: true,
    videoConsult: true,
    homeVisit: false,
    insurance: ["AXA", "Bupa", "MetLife", "Allianz"],
    lat: 29.961,
    lng: 31.258,
    nextSlot: "Today 6:00 PM",
    education: [
      { degree: "MBBS", institution: "Cairo University", year: 2002 },
      { degree: "MD Gynecology", institution: "Cairo University", year: 2007 },
    ],
    awards: ["Top Doctor 2024", "Patient's Choice Award"],
    subspecialties: ["Consultation", "Follow-up", "Surgery"],
  },
  {
    id: "doc-8",
    name: "Dr. Yusuf Ibrahim",
    nameAr: "د. يوسف إبراهيم",
    specialty: "Psychiatry",
    specialtyAr: "الطب النفسي",
    gender: "male",
    avatar: "https://i.pinimg.com/736x/38/72/3b/38723b0e575541da59c87601a7614a54.jpg",
    rating: 4.3,
    reviews: 159,
    experience: 12,
    fee: 400,
    city: "Giza",
    cityAr: "الجيزة",
    area: "Maadi",
    clinic: "Maadi Psychiatric Center",
    about:
      "Psychiatrist and psychotherapist specializing in anxiety, depression, and cognitive behavioral therapy.",
    languages: ["English", "Arabic"],
    availableToday: true,
    videoConsult: true,
    homeVisit: false,
    insurance: ["AXA", "Bupa"],
    lat: 29.963,
    lng: 31.251,
    nextSlot: "Today 4:30 PM",
    education: [
      { degree: "MBBS", institution: "Ain Shams University", year: 2008 },
      { degree: "MD Psychiatry", institution: "Ain Shams University", year: 2013 },
    ],
    awards: ["Patient's Choice Award"],
    subspecialties: ["Consultation", "Follow-up"],
  },
  {
    id: "doc-9",
    name: "Dr. Mona Zaki",
    nameAr: "د. منى زكي",
    specialty: "Ophthalmology",
    specialtyAr: "طب العيون",
    gender: "female",
    avatar: "https://i.pinimg.com/736x/a0/4c/ed/a04ced80a5986ae4e71b5c4fffe22731.jpg",
    rating: 4.8,
    reviews: 203,
    experience: 15,
    fee: 600,
    city: "Cairo",
    cityAr: "القاهرة",
    area: "New Cairo",
    clinic: "New Cairo Medical Center",
    about: "Ophthalmologist specializing in LASIK, cataract surgery, and retinal diseases.",
    languages: ["English", "Arabic"],
    availableToday: true,
    videoConsult: false,
    homeVisit: false,
    insurance: ["AXA", "MetLife", "MedNet"],
    lat: 30.031,
    lng: 31.472,
    nextSlot: "Today 6:00 PM",
    education: [
      { degree: "MBBS", institution: "Cairo University", year: 2005 },
      { degree: "MD Ophthalmology", institution: "Cairo University", year: 2010 },
    ],
    awards: ["Top Doctor 2024"],
    subspecialties: ["Consultation", "Surgery"],
  },
  {
    id: "doc-10",
    name: "Dr. Tarek Younes",
    nameAr: "د. طارق يونس",
    specialty: "ENT",
    specialtyAr: "أنف وأذن وحنجرة",
    gender: "male",
    avatar: "https://i.pinimg.com/736x/5e/71/6c/5e716c2452994fd74c8dd75a6f4485cc.jpg",
    rating: 4.5,
    reviews: 178,
    experience: 19,
    fee: 350,
    city: "Alexandria",
    cityAr: "الإسكندرية",
    area: "Sidi Gaber",
    clinic: "Sidi Gaber Medical Center",
    about: "ENT consultant specializing in sinusitis, hearing loss, and voice disorders.",
    languages: ["English", "Arabic"],
    availableToday: true,
    videoConsult: true,
    homeVisit: false,
    insurance: ["AXA", "Bupa", "Allianz"],
    lat: 31.223,
    lng: 29.967,
    nextSlot: "Today 4:30 PM",
    education: [
      { degree: "MBBS", institution: "Alexandria University", year: 2001 },
      { degree: "MD ENT", institution: "Alexandria University", year: 2006 },
    ],
    awards: ["Top Doctor 2023", "Patient's Choice Award"],
    subspecialties: ["Consultation", "Surgery"],
  },
];

export const SPECIALTY_LIST = [
  ...new Map(DOCTORS.map((d) => [d.specialty, { en: d.specialty, ar: d.specialtyAr }])).values(),
];
export const CITY_LIST = [
  ["Cairo", "القاهرة"],
  ["Alexandria", "الإسكندرية"],
  ["Giza", "الجيزة"],
  ["Dubai", "دبي"],
  ["Riyadh", "الرياض"],
].map(([en, ar]) => ({ en, ar }));
export const INSURANCE_LIST = ["AXA", "Bupa", "MetLife", "Allianz", "MedNet"];

export function getDoctor(id: string): Doctor | undefined {
  return DOCTORS.find((d) => d.id === id);
}

export const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

export function getNextDays(count = 7) {
  const days = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}
