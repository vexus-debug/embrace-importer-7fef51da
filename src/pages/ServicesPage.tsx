import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import heroBg from "@/assets/gallery-1.jpg";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { servicesData } from "@/data/servicesData";

const ServicesPage = () => {
  const [activeService, setActiveService] = useState(0);
  const [mobileActive, setMobileActive] = useState<number | null>(null);
  const selected = servicesData[activeService];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <PageHero
          badge="Our Services"
          title="Comprehensive Dental Services"
          subtitle="A full spectrum of dental specialties to meet all your oral health needs under one roof."
          backgroundImage={heroBg}
        />

        {/* Interactive Service Explorer */}
        <section className="section-padding bg-background">
          <div className="container-narrow">
            <div className="text-center mb-14">
              <span className="text-primary text-sm font-semibold tracking-wide uppercase">Explore Our Specialties</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
                Choose a Service to Learn More
              </h2>
            </div>

            {/* Desktop: Tab + detail layout */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4">
                <div className="flex flex-col gap-2">
                  {servicesData.map((service, i) => (
                    <button
                      key={service.title}
                      onClick={() => setActiveService(i)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 w-full",
                        activeService === i
                          ? "bg-primary text-primary-foreground shadow-hero"
                          : "bg-card border border-border hover:border-primary/30 text-foreground"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                        activeService === i ? "bg-primary-foreground/20" : "bg-secondary"
                      )}>
                        <service.icon className={cn(
                          "w-5 h-5 transition-colors",
                          activeService === i ? "text-primary-foreground" : "text-primary"
                        )} />
                      </div>
                      <span className="font-semibold text-sm">{service.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="bg-card rounded-3xl border border-border p-10 relative overflow-hidden">
                  <span className="absolute top-6 right-8 text-8xl font-heading font-bold text-primary/5 select-none">
                    {String(activeService + 1).padStart(2, "0")}
                  </span>
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-primary-gradient flex items-center justify-center mb-6">
                      <selected.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{selected.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg mb-8">{selected.shortDescription}</p>
                    <div className="border-t border-border pt-6">
                      <p className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">What's Included</p>
                      <div className="grid sm:grid-cols-2 gap-3 mb-6">
                        {selected.details.map((detail) => (
                          <div key={detail} className="flex items-start gap-3 group">
                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{detail}</span>
                          </div>
                        ))}
                      </div>
                      <Link
                        to={`/services/${selected.slug}`}
                        className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                      >
                        Learn More <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: Expandable accordion cards */}
            <div className="lg:hidden space-y-3">
              {servicesData.map((service, i) => (
                <div
                  key={service.title}
                  className="bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setMobileActive(mobileActive === i ? null : i)}
                    className="flex items-center gap-3 w-full p-4 text-left"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                      mobileActive === i ? "bg-primary" : "bg-secondary"
                    )}>
                      <service.icon className={cn(
                        "w-5 h-5 transition-colors",
                        mobileActive === i ? "text-primary-foreground" : "text-primary"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-foreground">{service.title}</h3>
                    </div>
                    <ArrowRight className={cn(
                      "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300",
                      mobileActive === i ? "rotate-90 text-primary" : ""
                    )} />
                  </button>
                  {mobileActive === i && (
                    <div className="px-4 pb-4 pt-0 border-t border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed mt-3 mb-4">{service.shortDescription}</p>
                      <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">What's Included</p>
                      <div className="space-y-2 mb-4">
                        {service.details.map((detail) => (
                          <div key={detail} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{detail}</span>
                          </div>
                        ))}
                      </div>
                      <Link
                        to={`/services/${service.slug}`}
                        className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                      >
                        Learn More <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Categories Overview - Numbered blocks */}
        <section className="section-padding bg-section-blue">
          <div className="container-narrow">
            <div className="text-center mb-14">
              <span className="text-primary text-sm font-semibold tracking-wide uppercase">At a Glance</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">All Services Overview</h2>
            </div>

            <div className="space-y-4">
              {servicesData.map((service, i) => (
                <Link
                  key={service.title}
                  to={`/services/${service.slug}`}
                  className="group bg-card rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden block"
                >
                  <div className="flex items-center gap-3 sm:gap-5 p-4 sm:p-5 md:p-6">
                    <span className="text-2xl sm:text-3xl font-heading font-bold text-primary/20 group-hover:text-primary/50 transition-colors w-8 sm:w-12 text-center flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-secondary group-hover:bg-primary flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                      <service.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-lg font-bold text-foreground truncate">{service.title}</h3>
                      <p className="text-sm text-muted-foreground hidden sm:block">{service.shortDescription}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
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

export default ServicesPage;
