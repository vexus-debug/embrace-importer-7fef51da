import { useMemo } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { useStaff } from "@/hooks/useStaff";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const h = i + 8;
  return `${String(h).padStart(2, "0")}:00`;
});
const chairs = ["Chair 1", "Chair 2", "Chair 3", "Chair 4", "Chair 5"];
const statusColors: Record<string, string> = { scheduled: "bg-blue-100 text-blue-700 border-blue-200", completed: "bg-emerald-100 text-emerald-700 border-emerald-200", cancelled: "bg-red-100 text-red-700 border-red-200", "in-progress": "bg-yellow-100 text-yellow-700 border-yellow-200" };

export default function ChairManagementPage() {
  const { data: appointments = [], isLoading } = useAppointments();
  const { data: staff = [] } = useStaff();

  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = useMemo(() => appointments.filter(a => a.date === today), [appointments, today]);

  const getAppointmentForSlot = (chair: string, time: string) => {
    return todayAppointments.find(a => {
      const aChair = a.chair || "Chair 1";
      const aTime = a.time.substring(0, 5);
      return aChair === chair && aTime === time;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Chair Management</h1>
        <p className="text-sm text-muted-foreground">Visual schedule by chair — Today ({today})</p>
      </div>

      {isLoading ? <Skeleton className="h-96 w-full" /> : (
        <Card className="shadow-card overflow-auto">
          <CardContent className="p-4">
            <div className="min-w-[700px]">
              <div className="grid" style={{ gridTemplateColumns: `80px repeat(${chairs.length}, 1fr)` }}>
                {/* Header */}
                <div className="p-2 font-semibold text-xs text-muted-foreground border-b">Time</div>
                {chairs.map(c => (
                  <div key={c} className="p-2 font-semibold text-sm text-center border-b border-l">{c}</div>
                ))}

                {/* Time slots */}
                {timeSlots.map(time => (
                  <div key={time} className="contents">
                    <div className="p-2 text-xs text-muted-foreground border-b flex items-center">{time}</div>
                    {chairs.map(chair => {
                      const appt = getAppointmentForSlot(chair, time);
                      return (
                        <div key={`${chair}-${time}`} className="p-1 border-b border-l min-h-[48px]">
                          {appt && (
                            <div className={`p-2 rounded text-xs border ${statusColors[appt.status] || "bg-muted"}`}>
                              <p className="font-semibold truncate">{(appt as any).patient?.name ?? "Patient"}</p>
                              <p className="truncate">{appt.treatment_type || "—"}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 flex-wrap">
        {Object.entries(statusColors).map(([status, cls]) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${cls.split(" ")[0]}`} />
            <span className="text-xs capitalize">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
