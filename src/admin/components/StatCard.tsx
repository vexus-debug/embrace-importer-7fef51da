import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: string;
  icon: LucideIcon;
  change?: number;
  formatter?: (val: number) => string;
  gradient?: string;
  sparkData?: number[];
  delay?: number;
}

export function StatCard({
  title,
  value,
  prefix = "",
  icon: Icon,
  change,
  formatter,
  gradient = "from-primary/20 to-accent/20",
  sparkData = [],
  delay = 0,
}: StatCardProps) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const numValue = typeof value === "number" ? value : 0;
  const isString = typeof value === "string";

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (isString || !visible) return;
    const duration = 1400;
    const steps = 50;
    const increment = numValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numValue) {
        setCount(numValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [numValue, isString, visible]);

  const displayValue = isString
    ? value
    : formatter
    ? formatter(count)
    : `${prefix}${count.toLocaleString()}`;

  // Mini sparkline SVG
  const sparkMax = Math.max(...sparkData, 1);
  const sparkPoints = sparkData
    .map((v, i) => {
      const x = (i / (sparkData.length - 1)) * 60;
      const y = 20 - (v / sparkMax) * 16;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-5 transition-all duration-500 ease-out",
        "hover:-translate-y-1 hover:shadow-card-hover hover:border-primary/30",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Subtle gradient background glow */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br",
          gradient
        )}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-1.5 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl font-bold text-card-foreground tracking-tight">
            {displayValue}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full",
                  change >= 0
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
              </span>
              <span className="text-[10px] text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>

        <div
          className={cn(
            "h-11 w-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110",
            gradient
          )}
        >
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* Sparkline */}
      {sparkData.length > 1 && (
        <div className="relative z-10 mt-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <svg
            width="100%"
            height="24"
            viewBox="0 0 60 24"
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            <defs>
              <linearGradient id={`spark-${title.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              points={`0,20 ${sparkPoints} 60,20`}
              fill={`url(#spark-${title.replace(/\s/g, "")})`}
            />
            <polyline
              points={sparkPoints}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
