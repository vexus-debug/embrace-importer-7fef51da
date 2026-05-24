import { useState } from "react";
import { useToothRecords } from "@/hooks/useToothRecords";
import { usePatients } from "@/hooks/usePatients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const toothStatusColors: Record<string, string> = {
  healthy: "bg-emerald-100 text-emerald-700",
  decayed: "bg-amber-100 text-amber-700",
  treated: "bg-blue-100 text-blue-700",
  missing: "bg-red-100 text-red-700",
};

const upperTeeth = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
const lowerTeeth = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];

export default function DentalChartsPage() {
  const { data: patients = [], isLoading: loadingPatients } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  const activePatient = selectedPatient || patients[0]?.id || "";
  const { data: toothRecords = [], isLoading: loadingRecords } = useToothRecords(activePatient || undefined);

  const getToothStatus = (num: number) => {
    const record = toothRecords.find((r) => r.tooth_number === num);
    return record?.status || "healthy";
  };

  const toothHistory = selectedTooth
    ? toothRecords.filter((r) => r.tooth_number === selectedTooth)
    : [];

  const ToothButton = ({ num }: { num: number }) => {
    const status = getToothStatus(num);
    const isSelected = selectedTooth === num;
    return (
      <button
        onClick={() => setSelectedTooth(num)}
        className={`w-9 h-10 rounded text-xs font-semibold border-2 transition-all ${
          isSelected ? "border-primary ring-2 ring-primary/30 scale-110" : "border-border"
        } ${toothStatusColors[status] || "bg-card"}`}
      >
        {num}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Dental Charts</h1>
        <p className="text-sm text-muted-foreground">Interactive tooth chart per patient</p>
      </div>

      <div className="w-64">
        {loadingPatients ? <Skeleton className="h-10 w-full" /> : (
          <Select value={activePatient} onValueChange={(v) => { setSelectedPatient(v); setSelectedTooth(null); }}>
            <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
            <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
          </Select>
        )}
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Tooth Chart — Adult (FDI Notation)</CardTitle>
          <div className="flex gap-3 flex-wrap mt-2">
            {Object.entries(toothStatusColors).map(([status, cls]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className={`h-3 w-3 rounded-sm ${cls.split(" ")[0]}`} />
                <span className="text-xs capitalize text-muted-foreground">{status}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="py-6">
          {loadingRecords ? <Skeleton className="h-32 w-full" /> : (
            <div className="flex flex-col items-center gap-4">
              <div>
                <p className="text-xs text-muted-foreground text-center mb-2">Upper Jaw</p>
                <div className="flex gap-1 justify-center flex-wrap">{upperTeeth.map(n => <ToothButton key={n} num={n} />)}</div>
              </div>
              <div className="w-full border-t border-dashed border-border" />
              <div>
                <p className="text-xs text-muted-foreground text-center mb-2">Lower Jaw</p>
                <div className="flex gap-1 justify-center flex-wrap">{lowerTeeth.map(n => <ToothButton key={n} num={n} />)}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTooth && (
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tooth #{selectedTooth} — History</CardTitle>
          </CardHeader>
          <CardContent>
            {toothHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No records for this tooth. Status: <Badge variant="secondary" className={toothStatusColors.healthy}>healthy</Badge></p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead><TableHead>Procedure</TableHead><TableHead>Status</TableHead>
                    <TableHead>Dentist</TableHead><TableHead className="hidden md:table-cell">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {toothHistory.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-sm">{r.date}</TableCell>
                      <TableCell className="text-sm font-medium">{r.procedure}</TableCell>
                      <TableCell><Badge variant="secondary" className={toothStatusColors[r.status]}>{r.status}</Badge></TableCell>
                      <TableCell className="text-sm">{r.dentist?.name ?? "—"}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{r.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
