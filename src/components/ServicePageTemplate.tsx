import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import heroBg from "@/assets/gallery-1.jpg";
import { LucideIcon } from "lucide-react";

interface ServiceData {
  icon: LucideIcon;
  slug: string;
  title: string;
  heroDescription: string;
  details: string[];
  fullContent: {
    overview: string;
    benefits: string[];
    procedures: {
      name: string;
      description: string;
    }[];
    faq: {
      question: string;
      answer: string;
    }[];
  };
}

interface ServicePageTemplateProps {
  service: ServiceData;
  relatedServices?: { title: string; slug: string; icon: LucideIcon }[];
}

const ServicePageTemplate = ({ service, relatedServices }: ServicePageTemplateProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const Icon = service.icon;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <PageHero
          badge={service.title}
          title={service.title}
          subtitle={service.heroDescription}
          backgroundImage={heroBg}
        />

        {/* Overview Section */}
        <section className="section-padding bg-background">
          <div className="container-narrow">
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary-gradient flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="text-primary text-sm font-semibold tracking-wide uppercase">About This Service</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-1">Overview</h2>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {service.fullContent.overview}
                </p>

                {/* What's Included */}
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-foreground mb-6">What's Included</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {service.details.map((detail) => (
                      <div key={detail} className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Benefits Sidebar */}
              <div className="lg:col-span-4">
                <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-foreground mb-4">Key Benefits</h3>
                  <ul className="space-y-3">
                    {service.fullContent.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">{index + 1}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Procedures Section */}
        <section className="section-padding bg-section-blue">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <span className="text-primary text-sm font-semibold tracking-wide uppercase">Our Treatments</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">Procedures We Offer</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {service.fullContent.procedures.map((procedure, index) => (
                <div
                  key={procedure.name}
                  className="group bg-card rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl font-heading font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{procedure.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{procedure.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-background">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <span className="text-primary text-sm font-semibold tracking-wide uppercase">Got Questions?</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">Frequently Asked Questions</h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {service.fullContent.faq.map((item, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl border border-border overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-semibold text-foreground pr-4">{item.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 pt-0 border-t border-border">
                      <p className="text-muted-foreground leading-relaxed mt-4">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Services */}
        {relatedServices && relatedServices.length > 0 && (
          <section className="section-padding bg-section-blue">
            <div className="container-narrow">
              <div className="text-center mb-10">
                <span className="text-primary text-sm font-semibold tracking-wide uppercase">Explore More</span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3">Related Services</h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedServices.map((related) => {
                  const RelatedIcon = related.icon;
                  return (
                    <Link
                      key={related.slug}
                      to={`/services/${related.slug}`}
                      className="group bg-card rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-card-hover transition-all duration-300 flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-xl bg-secondary group-hover:bg-primary flex items-center justify-center transition-colors duration-300">
                        <RelatedIcon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{related.title}</h3>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="section-padding bg-primary-gradient">
          <div className="container-narrow">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                Schedule your appointment today and take the first step toward a healthier, more beautiful smile.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="text-base font-semibold"
                >
                  <Link to="/contact">Book Appointment</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base font-semibold bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <a href="tel:+2348136958121" className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call Us Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicePageTemplate;
