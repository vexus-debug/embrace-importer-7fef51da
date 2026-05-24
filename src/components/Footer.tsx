import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Our Team", href: "/team" },
  { label: "Patient Reviews", href: "/reviews" },
  { label: "Contact Us", href: "/contact" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-narrow section-padding !pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary-gradient flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-lg">D</span>
              </div>
              <span className="font-heading font-bold text-xl">D'Bridge Dental</span>
            </Link>
            <p className="text-background/60 text-sm leading-relaxed">
              Your partner for a complete, confident smile. Premier dental care in Lagos, Nigeria.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/profile.php?id=61583952519155"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center text-background/60 hover:text-background hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/digitalbridge_dentalclinic?igsh=MWxrMXVwdGIwZngzOA%3D%3D&utm_source=qr"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center text-background/60 hover:text-background hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@digitalbridge_den"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center text-background/60 hover:text-background hover:bg-primary transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-lg">Contact Info</h4>
            <div className="space-y-3">
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="flex items-start gap-3 text-sm text-background/60 hover:text-background transition-colors">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>1 Nitel Road, Cappa Bus Stop, Lagos</span>
              </a>
              <a href="tel:+2348136958121" className="flex items-center gap-3 text-sm text-background/60 hover:text-background transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+234 813 695 8121</span>
              </a>
              <a href="tel:+2349019760010" className="flex items-center gap-3 text-sm text-background/60 hover:text-background transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+234 901 976 0010</span>
              </a>
              <a href="mailto:Digitalbridgedentalclinic@gmail.com" className="flex items-center gap-3 text-sm text-background/60 hover:text-background transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>Digitalbridgedentalclinic@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-lg">Quick Links</h4>
            <nav className="space-y-2">
              {quickLinks.map((link) => (
                <Link key={link.label} to={link.href} className="block text-sm text-background/60 hover:text-background transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-lg">Opening Hours</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-3 text-sm text-background/60">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p>Mon – Thu: 8:30 AM – 5:00 PM</p>
                  <p>Friday: 8:30 AM – 5:00 PM</p>
                  <p>Saturday: 9:00 AM – 3:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            © 2025 D'Bridge Dental Clinic Ltd. All Rights Reserved.
          </p>
          <p className="text-sm text-background/50">
            RC: 8361278 | TIN: 33000150-0001
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
