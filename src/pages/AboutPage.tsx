import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { CheckCircle, MapPin, CreditCard, ShieldCheck, Accessibility, Eye, Heart, Target } from "lucide-react";
import aboutImage from "@/assets/gallery-6.jpg";
import whyChooseImage from "@/assets/gallery-12.jpg";
import heroBg from "@/assets/gallery-15.jpg";
import cacCertificate from "@/assets/cac-certificate.png";

const highlights = [
  "Experienced and Caring Team of Professionals",
  "Advanced Technology for Dental Excellence",
  "Personalized Care Approach for Each Patient",
  "Wheelchair-Friendly & Fully Accessible Facility",
];

const amenities = [
  { icon: MapPin, title: "On-Site Parking", desc: "Secure and convenient parking for all patients." },
  { icon: Accessibility, title: "Inclusive Facilities", desc: "Gender-neutral restrooms and a private nursing room for parents." },
  { icon: ShieldCheck, title: "Hygiene Protocol", desc: "Highest standards of sterilization and clinic cleanliness." },
  { icon: CreditCard, title: "Flexible Payments", desc: "Cash, cards, bank transfers. Payment plans for major treatments." },
];

const corporateDetails = [
  { label: "Legal Entity", value: "DIGITAL BRIDGE DENTAL CLINIC LTD" },
  { label: "Trading Name", value: "D'Bridge Dental Clinic" },
  { label: "Registration Status", value: "Private Company Limited by Shares" },
  { label: "Company Reg. Number", value: "8361278" },
  { label: "TIN", value: "33000150-0001" },
  { label: "Date of Incorporation", value: "22nd March, 2025" },
  { label: "Governing Act", value: "CAMA 2020, Federal Republic of Nigeria" },
  { label: "Regulatory Body", value: "Corporate Affairs Commission (CAC), Nigeria" },
];

const timeline = [
  { year: "2024", title: "The Vision", desc: "A team of passionate dental professionals envisioned a clinic that would redefine dental care in Lagos." },
  { year: "2025", title: "Incorporation", desc: "D'Bridge Dental Clinic was officially registered as a Private Company Limited by Shares under CAMA 2020." },
  { year: "2025", title: "Doors Open", desc: "Our state-of-the-art facility at Cappa, Digital Bridge Institute opened, bringing world-class dental care to Lagos and beyond." },
  { year: "Future", title: "Growing Together", desc: "Expanding our services and team to serve even more families across Lagos and beyond." },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <PageHero
          badge="About Us"
          title="Achieve a Confident Smile With Us"
          subtitle="A premier dental practice in Lagos, Nigeria, renowned for blending cutting-edge dental care with a warm, patient-centered environment."
          backgroundImage={heroBg}
        />

        {/* Mission / Vision / Values - Unique 3-column cards */}
        <section className="section-padding bg-background">
          <div className="container-narrow">
            <div className="grid md:grid-cols-3 gap-6">
              {[
              { icon: Target, title: "Our Mission", text: "To deliver comprehensive, evidence-based dental care of the highest standard — ensuring every patient receives personalised treatment in a safe, modern, and welcoming clinical environment." },
                { icon: Eye, title: "Our Vision", text: "To be a leading dental practice recognised for clinical excellence, innovation, and compassionate patient care — setting the benchmark for quality dentistry in Nigeria and beyond." },
                { icon: Heart, title: "Our Values", text: "Excellence, compassion, integrity, and accessibility guide every interaction and treatment we deliver." },
              ].map((item) => (
                <div key={item.title} className="relative group">
                  <div className="bg-card rounded-3xl p-8 border border-border h-full relative overflow-hidden hover:shadow-card-hover transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary-gradient rounded-t-3xl" />
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story - Full-width immersive section */}
        <section className="relative overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[500px]">
            {/* Image half */}
            <div className="relative h-72 lg:h-auto">
              <img src={aboutImage} alt="D'Bridge Dental Clinic" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-primary/20" />
            </div>
            {/* Content half */}
            <div className="bg-section-blue flex items-center">
              <div className="p-8 md:p-12 lg:p-16 max-w-xl">
                <span className="text-primary text-sm font-semibold tracking-wide uppercase">Our Story</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 leading-tight">
                  Your Partner for a Complete, Confident Smile
                </h2>
                <p className="text-muted-foreground leading-relaxed mt-6">
                  D'Bridge Dental Clinic is committed to providing accessible, high-quality dental solutions
                  for every member of the family. Our state-of-the-art facility combines modern technology
                  with compassionate care to deliver outstanding dental experiences.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Located at 1 Nitel Road, Cappa Bus Stop, Lagos — our facility is
                  fully accessible, featuring a wheelchair-friendly entrance, dedicated parking, and
                  comfortable seating for all visitors.
                </p>
                <div className="space-y-3 mt-6">
                  {highlights.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground font-medium text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline - Our Journey */}
        <section className="section-padding bg-background">
          <div className="container-narrow">
            <div className="text-center mb-14">
              <span className="text-primary text-sm font-semibold tracking-wide uppercase">Our Journey</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">How We Got Here</h2>
            </div>

            <div className="relative max-w-3xl mx-auto">
              {/* Vertical line */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

              {timeline.map((item, i) => (
                <div key={i} className={`relative flex items-start gap-6 mb-12 last:mb-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-primary -translate-x-1.5 mt-2 ring-4 ring-background z-10" />

                  {/* Content */}
                  <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:ml-auto"}`}>
                    <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full mb-2">{item.year}</span>
                    <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy Quote - Full-width banner */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0">
            <img src={whyChooseImage} alt="Advanced dental technology" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/80" />
          </div>
          <div className="container-narrow relative z-10 text-center">
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-background leading-tight max-w-4xl mx-auto">
              "We believe everyone deserves a smile they're proud of — that's why we combine world-class
              technology with genuine compassion in everything we do."
            </blockquote>
            <p className="text-background/60 mt-6 text-sm uppercase tracking-widest">— The D'Bridge Team</p>
          </div>
        </section>

        {/* Amenities - Horizontal layout */}
        <section className="section-padding bg-background">
          <div className="container-narrow">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div>
                <span className="text-primary text-sm font-semibold tracking-wide uppercase">Our Facilities</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">Amenities & Comfort</h2>
              </div>
              <p className="text-muted-foreground max-w-md">
                We've designed every detail of our clinic for your comfort and convenience.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {amenities.map((a, i) => (
                <div key={a.title} className="flex items-start gap-5 bg-card rounded-2xl p-6 border border-border hover:shadow-card-hover transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary-gradient flex items-center justify-center flex-shrink-0">
                    <a.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{a.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate Details with CAC Certificate */}
        <section className="section-padding bg-section-blue">
          <div className="container-narrow">
            <div className="text-center mb-14">
              <span className="text-primary text-sm font-semibold tracking-wide uppercase">Corporate Information</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">Official Registration</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
                Our formal registration assures patients and partners of our legitimacy, commitment to
                corporate governance, and adherence to Nigerian business and healthcare regulations.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* CAC Certificate Image */}
              <div className="flex justify-center">
                <div className="rounded-2xl overflow-hidden shadow-card border-4 border-background max-w-md">
                  <img
                    src={cacCertificate}
                    alt="Certificate of Incorporation - Digital Bridge Dental Clinic Ltd"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* Corporate Details Table */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                {corporateDetails.map((item, i) => (
                  <div key={item.label} className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 p-4 sm:p-5 ${i !== corporateDetails.length - 1 ? "border-b border-border" : ""}`}>
                    <span className="text-sm font-semibold text-foreground sm:w-2/5">{item.label}</span>
                    <span className="text-sm text-muted-foreground sm:w-3/5">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
