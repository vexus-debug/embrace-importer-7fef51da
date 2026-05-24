import { useParallax } from "@/hooks/useParallax";

interface ParallaxDividerProps {
  image: string;
  height?: string;
  overlayOpacity?: string;
  children?: React.ReactNode;
}

const ParallaxDivider = ({ 
  image, 
  height = "h-[400px]", 
  overlayOpacity = "bg-foreground/40",
  children 
}: ParallaxDividerProps) => {
  const offset = useParallax(0.4);

  return (
    <section className={`relative ${height} overflow-hidden`}>
      <div
        className="absolute inset-0 w-full h-[130%] -top-[15%]"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${offset}px)`,
          willChange: "transform",
        }}
      />
      <div className={`absolute inset-0 ${overlayOpacity}`} />
      {children && (
        <div className="relative z-10 h-full flex items-center justify-center">
          {children}
        </div>
      )}
    </section>
  );
};

export default ParallaxDivider;
