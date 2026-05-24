import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { Star, Quote, ThumbsUp, Users, Award } from "lucide-react";
import heroBg from "@/assets/gallery-29.jpg";

const testimonials = [
  {
    name: "Ashley Williams",
    text: "The team at D'Bridge made my dental experience truly exceptional. They are so caring, professional, and knowledgeable. I've never felt more comfortable at a dental clinic.",
    rating: 5,
    service: "General Checkup",
  },
  {
    name: "Emeka Thompson",
    text: "I had a root canal and was terrified, but the dentist at D'Bridge made it painless. The modern equipment and friendly staff put me at ease immediately.",
    rating: 5,
    service: "Root Canal",
  },
  {
    name: "Amaka Okafor",
    text: "My children love going to D'Bridge! The pediatric team is fantastic, making every visit fun and educational. The clinic is spotless and welcoming.",
    rating: 5,
    service: "Pediatric Care",
  },
  {
    name: "Stephen Alade",
    text: "I can't recommend D'Bridge enough. After years of avoiding the dentist, their gentle approach and patience helped me overcome my fear completely.",
    rating: 5,
    service: "General Dentistry",
  },
  {
    name: "Jennifer Adeyemi",
    text: "My smile makeover at D'Bridge was life-changing. The attention to detail and personalized approach exceeded all my expectations. Truly world-class.",
    rating: 5,
    service: "Smile Makeover",
  },
  {
    name: "Anthony Nwosu",
    text: "From the receptionist to the surgeon, every team member is kind and professional. The facility is modern, clean, and equipped with the latest technology.",
    rating: 5,
    service: "Oral Surgery",
  },
  {
    name: "Blessing Okoro",
    text: "I've been to many dental clinics in Lagos, but D'Bridge stands out. The waiting area is comfortable, the staff is prompt, and the treatment was top-notch.",
    rating: 5,
    service: "Teeth Whitening",
  },
  {
    name: "David Obi",
    text: "Had my wisdom teeth removed at D'Bridge and the experience was smooth. Dr. Eze is incredibly skilled, and the follow-up care was outstanding.",
    rating: 5,
    service: "Wisdom Teeth Removal",
  },
  {
    name: "Chioma Nnadi",
    text: "The orthodontic treatment I received here has transformed my smile. The team monitored my progress closely and the results speak for themselves.",
    rating: 5,
    service: "Orthodontics",
  },
];

const ReviewsPage = () => {
  // Featured review (first one)
  const featured = testimonials[0];
  const restReviews = testimonials.slice(1);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <PageHero
          badge="Reviews"
          title="What Our Patients Are Saying"
          subtitle="We proudly hold a 4.8-star rating. Our patients consistently commend us for gentle care, a clean environment, and professional treatment."
          backgroundImage={heroBg}
        />

        {/* Stats strip */}
        <section className="bg-primary-gradient">
          <div className="container-narrow py-10 md:py-12">
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { icon: Award, stat: "4.8★", label: "Average Rating" },
                { icon: Users, stat: "16k+", label: "Satisfied Patients" },
                { icon: ThumbsUp, stat: "98%", label: "Would Recommend" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <item.icon className="w-6 h-6 text-primary-foreground/60" />
                  <p className="text-2xl md:text-3xl font-bold text-primary-foreground font-heading">{item.stat}</p>
                  <p className="text-xs md:text-sm text-primary-foreground/70">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured testimonial - large hero card */}
        <section className="section-padding bg-background">
          <div className="container-narrow">
            <div className="relative bg-section-blue rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden">
              {/* Decorative quote */}
              <Quote className="absolute top-8 right-8 w-24 h-24 text-primary/5" />

              <div className="relative z-10 max-w-3xl">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: featured.rating }).map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-xl md:text-2xl lg:text-3xl font-heading text-foreground leading-relaxed mb-8">
                  "{featured.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary-gradient flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">
                      {featured.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg">{featured.name}</p>
                    <p className="text-sm text-primary font-medium">{featured.service}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of reviews - masonry-style 2 columns */}
        <section className="section-padding bg-section-blue pt-0 md:pt-0">
          <div className="container-narrow">
            <div className="text-center mb-14 pt-16 md:pt-24">
              <span className="text-primary text-sm font-semibold tracking-wide uppercase">More Reviews</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">Stories From Our Patients</h2>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {restReviews.map((review) => (
                <div
                  key={review.name}
                  className="break-inside-avoid bg-card rounded-2xl p-6 border border-border hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">{review.service}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="w-9 h-9 rounded-full bg-primary-gradient flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-xs">
                        {review.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{review.name}</p>
                      <p className="text-xs text-muted-foreground">Verified Patient</p>
                    </div>
                  </div>
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

export default ReviewsPage;
