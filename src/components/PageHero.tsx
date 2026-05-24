import { Link } from "react-router-dom";

interface PageHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  backgroundImage?: string;
}

const PageHero = ({ badge, title, subtitle, backgroundImage }: PageHeroProps) => {
  return (
    <section className="relative pt-20 overflow-hidden">
      {/* Background */}
      {backgroundImage ? (
        <>
          <div className="absolute inset-0">
            <img src={backgroundImage} alt="" className="w-full h-full object-cover" aria-hidden="true" />
            <div className="absolute inset-0 bg-foreground/70" />
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-section-blue" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-gradient opacity-5 rounded-bl-[200px]" />
        </>
      )}

      <div className="container-narrow section-padding relative z-10 text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${backgroundImage ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"}`}>
          <span className={`w-2 h-2 rounded-full ${backgroundImage ? "bg-primary-foreground" : "bg-primary"}`} />
          {badge}
        </div>
        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl mx-auto ${backgroundImage ? "text-primary-foreground" : "text-foreground"}`}>
          {title}
        </h1>
        <p className={`text-lg mt-6 max-w-2xl mx-auto leading-relaxed ${backgroundImage ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
          {subtitle}
        </p>

        {/* Breadcrumb */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm">
          <Link to="/" className={`hover:text-primary transition-colors ${backgroundImage ? "text-primary-foreground/70" : "text-muted-foreground"}`}>Home</Link>
          <span className={backgroundImage ? "text-primary-foreground/50" : "text-muted-foreground"}>/</span>
          <span className={`font-medium ${backgroundImage ? "text-primary-foreground" : "text-primary"}`}>{badge}</span>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
