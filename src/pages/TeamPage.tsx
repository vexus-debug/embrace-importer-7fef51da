import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { Award, GraduationCap, Heart } from "lucide-react";
import dentist1 from "@/assets/gallery-22.jpg";
import dentist2 from "@/assets/gallery-23.jpg";
import dentist3 from "@/assets/gallery-25.jpg";
import heroBg from "@/assets/gallery-6.jpg";

const team = [
  {
    name: "Dr. Mustapha Lekan Jr.",
    role: "Lead Dentist",
    image: dentist1,
    bio: "Dr. Mustapha Lekan Jr. is a dedicated general dentist with a passion for delivering comprehensive oral healthcare. A graduate of the University of Lagos, he brings clinical precision and a patient-first philosophy to every consultation and procedure.",
    specialties: ["General Dentistry", "Preventive Care", "Restorative Dentistry"],
    education: "BDS, Lagos",
    experience: "10+ Years",
  },
  {
    name: "Dr. Ashaolu Olufemi",
    role: "Pediatric Dentist",
    image: dentist2,
    bio: "Dr. Ashaolu Olufemi is a skilled pediatric dentist with over 15 years of experience. With a gentle chairside manner and deep expertise in children's oral health, he ensures every young patient feels safe, comfortable, and confident during their visit.",
    specialties: ["Pediatric Dentistry", "Preventive Care", "Early Orthodontic Assessment"],
    education: "BDS",
    experience: "15+ Years",
  },
  {
    name: "Dr. Ngozi",
    role: "Dental Surgeon",
    image: dentist3,
    bio: "Dr. Ngozi is an experienced dental surgeon with expertise in oral surgery procedures. Her precision and compassionate approach ensure patients receive excellent surgical care.",
    specialties: ["Oral Surgery", "Tooth Extractions", "Dental Implants"],
    education: "BDS, FMCDS",
    experience: "8+ Years",
  },
];

const staff = [
  {
    name: "Mustapha Temitope",
    role: "Human Resources (HR)",
    education: "English, University of Lagos (UNILAG)",
  },
  {
    name: "Yusuf Monsurat",
    role: "Dental Nurse",
  },
];

const TeamPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <PageHero
          badge="Our Team"
          title="Professional and Skilled Dentist Team"
          subtitle="Our experienced professionals are trained to offer compassionate care for every patient."
          backgroundImage={heroBg}
        />

        {/* Featured Team Members - Alternating large profile sections */}
        <section className="bg-background">
          {team.map((member, i) => (
            <div key={member.name} className={`${i % 2 === 0 ? "bg-background" : "bg-section-blue"}`}>
              <div className="container-narrow section-padding">
                <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 !== 0 ? "lg:direction-rtl" : ""}`}>
                  {/* Image */}
                  <div className={`relative ${i % 2 !== 0 ? "lg:order-2" : ""}`}>
                    <div className="rounded-3xl overflow-hidden shadow-card relative group">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-[400px] lg:h-[500px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
                      {/* Name overlay on image */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-primary-foreground font-heading text-sm font-medium tracking-wider uppercase opacity-90">{member.role}</p>
                      </div>
                    </div>
                    {/* Decorative accent */}
                    <div className={`absolute -z-10 w-24 h-24 rounded-2xl bg-primary/10 ${i % 2 === 0 ? "-bottom-4 -right-4" : "-bottom-4 -left-4"}`} />
                  </div>

                  {/* Content */}
                  <div className={`space-y-6 ${i % 2 !== 0 ? "lg:order-1" : ""}`}>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground">{member.name}</h2>
                      <p className="text-primary font-semibold mt-1">{member.role}</p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-lg">{member.bio}</p>

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 bg-card rounded-xl p-4 border border-border">
                        <GraduationCap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Education</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5">{member.education}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-card rounded-xl p-4 border border-border">
                        <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Experience</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5">{member.experience}</p>
                        </div>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-primary" />
                        Specialties
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.map((s) => (
                          <span key={s} className="px-4 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Support Staff Section */}
        <section className="bg-section-blue section-padding">
          <div className="container-narrow">
            <div className="text-center mb-10">
              <span className="text-primary text-sm font-semibold tracking-wide uppercase">Support Team</span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3">Our Dedicated Staff</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {staff.map((member) => (
                <div key={member.name} className="bg-card rounded-2xl p-6 border border-border text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{member.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                  <p className="text-primary font-medium text-sm mt-1">{member.role}</p>
                  {member.education && (
                    <p className="text-muted-foreground text-xs mt-2">{member.education}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team values banner */}
        <section className="bg-primary-gradient relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 border-2 border-primary-foreground rounded-full" />
            <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-primary-foreground rounded-full" />
          </div>
          <div className="container-narrow section-padding relative z-10">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { stat: "25+", label: "Years Combined Experience" },
                { stat: "16k+", label: "Patients Treated" },
                { stat: "3", label: "Specialist Doctors" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground">{item.stat}</p>
                  <p className="text-primary-foreground/70 mt-2 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default TeamPage;
