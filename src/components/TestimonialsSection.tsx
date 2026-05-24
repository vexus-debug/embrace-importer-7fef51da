import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ashley Williams",
    text: "The team at D'Bridge made my dental experience truly exceptional. They are so caring, professional, and knowledgeable. I've never felt more comfortable at a dental clinic.",
    rating: 5,
  },
  {
    name: "Emeka Thompson",
    text: "I had a root canal and was terrified, but the dentist at D'Bridge made it painless. The modern equipment and friendly staff put me at ease immediately.",
    rating: 5,
  },
  {
    name: "Amaka Okafor",
    text: "My children love going to D'Bridge! The pediatric team is fantastic, making every visit fun and educational. The clinic is spotless and welcoming.",
    rating: 5,
  },
  {
    name: "Stephen Alade",
    text: "I can't recommend D'Bridge enough. After years of avoiding the dentist, their gentle approach and patience helped me overcome my fear completely.",
    rating: 5,
  },
  {
    name: "Jennifer Adeyemi",
    text: "My smile makeover at D'Bridge was life-changing. The attention to detail and personalized approach exceeded all my expectations. Truly world-class.",
    rating: 5,
  },
  {
    name: "Anthony Nwosu",
    text: "From the receptionist to the surgeon, every team member is kind and professional. The facility is modern, clean, and equipped with the latest technology.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="reviews" className="section-padding bg-background">
      <div className="container-narrow">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="text-primary text-sm font-semibold tracking-wide uppercase">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
              What Our Patients <br className="hidden sm:block" />Are Saying
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            We are proud that our patients share their positive experiences. Here's 
            what they say about D'Bridge Dental Clinic.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((review) => (
            <div
              key={review.name}
              className="bg-card rounded-2xl p-6 border border-border hover:shadow-card-hover transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-gradient flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    {review.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">Patient</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
