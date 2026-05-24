import { useState, useEffect } from "react";
import { Menu, Phone, ChevronDown, ChevronRight, X, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import logo from "@/assets/logo.jpg";
import { servicesData } from "@/data/servicesData";

const navLinks = [
  { label: "About Us", href: "/about" },
  { 
    label: "Our Services", 
    href: "/services",
    hasDropdown: true,
    dropdownItems: servicesData.map(s => ({
      label: s.title,
      href: `/services/${s.slug}`,
      icon: s.icon,
    })),
  },
  { label: "Our Team", href: "/team" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close dropdown on route change
  useEffect(() => {
    setServicesDropdownOpen(false);
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container-narrow section-padding !py-0">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="D'Bridge Dental Clinic" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-heading font-bold text-xl text-foreground">
              D'Bridge <span className="text-primary">Dental</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div 
                  key={link.label} 
                  className="relative"
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                      location.pathname.startsWith("/services")
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {servicesDropdownOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                      <div className="w-72 bg-card rounded-xl border border-border shadow-lg py-2 animate-fade-in">
                        <Link
                          to="/services"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors border-b border-border mb-1"
                        >
                          View All Services
                        </Link>
                        <div className="max-h-80 overflow-y-auto">
                          {link.dropdownItems?.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                  location.pathname === item.href
                                    ? "text-primary bg-secondary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                }`}
                              >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <span>{item.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+2348136958121" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />
              +234 813 695 8121
            </a>
            <Button asChild>
              <Link to="/contact">Book Appointment</Link>
            </Button>
          </div>

          {/* Mobile Menu - Sheet */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <button className="p-2 text-foreground" aria-label="Toggle menu">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
              <SheetHeader className="p-6 border-b border-border">
                <SheetTitle className="flex items-center gap-2">
                  <img src={logo} alt="D'Bridge Dental" className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-heading font-bold text-lg">
                    D'Bridge <span className="text-primary">Dental</span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col p-4">
                {navLinks.map((link) => (
                  link.hasDropdown ? (
                    <Collapsible 
                      key={link.label} 
                      open={mobileServicesOpen} 
                      onOpenChange={setMobileServicesOpen}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-2 text-base font-medium text-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary">
                        <span className={location.pathname.startsWith("/services") ? "text-primary" : ""}>
                          {link.label}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? "rotate-90" : ""}`} />
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="pl-2 mt-1 space-y-1">
                        <Link
                          to="/services"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 py-2.5 px-3 text-sm font-semibold text-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                        >
                          View All Services
                        </Link>
                        {link.dropdownItems?.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setMobileOpen(false)}
                              className={`flex items-center gap-3 py-2.5 px-3 text-sm rounded-lg transition-colors ${
                                location.pathname === item.href
                                  ? "text-primary bg-secondary"
                                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                              }`}
                            >
                              <Icon className="w-4 h-4 flex-shrink-0" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`py-3 px-2 text-base font-medium rounded-lg transition-colors hover:bg-secondary ${
                        location.pathname === link.href
                          ? "text-primary"
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                ))}
                
                <div className="mt-6 pt-6 border-t border-border space-y-4">
                  <a 
                    href="tel:+2348136958121" 
                    className="flex items-center gap-3 py-2 px-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +234 813 695 8121
                  </a>
                  <a 
                    href="tel:+2349019760010" 
                    className="flex items-center gap-3 py-2 px-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +234 901 976 0010
                  </a>
                  <a
                    href="https://www.instagram.com/digitalbridge_dentalclinic?igsh=MWxrMXVwdGIwZngzOA%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 py-2 px-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    Follow us on Instagram
                  </a>
                  <a
                    href="https://www.tiktok.com/@digitalbridge_den"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 py-2 px-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    Follow us on TikTok
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61583952519155"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 py-2 px-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                    Follow us on Facebook
                  </a>
                  <Button asChild className="w-full">
                    <Link to="/contact" onClick={() => setMobileOpen(false)}>
                      Book Appointment
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
