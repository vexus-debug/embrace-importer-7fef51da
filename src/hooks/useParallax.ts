import { useState, useEffect, useCallback } from "react";

export const useParallax = (speed: number = 0.5) => {
  const [offset, setOffset] = useState(0);

  const handleScroll = useCallback(() => {
    setOffset(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return offset * speed;
};

export const useElementParallax = (speed: number = 0.3) => {
  const [offset, setOffset] = useState(0);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const handleScroll = () => {
      const rect = ref.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distance = elementCenter - viewportCenter;
      setOffset(distance * speed);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref, speed]);

  return { ref: setRef, offset };
};
