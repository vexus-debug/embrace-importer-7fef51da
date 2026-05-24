import { Sparkles, Stethoscope, Smile, Baby, Scissors, Heart, Crown, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: ShieldCheck,
    title: "Preventive Dentistry",
    description: "Comprehensive examinations, professional cleaning, fluoride treatment, and oral health education.",
    slug: "preventive-dentistry",
    accent: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: Stethoscope,
    title: "Restorative Dentistry",
    description: "Tooth-colored fillings, crowns & bridges, root canal therapy, dentures, and dental implants.",
    slug: "restorative-dentistry",
    accent: "from-blue-500/20 to-indigo-500/20",
  },
  {
    icon: Sparkles,
    title: "Cosmetic Dentistry",
    description: "Teeth whitening, veneers, smile makeover design, and cosmetic contouring.",
    slug: "cosmetic-dentistry",
    accent: "from-pink-500/20 to-rose-500/20",
  },
  {
    icon: Smile,
    title: "Orthodontics",
    description: "Traditional braces, ceramic braces, clear aligner therapy, and retainers.",
    slug: "orthodontics",
    accent: "from-violet-500/20 to-purple-500/20",
  },
  {
    icon: Baby,
    title: "Pediatric Dentistry",
    description: "Child-friendly exams, preventive care, pediatric restorations, and habit counseling.",
    slug: "pediatric-dentistry",
    accent: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Scissors,
    title: "Oral Surgery",
    description: "Tooth extractions, wisdom teeth removal, and minor soft tissue procedures.",
    slug: "oral-surgery",
    accent: "from-red-500/20 to-rose-500/20",
  },
  {
    icon: Heart,
    title: "Periodontics",
    description: "Gum disease treatment, deep cleaning, scaling & root planing, and gum grafting.",
    slug: "periodontics",
    accent: "from-cyan-500/20 to-sky-500/20",
  },
  {
    icon: Crown,
    title: "Prosthodontics",
    description: "Advanced replacement of missing teeth with crowns, bridges, and implant-supported prostheses.",
    slug: "prosthodontics",
    accent: "from-yellow-500/20 to-amber-500/20",
  },
  {
    icon: Zap,
    title: "Emergency Services",
    description: "Immediate care for dental pain, trauma, swelling, broken teeth, and lost fillings.",
    slug: "emergency-dental-services",
    accent: "from-orange-500/20 to-red-500/20",
  },
];

// Dental elements SVG background
const DentalBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Large tooth top left */}
    <svg className="absolute -top-10 -left-20 w-64 h-64 text-primary/[0.04]" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 5C35 5 25 15 20 30C15 45 18 60 22 75C26 90 35 95 42 95C48 95 50 85 50 85C50 85 52 95 58 95C65 95 74 90 78 75C82 60 85 45 80 30C75 15 65 5 50 5Z"/>
    </svg>
    
    {/* Toothbrush top right */}
    <svg className="absolute top-20 -right-10 w-48 h-48 text-primary/[0.05] rotate-45" viewBox="0 0 100 100" fill="currentColor">
      <rect x="45" y="10" width="10" height="60" rx="2"/>
      <rect x="35" y="70" width="30" height="25" rx="4"/>
      <circle cx="42" cy="78" r="3"/>
      <circle cx="50" cy="78" r="3"/>
      <circle cx="58" cy="78" r="3"/>
      <circle cx="42" cy="86" r="3"/>
      <circle cx="50" cy="86" r="3"/>
      <circle cx="58" cy="86" r="3"/>
    </svg>
    
    {/* Molar middle left */}
    <svg className="absolute top-1/2 -left-16 w-40 h-40 text-primary/[0.03] -rotate-12" viewBox="0 0 100 100" fill="currentColor">
      <path d="M25 20C15 25 10 40 15 55C20 70 30 85 45 90C50 91 55 91 60 90C75 85 85 70 88 55C91 40 85 25 75 20C70 17 65 18 60 22C55 26 50 28 45 26C40 24 32 18 25 20Z"/>
      <circle cx="35" cy="50" r="8" className="text-background" fill="currentColor"/>
      <circle cx="55" cy="45" r="8" className="text-background" fill="currentColor"/>
      <circle cx="70" cy="55" r="6" className="text-background" fill="currentColor"/>
    </svg>
    
    {/* Dental mirror bottom right */}
    <svg className="absolute bottom-20 right-10 w-36 h-36 text-primary/[0.04] rotate-12" viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="25" r="20" strokeWidth="4" stroke="currentColor" fill="none"/>
      <circle cx="50" cy="25" r="15"/>
      <rect x="47" y="45" width="6" height="50" rx="3"/>
    </svg>
    
    {/* Small tooth bottom left */}
    <svg className="absolute bottom-10 left-1/4 w-24 h-24 text-primary/[0.03]" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 10C40 10 32 18 28 30C24 42 26 55 30 68C34 81 40 88 47 88C52 88 53 80 53 80C53 80 54 88 59 88C66 88 72 81 76 68C80 55 82 42 78 30C74 18 66 10 50 10Z"/>
    </svg>
    
    {/* Sparkle/star decorations */}
    <svg className="absolute top-1/3 right-1/4 w-8 h-8 text-primary/10" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
    </svg>
    <svg className="absolute bottom-1/3 left-1/3 w-6 h-6 text-primary/10" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
    </svg>
    <svg className="absolute top-1/4 left-1/2 w-5 h-5 text-primary/[0.08]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
    </svg>
    
    {/* Large tooth bottom center-right */}
    <svg className="absolute -bottom-20 right-1/3 w-56 h-56 text-primary/[0.03] rotate-12" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 5C35 5 25 15 20 30C15 45 18 60 22 75C26 90 35 95 42 95C48 95 50 85 50 85C50 85 52 95 58 95C65 95 74 90 78 75C82 60 85 45 80 30C75 15 65 5 50 5Z"/>
    </svg>
  </div>
);

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding bg-gradient-to-b from-background via-secondary/20 to-background relative">
      <DentalBackground />
      
      <div className="container-narrow relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase mb-4">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Comprehensive Dental Care
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            A full spectrum of dental specialties to meet all your oral health needs under one roof.
          </p>
        </div>

        {/* Featured Services - First 3 */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {services.slice(0, 3).map((service, index) => (
            <Link
              to={`/services/${service.slug}`}
              key={service.title}
              className="group relative bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border hover:border-primary/40 transition-all duration-500 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <service.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                  Learn More <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Other Services - Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.slice(3).map((service) => (
            <Link
              to={`/services/${service.slug}`}
              key={service.title}
              className="group flex items-center gap-4 bg-card/80 backdrop-blur-sm rounded-2xl p-5 border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex-shrink-0 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                <service.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">{service.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{service.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0" />
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild className="gap-2 rounded-full px-8">
            <Link to="/services">
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
