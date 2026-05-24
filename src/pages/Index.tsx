import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import PatientJourneySection from "@/components/PatientJourneySection";
import StatsSection from "@/components/StatsSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import GalleryShowcase from "@/components/GalleryShowcase";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import gallery9 from "@/assets/gallery-9.jpg";
import gallery20 from "@/assets/gallery-20.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <section className="relative h-[350px] overflow-hidden">
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${gallery9})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          />
          <div className="absolute inset-0 bg-foreground/60" />
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center max-w-3xl px-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight">
                Building Smiles That <br className="hidden sm:block" />Last a Lifetime
              </h2>
              <p className="text-primary-foreground/70 mt-4 text-lg">
                Over 16,000 patients trust us with their dental health
              </p>
            </div>
          </div>
        </section>
        <AboutSection />
        <StatsSection />
        <PatientJourneySection />
        <WhyChooseUsSection />
        <GalleryShowcase />
        <section className="relative h-[300px] overflow-hidden">
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${gallery20})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          />
          <div className="absolute inset-0 bg-primary/60" />
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center max-w-2xl px-6">
              <p className="text-primary-foreground text-xl md:text-2xl font-heading italic">
                "Your smile is our greatest achievement"
              </p>
              <p className="text-primary-foreground/70 mt-3 text-sm uppercase tracking-widest">— D'Bridge Dental Team</p>
            </div>
          </div>
        </section>
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
