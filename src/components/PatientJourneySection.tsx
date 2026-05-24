import { Stethoscope, CalendarCheck, Smile, HeartPulse } from "lucide-react";

const steps = [
  {
    icon: CalendarCheck,
    step: "01",
    title: "Book Your Visit",
    description: "Schedule an appointment online or by phone. We'll find the perfect time for you.",
  },
  {
    icon: Stethoscope,
    step: "02",
    title: "Get a Full Assessment",
    description: "Our specialists conduct a thorough examination using advanced diagnostic tools.",
  },
  {
    icon: HeartPulse,
    step: "03",
    title: "Personalized Treatment",
    description: "Receive a tailored treatment plan designed for your unique dental needs and goals.",
  },
  {
    icon: Smile,
    step: "04",
    title: "Smile With Confidence",
    description: "Walk out with a healthier, brighter smile and ongoing support for lasting results.",
  },
];

const PatientJourneySection = () => {
  return (
    <section className="section-padding bg-primary-gradient relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container-narrow relative z-10">
        <div className="text-center mb-14">
          <span className="text-primary-foreground/70 text-sm font-semibold tracking-wide uppercase">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mt-3">
            Your Journey to a <br className="hidden sm:block" />Perfect Smile
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, i) => (
            <div key={item.title} className="relative text-center group">
              {/* Connector line (hidden on last item and mobile) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px border-t-2 border-dashed border-primary-foreground/20" />
              )}

              <div className="w-20 h-20 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary-foreground/20 transition-colors duration-300 relative">
                <item.icon className="w-8 h-8 text-primary-foreground" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary-foreground text-primary text-xs font-bold flex items-center justify-center">
                  {item.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-primary-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-xs mx-auto">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PatientJourneySection;
