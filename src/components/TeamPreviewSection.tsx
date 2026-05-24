import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import dentist1 from "@/assets/dentist-1.jpg";
import dentist2 from "@/assets/dentist-2.jpg";
import dentist3 from "@/assets/dentist-3.jpg";

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

const TeamPreviewSection = () => {
  return (
    <section className="section-padding bg-section-blue">
      <div className="container-narrow">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="text-primary text-sm font-semibold tracking-wide uppercase">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
              Meet Our Expert <br className="hidden sm:block" />
              Dental Professionals
            </h2>
          </div>
          <Button variant="outline" asChild className="gap-2 self-start md:self-auto">
            <Link to="/team">
              View Full Team
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="group cursor-pointer">
              <div className="relative rounded-3xl overflow-hidden mb-5">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamPreviewSection;
