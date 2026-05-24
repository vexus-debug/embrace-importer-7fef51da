import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Send, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import heroBg from "@/assets/gallery-10.jpg";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", service: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting D'Bridge Dental Clinic. We'll get back to you shortly.",
    });
    setFormData({ name: "", email: "", phone: "", service: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <PageHero
          badge="Contact"
          title="Get in Touch With Us"
          subtitle="Ready to schedule your appointment? Contact us today and take the first step towards a healthier, brighter smile."
          backgroundImage={heroBg}
        />

        {/* Full-width split: Form + Sidebar */}
        <section className="bg-background">
          <div className="container-narrow section-padding">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left: Contact form */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-3xl p-8 md:p-10 border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center">
                      <Send className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Book an Appointment</h2>
                  </div>
                  <p className="text-muted-foreground mb-8">
                    Fill out the form and we'll confirm your appointment within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                          placeholder="+234 xxx xxx xxxx"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Service Needed</label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                        >
                          <option value="">Select a service</option>
                          <option>Preventive Dentistry</option>
                          <option>Restorative Dentistry</option>
                          <option>Cosmetic Dentistry</option>
                          <option>Orthodontics</option>
                          <option>Pediatric Dentistry</option>
                          <option>Oral Surgery</option>
                          <option>Periodontics</option>
                          <option>Emergency Services</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-shadow"
                        placeholder="Tell us about your dental needs..."
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full gap-2">
                      <Send className="w-4 h-4" />
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>

              {/* Right: Sidebar info stack */}
              <div className="space-y-6">
                {/* Operating hours card */}
                <div className="bg-primary-gradient rounded-3xl p-6 md:p-8 text-primary-foreground">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-5 h-5" />
                    <h3 className="text-xl font-bold">Operating Hours</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { day: "Mon – Fri", hours: "8:30 AM – 5:00 PM" },
                      { day: "Saturday", hours: "9:00 AM – 3:00 PM" },
                      { day: "Sunday", hours: "Closed" },
                    ].map((item) => (
                      <div key={item.day} className="flex justify-between items-center py-2 border-b border-primary-foreground/15 last:border-0">
                        <span className="font-medium text-sm">{item.day}</span>
                        <span className="text-sm text-primary-foreground/80">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact details cards */}
                <a href="tel:+2348136958121" className="flex items-center gap-4 bg-card rounded-2xl p-5 border border-border hover:shadow-card-hover hover:border-primary/30 transition-all duration-300 group">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <Phone className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Phone</p>
                    <p className="text-sm font-semibold text-foreground">+234 813 695 8121</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>

                <a href="mailto:Digitalbridgedentalclinic@gmail.com" className="flex items-center gap-4 bg-card rounded-2xl p-5 border border-border hover:shadow-card-hover hover:border-primary/30 transition-all duration-300 group">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <Mail className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Email</p>
                    <p className="text-sm font-semibold text-foreground">Digitalbridgedentalclinic@gmail.com</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>

                <div className="bg-card rounded-2xl p-5 border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Location</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">1 Nitel Road, Cappa Bus Stop</p>
                      <p className="text-sm text-muted-foreground">Lagos, Nigeria</p>
                    </div>
                  </div>
                </div>

                {/* Accessibility note */}
                <div className="bg-section-blue rounded-2xl p-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">♿ Accessibility:</strong> Wheelchair-friendly entrance,
                    dedicated parking, gender-neutral restrooms, and private nursing room.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map placeholder - full width */}
        <section className="bg-section-blue">
          <div className="container-narrow section-padding !pt-0">
            <div className="rounded-3xl overflow-hidden border border-border bg-card h-64 md:h-80 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-10 h-10 text-primary/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">1 Nitel Road, Cappa Bus Stop</p>
                <p className="text-sm text-muted-foreground">Lagos, Nigeria</p>
                <a
                  href="https://maps.google.com/?q=1+Nitel+Road+Cappa+Bus+Stop+Lagos"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3 hover:underline"
                >
                  Open in Google Maps <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
