import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useElementParallax } from "@/hooks/useParallax";
import aboutImage from "@/assets/gallery-19.jpg";
import aboutImage2 from "@/assets/gallery-10.jpg";

const highlights = [
  "Experienced and Caring Team of Professionals",
  "Advanced Technology for Dental Excellence",
  "Personalized Care Approach for Each Patient",
  "Wheelchair-Friendly & Fully Accessible Facility",
];

const AboutSection = () => {
  const { ref: imgRef, offset: imgOffset } = useElementParallax(0.06);

  return (
    <section className="section-padding bg-section-blue overflow-hidden">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Stack */}
          <div className="relative" ref={imgRef}>
            <div className="rounded-3xl overflow-hidden shadow-card">
              <img
                src={aboutImage}
                alt="Modern dental clinic environment at D'Bridge"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
            {/* Overlapping second image */}
            <div 
              className="absolute -bottom-8 -right-4 lg:-right-8 w-[200px] lg:w-[240px] rounded-2xl overflow-hidden shadow-hero border-4 border-background"
              style={{ transform: `translateY(${imgOffset * 0.5}px)` }}
            >
              <img
                src={aboutImage2}
                alt="Dental procedure at D'Bridge"
                className="w-full h-[160px] lg:h-[180px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-gradient rounded-3xl opacity-20 -z-10" />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <span className="text-primary text-sm font-semibold tracking-wide uppercase">About Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Achieve a Confident Smile With Us
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              D'Bridge Dental Clinic is a premier dental practice in Lagos, Nigeria, renowned for 
              blending cutting-edge dental care with a warm, patient-centered environment. We are 
              committed to providing accessible, high-quality dental solutions for every member of 
              the family.
            </p>

            <div className="space-y-4">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>

            <Button size="lg" asChild className="mt-2 gap-2">
              <Link to="/about">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
