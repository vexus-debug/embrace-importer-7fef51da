interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; name?: string; color?: string }[];
  label?: string;
  prefix?: string;
}

export function CustomTooltip({ active, payload, label, prefix = "" }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-md shadow-lg px-4 py-3 min-w-[140px]">
      {label && (
        <p className="text-xs font-medium text-muted-foreground mb-1.5">{label}</p>
      )}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color || "hsl(var(--primary))" }}
          />
          <span className="text-sm font-semibold text-card-foreground">
            {prefix}{typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </span>
          {entry.name && (
            <span className="text-xs text-muted-foreground">{entry.name}</span>
          )}
        </div>
      ))}
    </div>
  );
}
