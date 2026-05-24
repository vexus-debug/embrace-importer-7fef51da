import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="section-padding bg-primary-gradient relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 border-2 border-primary-foreground rounded-full" />
        <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-primary-foreground rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-primary-foreground rounded-full" />
      </div>

      <div className="container-narrow relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight">
          Premium Dental Treatment <br className="hidden sm:block" />
          at Affordable Prices
        </h2>
        <p className="text-primary-foreground/80 mt-6 max-w-2xl mx-auto text-lg">
          We offer high-quality dental solutions with flexible payment options including 
          cash, cards, and bank transfers. Payment plans available for major treatments.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-10">
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="gap-2 text-primary font-semibold"
          >
            <Link to="/contact">
              Book Appointment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            asChild
            className="gap-2 bg-transparent border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/60"
          >
            <a href="tel:+2348136958121">Call Us Now</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
