import { Cpu, Users, HeartHandshake } from "lucide-react";
import { useElementParallax } from "@/hooks/useParallax";
import whyChooseImage from "@/assets/gallery-17.jpg";
import whyChooseImage2 from "@/assets/gallery-23.jpg";

const features = [
  {
    icon: Cpu,
    title: "Advanced Technology",
    description: "We utilize modern dental equipment including digital X-rays for quick, precise diagnosis, ensuring effective treatment planning.",
  },
  {
    icon: Users,
    title: "A Dedicated Team",
    description: "Our experienced professionals are trained to offer compassionate care for every patient, from children to seniors.",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Care",
    description: "We take extra efforts to understand your specific needs and provide tailored dental solutions for lasting results.",
  },
];

const WhyChooseUsSection = () => {
  const { ref: imgRef, offset: imgOffset } = useElementParallax(0.06);

  return (
    <section className="section-padding bg-section-blue overflow-hidden">
      <div className="container-narrow">
        <div className="text-center mb-14">
          <span className="text-primary text-sm font-semibold tracking-wide uppercase">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
            What Makes Us Different <br className="hidden sm:block" />From Others
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Features */}
          <div className="space-y-8">
            {features.map((feature, i) => (
              <div key={feature.title} className="flex gap-5 group">
                <div className="w-14 h-14 rounded-xl bg-primary-gradient flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Image stack */}
          <div className="relative" ref={imgRef}>
            <div className="rounded-3xl overflow-hidden shadow-card">
              <img
                src={whyChooseImage}
                alt="Advanced dental technology at D'Bridge"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div 
              className="absolute -bottom-6 -left-6 w-[180px] rounded-2xl overflow-hidden shadow-hero border-4 border-background"
              style={{ transform: `translateY(${imgOffset * 0.5}px)` }}
            >
              <img
                src={whyChooseImage2}
                alt="Dental care excellence"
                className="w-full h-[140px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
