import { useToothRecords } from "@/hooks/useToothRecords";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const toothStatusColors: Record<string, string> = {
  healthy: "bg-emerald-100 text-emerald-700",
  decayed: "bg-amber-100 text-amber-700",
  treated: "bg-blue-100 text-blue-700",
  missing: "bg-red-100 text-red-700",
};

const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

interface PatientDentalChartProps {
  patientId: string;
}

export default function PatientDentalChart({ patientId }: PatientDentalChartProps) {
  const { data: toothRecords = [], isLoading } = useToothRecords(patientId);

  const getToothStatus = (num: number) => {
    // Get the latest record for this tooth
    const record = toothRecords.find((r) => r.tooth_number === num);
    return record?.status || "healthy";
  };

  const getToothInfo = (num: number) => {
    return toothRecords.filter((r) => r.tooth_number === num);
  };

  if (isLoading) return <Skeleton className="h-24 w-full" />;

  const allTeeth = [...upperTeeth, ...lowerTeeth];
  const nonHealthyTeeth = allTeeth.filter(n => getToothStatus(n) !== "healthy");

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-3">
        <div>
          <p className="text-xs text-muted-foreground text-center mb-1">Upper Jaw</p>
          <div className="flex gap-0.5 justify-center flex-wrap">
            {upperTeeth.map(n => {
              const status = getToothStatus(n);
              return (
                <div
                  key={n}
                  title={`Tooth ${n}: ${status}`}
                  className={`w-7 h-8 rounded text-[10px] font-semibold flex items-center justify-center border ${toothStatusColors[status] || "bg-card"}`}
                >
                  {n}
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full border-t border-dashed border-border" />
        <div>
          <p className="text-xs text-muted-foreground text-center mb-1">Lower Jaw</p>
          <div className="flex gap-0.5 justify-center flex-wrap">
            {lowerTeeth.map(n => {
              const status = getToothStatus(n);
              return (
                <div
                  key={n}
                  title={`Tooth ${n}: ${status}`}
                  className={`w-7 h-8 rounded text-[10px] font-semibold flex items-center justify-center border ${toothStatusColors[status] || "bg-card"}`}
                >
                  {n}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-3 flex-wrap justify-center">
        {Object.entries(toothStatusColors).map(([status, cls]) => (
          <div key={status} className="flex items-center gap-1">
            <div className={`h-2.5 w-2.5 rounded-sm ${cls.split(" ")[0]}`} />
            <span className="text-[10px] capitalize text-muted-foreground">{status}</span>
          </div>
        ))}
      </div>

      {/* Summary of non-healthy teeth */}
      {nonHealthyTeeth.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Findings:</p>
          <div className="flex flex-wrap gap-1.5">
            {nonHealthyTeeth.map(n => {
              const status = getToothStatus(n);
              return (
                <Badge key={n} variant="secondary" className={`text-[10px] ${toothStatusColors[status]}`}>
                  #{n} — {status}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
