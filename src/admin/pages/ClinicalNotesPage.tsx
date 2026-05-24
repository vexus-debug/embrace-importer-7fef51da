import { useState, useMemo } from "react";
import { useClinicalNotes, useCreateClinicalNote } from "@/hooks/useClinicalNotes";
import { usePatients } from "@/hooks/usePatients";
import { useStaff } from "@/hooks/useStaff";
import { useToothRecords, useBulkUpsertToothRecords } from "@/hooks/useToothRecords";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const toothStatuses = [
  { value: "healthy", label: "Healthy", color: "bg-emerald-500", textColor: "text-emerald-700", bgLight: "bg-emerald-100" },
  { value: "decayed", label: "Decayed", color: "bg-amber-500", textColor: "text-amber-700", bgLight: "bg-amber-100" },
  { value: "treated", label: "Treated", color: "bg-blue-500", textColor: "text-blue-700", bgLight: "bg-blue-100" },
  { value: "missing", label: "Missing", color: "bg-red-500", textColor: "text-red-700", bgLight: "bg-red-100" },
];

const toothStatusColors: Record<string, string> = {
  healthy: "bg-emerald-100 text-emerald-700 border-emerald-300",
  decayed: "bg-amber-100 text-amber-700 border-amber-300",
  treated: "bg-blue-100 text-blue-700 border-blue-300",
  missing: "bg-red-100 text-red-700 border-red-300",
};

const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

export default function ClinicalNotesPage() {
  const { data: notes = [], isLoading } = useClinicalNotes();
  const { data: patients = [] } = usePatients();
  const { data: staff = [] } = useStaff();
  const { user } = useAuth();
  const createNote = useCreateClinicalNote();
  const bulkUpsert = useBulkUpsertToothRecords();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ patient_id: "", subjective: "", objective: "", assessment: "", plan: "" });

  // Find the staff record for the currently logged-in user
  const currentDentist = useMemo(() => {
    if (!user) return null;
    return staff.find(s => s.user_id === user.id) || null;
  }, [staff, user]);

  // Dental chart state
  const [chartPatientId, setChartPatientId] = useState<string>("");
  const [selectedBrush, setSelectedBrush] = useState<string>("healthy");
  const [toothEdits, setToothEdits] = useState<Record<number, string>>({});
  const [chartDirty, setChartDirty] = useState(false);

  const activeChartPatient = chartPatientId || "";
  const { data: toothRecords = [], isLoading: loadingRecords } = useToothRecords(activeChartPatient || undefined);

  const getToothStatus = (num: number) => {
    if (toothEdits[num]) return toothEdits[num];
    const record = toothRecords.find((r) => r.tooth_number === num);
    return record?.status || "healthy";
  };

  const handleToothClick = (num: number) => {
    setToothEdits(prev => ({ ...prev, [num]: selectedBrush }));
    setChartDirty(true);
  };

  const handleSaveChart = async () => {
    if (!activeChartPatient) {
      toast({ title: "Select a patient first", variant: "destructive" });
      return;
    }
    const changedTeeth = Object.entries(toothEdits).map(([num, status]) => ({
      tooth_number: parseInt(num),
      status,
    }));
    if (changedTeeth.length === 0) {
      toast({ title: "No changes to save" });
      return;
    }
    try {
      await bulkUpsert.mutateAsync({ patient_id: activeChartPatient, records: changedTeeth });
      toast({ title: `Saved ${changedTeeth.length} tooth record(s)` });
      setToothEdits({});
      setChartDirty(false);
    } catch (e: any) {
      toast({ title: "Error saving chart", description: e.message, variant: "destructive" });
    }
  };

  const handleSaveNote = async () => {
    if (!form.patient_id) { toast({ title: "Patient required", variant: "destructive" }); return; }
    try {
      await createNote.mutateAsync({
        patient_id: form.patient_id,
        dentist_id: currentDentist?.id || undefined,
        subjective: form.subjective || undefined,
        objective: form.objective || undefined,
        assessment: form.assessment || undefined,
        plan: form.plan || undefined,
      });
      toast({ title: "Clinical note added" }); setOpen(false);
      setForm({ patient_id: "", subjective: "", objective: "", assessment: "", plan: "" });
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  const ToothButton = ({ num }: { num: number }) => {
    const status = getToothStatus(num);
    const isEdited = num in toothEdits;
    return (
      <button
        onClick={() => handleToothClick(num)}
        title={`Tooth ${num} — ${status}`}
        className={`w-9 h-10 rounded text-xs font-semibold border-2 transition-all hover:scale-110 ${
          isEdited ? "ring-2 ring-primary/40 scale-105" : ""
        } ${toothStatusColors[status] || "bg-card border-border"}`}
      >
        {num}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Clinical Notes & Dental Chart</h1>
          <p className="text-sm text-muted-foreground">
            SOAP notes and interactive dental charting
            {currentDentist && <span className="ml-2">— Logged in as <strong>{currentDentist.name}</strong></span>}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add SOAP Note</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>New SOAP Note</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Patient</Label>
                  <Select value={form.patient_id} onValueChange={v => setForm(f => ({ ...f, patient_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                    <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                  </Select></div>
                <div className="space-y-2">
                  <Label>Dentist</Label>
                  <div className="h-10 px-3 flex items-center rounded-md border bg-muted/50 text-sm">
                    {currentDentist ? currentDentist.name : "Not linked to staff"}
                  </div>
                </div>
              </div>
              <div className="space-y-2"><Label>S — Subjective</Label><Textarea placeholder="Patient's symptoms and complaints..." value={form.subjective} onChange={e => setForm(f => ({ ...f, subjective: e.target.value }))} /></div>
              <div className="space-y-2"><Label>O — Objective</Label><Textarea placeholder="Clinical findings, examination results..." value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))} /></div>
              <div className="space-y-2"><Label>A — Assessment</Label><Textarea placeholder="Diagnosis and assessment..." value={form.assessment} onChange={e => setForm(f => ({ ...f, assessment: e.target.value }))} /></div>
              <div className="space-y-2"><Label>P — Plan</Label><Textarea placeholder="Treatment plan and follow-up..." value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))} /></div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveNote} disabled={createNote.isPending}>{createNote.isPending ? "Saving..." : "Save"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dental Chart Section */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">Interactive Dental Chart</CardTitle>
            <div className="flex items-center gap-3">
              <div className="w-56">
                <Select value={activeChartPatient} onValueChange={(v) => { setChartPatientId(v); setToothEdits({}); setChartDirty(false); }}>
                  <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {chartDirty && (
                <Button size="sm" onClick={handleSaveChart} disabled={bulkUpsert.isPending}>
                  <Save className="h-4 w-4 mr-1" />{bulkUpsert.isPending ? "Saving..." : "Save Chart"}
                </Button>
              )}
            </div>
          </div>
          {/* Brush selector */}
          <div className="flex gap-2 flex-wrap mt-3">
            <span className="text-xs text-muted-foreground self-center mr-1">Paint brush:</span>
            {toothStatuses.map((s) => (
              <button
                key={s.value}
                onClick={() => setSelectedBrush(s.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                  selectedBrush === s.value
                    ? `${s.bgLight} ${s.textColor} border-current ring-2 ring-current/20 scale-105`
                    : "bg-card border-border text-muted-foreground hover:border-current"
                }`}
              >
                <div className={`h-3 w-3 rounded-full ${s.color}`} />
                {s.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="py-6">
          {!activeChartPatient ? (
            <p className="text-sm text-muted-foreground text-center py-8">Select a patient above to view and edit their dental chart</p>
          ) : loadingRecords ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div>
                <p className="text-xs text-muted-foreground text-center mb-2">Upper Jaw (Right → Left)</p>
                <div className="flex gap-1 justify-center flex-wrap">{upperTeeth.map(n => <ToothButton key={n} num={n} />)}</div>
              </div>
              <div className="w-full border-t border-dashed border-border" />
              <div>
                <p className="text-xs text-muted-foreground text-center mb-2">Lower Jaw (Right → Left)</p>
                <div className="flex gap-1 justify-center flex-wrap">{lowerTeeth.map(n => <ToothButton key={n} num={n} />)}</div>
              </div>
              {Object.keys(toothEdits).length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {Object.keys(toothEdits).length} tooth/teeth modified — click <strong>Save Chart</strong> to persist
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clinical Notes List */}
      <div>
        <h2 className="text-lg font-heading font-semibold mb-3">SOAP Notes</h2>
        {isLoading ? <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div> : (
          <div className="space-y-4">
            {notes.length === 0 && <Card className="shadow-card"><CardContent className="py-12 text-center text-muted-foreground">No clinical notes yet</CardContent></Card>}
            {notes.map(note => (
              <Card key={note.id} className="shadow-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm font-semibold">{(note as any).patient?.name ?? "Unknown"}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{(note as any).dentist?.name ?? "—"}</span>
                      <Badge variant="outline">{note.created_at.split("T")[0]}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {note.subjective && <div className="p-3 rounded bg-muted/50"><p className="text-xs font-semibold text-primary mb-1">Subjective</p><p className="text-sm">{note.subjective}</p></div>}
                    {note.objective && <div className="p-3 rounded bg-muted/50"><p className="text-xs font-semibold text-primary mb-1">Objective</p><p className="text-sm">{note.objective}</p></div>}
                    {note.assessment && <div className="p-3 rounded bg-muted/50"><p className="text-xs font-semibold text-primary mb-1">Assessment</p><p className="text-sm">{note.assessment}</p></div>}
                    {note.plan && <div className="p-3 rounded bg-muted/50"><p className="text-xs font-semibold text-primary mb-1">Plan</p><p className="text-sm">{note.plan}</p></div>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
