import { ArrowRight, Calendar, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useParallax } from "@/hooks/useParallax";
import heroImage from "@/assets/gallery-14.jpg";
import gallery15 from "@/assets/gallery-15.jpg";
import gallery16 from "@/assets/gallery-16.jpg";

const HeroSection = () => {
  const parallaxOffset = useParallax(0.3);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${parallaxOffset}px)`,
          willChange: "transform",
        }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(232_59%_30%/0.9)] via-[hsl(232_59%_30%/0.7)] to-[hsl(232_59%_30%/0.4)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(232_59%_30%/0.6)] via-transparent to-[hsl(232_59%_30%/0.3)]" />

      <div className="container-narrow section-padding relative z-10 pt-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-medium border border-primary-foreground/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Premier Dental Care in Lagos
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] text-primary-foreground">
              Welcome to{" "}
              <span className="text-primary">D'Bridge</span>{" "}
              <br className="hidden sm:block" />
              Dental Care
            </h1>

            <p className="text-lg lg:text-xl text-primary-foreground/80 max-w-lg leading-relaxed">
              Your partner for a complete, confident smile. We blend cutting-edge dental care 
              with a warm, patient-centered environment for every member of the family.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="gap-2 shadow-hero text-base px-8 h-13">
                <Link to="/services">
                  Our Services
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                asChild 
                className="gap-2 bg-transparent border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/60 text-base px-8 h-13"
              >
                <Link to="/contact">
                  <Calendar className="w-5 h-5" />
                  Book a Visit
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[gallery15, gallery16, heroImage].map((img, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-foreground overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-gold text-sm">★</span>
                  ))}
                  <span className="text-primary-foreground font-bold ml-1">4.8</span>
                </div>
                <p className="text-primary-foreground/60 text-sm">From 500+ patient reviews</p>
              </div>
            </div>
          </div>

          {/* Right side image cards */}
          <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              {/* Main card */}
              <div className="rounded-3xl overflow-hidden shadow-hero border-2 border-primary-foreground/10">
                <img
                  src={gallery15}
                  alt="Professional dental care at D'Bridge"
                  className="w-full h-[420px] object-cover"
                />
              </div>

              {/* Floating small card */}
              <div 
                className="absolute -bottom-8 -left-8 rounded-2xl overflow-hidden shadow-hero border-2 border-primary-foreground/10 w-[200px]"
                style={{ transform: `translateY(${parallaxOffset * 0.2}px)` }}
              >
                <img
                  src={gallery16}
                  alt="Dental team at work"
                  className="w-full h-[150px] object-cover"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-background rounded-2xl p-4 shadow-card-hover border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-gradient flex items-center justify-center">
                    <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">25+ Services</p>
                    <p className="text-xs text-muted-foreground">Complete Care</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
