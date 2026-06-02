import { createFileRoute } from "@tanstack/react-router";
import { AnnouncementBar } from "@/components/common/AnnouncementBar";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { StatsBar } from "@/components/sections/StatsBar";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Specialties } from "@/components/sections/Specialties";
import { TopDoctors } from "@/components/sections/TopDoctors";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { MobileApp } from "@/components/sections/MobileApp";
import { CTASection } from "@/components/sections/CTASection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClinIQ — Find & Book Your Doctor in Seconds" },
      { name: "description", content: "Book verified doctors instantly. Free booking, pay only at the clinic. 500+ specialists across 100+ clinics." },
      { property: "og:title", content: "ClinIQ — Find & Book Your Doctor in Seconds" },
      { property: "og:description", content: "Book verified doctors instantly. Free booking, pay only at the clinic." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroSection />
        <TrustBadges />
        <StatsBar />
        <HowItWorks />
        <Specialties />
        <TopDoctors />
        <Testimonials />
        <FAQ />
        <MobileApp />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
