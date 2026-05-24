import { CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";

const FloatingBookButton = () => {
  return (
    <Link
      to="/contact"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-hero hover:scale-105 transition-transform duration-200 text-sm md:text-base whitespace-nowrap"
    >
      <CalendarCheck className="w-5 h-5" />
      Book Appointment
    </Link>
  );
};

export default FloatingBookButton;
