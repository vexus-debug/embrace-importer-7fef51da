import { ChevronLeft, ChevronRight } from "lucide-react";
import dentist1 from "@/assets/gallery-22.jpg";
import dentist2 from "@/assets/gallery-23.jpg";
import dentist3 from "@/assets/gallery-25.jpg";

const team = [
  {
    name: "Dr. Mustapha Lekan Jr.",
    role: "Lead Dentist",
    image: dentist1,
  },
  {
    name: "Dr. Ashaolu Olufemi",
    role: "Pediatric Dentist",
    image: dentist2,
  },
  {
    name: "Dr. Ngozi",
    role: "Dental Surgeon",
    image: dentist3,
  },
];

const TeamSection = () => {
  return (
    <section id="team" className="section-padding bg-primary-gradient relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container-narrow relative z-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-primary-foreground/70 text-sm font-semibold tracking-wide uppercase">Meet The Experts</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mt-3">
              Professional and Skilled <br className="hidden md:block" />Dentist Team
            </h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button className="w-10 h-10 rounded-full border-2 border-primary-foreground/30 flex items-center justify-center text-primary-foreground/70 hover:bg-primary-foreground/10 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center text-primary hover:bg-primary-foreground/90 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="group">
              <div className="relative rounded-2xl overflow-hidden mb-4 bg-primary-foreground/10">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-80 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-primary-foreground">{member.name}</h3>
              <p className="text-primary-foreground/70 text-sm mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
