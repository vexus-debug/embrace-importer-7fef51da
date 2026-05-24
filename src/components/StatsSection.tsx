import { useElementParallax } from "@/hooks/useParallax";

const stats = [
  { number: "25+", label: "Total Dental Care Services" },
  { number: "12+", label: "Expert Professionals" },
  { number: "16k+", label: "Satisfied Patients" },
  { number: "86+", label: "Valued Dentists" },
];

const StatsSection = () => {
  const { ref, offset } = useElementParallax(0.05);

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-narrow" ref={ref}>
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            The Reasons D'Bridge <br className="hidden sm:block" />is Unbeatable
          </h2>
        </div>

        <div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          style={{ transform: `translateY(${offset}px)`, willChange: "transform" }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center p-8 rounded-2xl transition-all duration-300 ${
                i === 1
                  ? "bg-primary-gradient text-primary-foreground shadow-hero lg:scale-105"
                  : "bg-card border border-border hover:shadow-card hover:border-primary/20"
              }`}
            >
              <div className={`text-4xl md:text-5xl font-bold font-heading ${i === 1 ? "" : "text-foreground"}`}>
                {stat.number}
              </div>
              <p className={`text-sm mt-2 ${i === 1 ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
