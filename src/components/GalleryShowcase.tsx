import { useElementParallax } from "@/hooks/useParallax";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";

const images = [
  { src: gallery1, alt: "Dental treatment at D'Bridge" },
  { src: gallery2, alt: "Modern dental equipment" },
  { src: gallery3, alt: "Patient care at D'Bridge" },
  { src: gallery4, alt: "Dental procedure" },
  { src: gallery5, alt: "Clinic interior" },
  { src: gallery6, alt: "Professional dental team" },
  { src: gallery7, alt: "Dental consultation" },
  { src: gallery8, alt: "Patient smiling" },
];

const GalleryShowcase = () => {
  const { ref: col1Ref, offset: col1Offset } = useElementParallax(0.08);
  const { ref: col2Ref, offset: col2Offset } = useElementParallax(-0.06);
  const { ref: col3Ref, offset: col3Offset } = useElementParallax(0.1);
  const { ref: col4Ref, offset: col4Offset } = useElementParallax(-0.08);

  const columns = [
    { images: [images[0], images[1]], ref: col1Ref, offset: col1Offset },
    { images: [images[2], images[3]], ref: col2Ref, offset: col2Offset },
    { images: [images[4], images[5]], ref: col3Ref, offset: col3Offset },
    { images: [images[6], images[7]], ref: col4Ref, offset: col4Offset },
  ];

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-narrow">
        <div className="text-center mb-14">
          <span className="text-primary text-sm font-semibold tracking-wide uppercase">
            Our Gallery
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
            See Our Work in Action
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            A glimpse into our modern facility, advanced procedures, and the beautiful smiles we create every day.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {columns.map((col, colIdx) => (
            <div
              key={colIdx}
              ref={col.ref}
              className="flex flex-col gap-4 md:gap-6"
              style={{
                transform: `translateY(${col.offset}px)`,
                willChange: "transform",
              }}
            >
              {col.images.map((img, imgIdx) => (
                <div
                  key={imgIdx}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                      imgIdx === 0 ? "h-[240px] md:h-[300px]" : "h-[200px] md:h-[250px]"
                    }`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-500" />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button size="lg" variant="outline" asChild className="gap-2">
            <Link to="/gallery">
              View Full Gallery
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GalleryShowcase;
