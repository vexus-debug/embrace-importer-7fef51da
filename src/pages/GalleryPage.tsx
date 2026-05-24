import { useState } from "react";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/gallery-11.jpg";

// Clinic & Facility
import gallery1 from "@/assets/gallery-1.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery10 from "@/assets/gallery-10.jpg";
import gallery14 from "@/assets/gallery-14.jpg";
import gallery15 from "@/assets/gallery-15.jpg";
import gallery16 from "@/assets/gallery-16.jpg";
import gallery17 from "@/assets/gallery-17.jpg";
import gallery19 from "@/assets/gallery-19.jpg";
import gallery20 from "@/assets/gallery-20.jpg";
import gallery43 from "@/assets/gallery-43.jpg";

// Procedures & Treatments
import gallery22 from "@/assets/gallery-22.jpg";
import gallery23 from "@/assets/gallery-23.jpg";
import gallery26 from "@/assets/gallery-26.jpg";
import gallery27 from "@/assets/gallery-27.jpg";

// Before & After pairs
import gallery30 from "@/assets/gallery-30.jpg";
import gallery29 from "@/assets/gallery-29.jpg";
import gallery31 from "@/assets/gallery-31.jpg";
import gallery21 from "@/assets/gallery-21.jpg";
import gallery42 from "@/assets/gallery-42.jpg";
import gallery28 from "@/assets/gallery-28.jpg";
import gallery32 from "@/assets/gallery-32.jpg";
import gallery36 from "@/assets/gallery-36.jpg";

type Category = "all" | "clinic" | "procedures" | "orthodontics";

const categories: { key: Category; label: string }[] = [
  { key: "all", label: "All" },
  { key: "clinic", label: "Clinic & Facility" },
  { key: "procedures", label: "Procedures" },
  { key: "orthodontics", label: "Orthodontics" },
];

const clinicImages = [
  { src: gallery14, alt: "Clinic building exterior view" },
  { src: gallery1, alt: "Dental treatment room with modern equipment" },
  { src: gallery6, alt: "Full clinic view with two dental stations" },
  { src: gallery10, alt: "Clinic reception area with festive decorations" },
  { src: gallery15, alt: "Reception desk with wooden finish" },
  { src: gallery16, alt: "Corridor with large windows and plants" },
  { src: gallery17, alt: "Hallway with motivational wall art" },
  { src: gallery19, alt: "Waiting area with comfortable seating" },
  { src: gallery20, alt: "Reception counter with warm lighting" },
  { src: gallery43, alt: "Dental treatment room with chair and equipment" },
];

const procedureImages = [
  { src: gallery22, alt: "Dental team performing treatment" },
  { src: gallery23, alt: "Pediatric dental care in action" },
  { src: gallery26, alt: "Dental anatomy teaching model" },
  { src: gallery27, alt: "Teeth whitening treatment with UV light" },
];

const orthodonticImages = [
  { src: gallery30, alt: "Dental treatment result" },
  { src: gallery29, alt: "Smile transformation" },
  { src: gallery31, alt: "Orthodontic treatment" },
  { src: gallery21, alt: "Braces treatment" },
  { src: gallery42, alt: "Dental procedure" },
  { src: gallery28, alt: "Veneer treatment" },
  { src: gallery32, alt: "Dental examination" },
  { src: gallery36, alt: "Treatment progress" },
];

// Flatten all images for lightbox
const allGalleryImages = [
  ...clinicImages,
  ...procedureImages,
  ...orthodonticImages,
];

const GalleryPage = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const openLightbox = (src: string) => {
    const idx = allGalleryImages.findIndex((img) => img.src === src);
    setLightboxIndex(idx >= 0 ? idx : null);
  };

  const navigate = (dir: 1 | -1) => {
    if (lightboxIndex === null) return;
    const next = (lightboxIndex + dir + allGalleryImages.length) % allGalleryImages.length;
    setLightboxIndex(next);
  };

  const showClinic = activeCategory === "all" || activeCategory === "clinic";
  const showProcedures = activeCategory === "all" || activeCategory === "procedures";
  const showOrthodontics = activeCategory === "all" || activeCategory === "orthodontics";

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <PageHero
          badge="Gallery"
          title="Our Clinic in Pictures"
          subtitle="Take a virtual tour of our modern, fully-equipped dental facility and see the results of our work."
          backgroundImage={heroBg}
        />

        <section className="section-padding bg-background">
          <div className="container-narrow">
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((cat) => (
                <Button
                  key={cat.key}
                  variant={activeCategory === cat.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat.key)}
                  className="rounded-full"
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            {/* Clinic & Facility */}
            {showClinic && (
              <div className="mb-16">
                {activeCategory === "all" && (
                  <h2 className="text-2xl font-bold text-foreground mb-6">Clinic & Facility</h2>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {clinicImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => openLightbox(img.src)}
                      className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Procedures */}
            {showProcedures && (
              <div className="mb-16">
                {activeCategory === "all" && (
                  <h2 className="text-2xl font-bold text-foreground mb-6">Procedures & Treatments</h2>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {procedureImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => openLightbox(img.src)}
                      className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Orthodontics */}
            {showOrthodontics && (
              <div className="mb-8">
                {activeCategory === "all" && (
                  <h2 className="text-2xl font-bold text-foreground mb-6">Orthodontics</h2>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {orthodonticImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => openLightbox(img.src)}
                      className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-background hover:text-background/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-background hover:text-background/80 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-background hover:text-background/80 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
          <img
            src={allGalleryImages[lightboxIndex].src}
            alt={allGalleryImages[lightboxIndex].alt}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
