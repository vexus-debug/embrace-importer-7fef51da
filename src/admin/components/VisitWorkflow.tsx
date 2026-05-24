import { useState } from "react";
import { usePatients } from "@/hooks/usePatients";
import { useStaff } from "@/hooks/useStaff";
import { useCreateAppointment, useUpdateAppointment } from "@/hooks/useAppointments";
import { useCreateClinicalNote } from "@/hooks/useClinicalNotes";
import { useCreateInvoice } from "@/hooks/useInvoices";
import { useTreatments } from "@/hooks/useTreatments";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronRight, User, Stethoscope, FileText, Receipt, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface VisitWorkflowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillPatientId?: string;
  prefillAppointmentId?: string;
}

const STEPS = [
  { id: 1, label: "Patient", icon: User },
  { id: 2, label: "Diagnosis", icon: Stethoscope },
  { id: 3, label: "Notes", icon: FileText },
  { id: 4, label: "Invoice", icon: Receipt },
];

export default function VisitWorkflow({ open, onOpenChange, prefillPatientId, prefillAppointmentId }: VisitWorkflowProps) {
  const { data: patients = [] } = usePatients();
  const { data: staff = [] } = useStaff();
  const { data: treatments = [] } = useTreatments();
  const { user } = useAuth();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const createNote = useCreateClinicalNote();
  const createInvoice = useCreateInvoice();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [createdAppointmentId, setCreatedAppointmentId] = useState<string | null>(prefillAppointmentId || null);

  // Step 1: Patient & Appointment
  const [patientId, setPatientId] = useState(prefillPatientId || "");
  const [dentistId, setDentistId] = useState("");
  const [treatmentType, setTreatmentType] = useState("");
  const [chair, setChair] = useState("");
  const [apptNotes, setApptNotes] = useState("");

  // Step 2 & 3: Diagnosis / Clinical Note
  const [subjective, setSubjective] = useState("");
  const [objective, setObjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");

  // Step 4: Invoice
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [discount, setDiscount] = useState("0");

  const dentists = staff.filter(s => s.role === "dentist");
  const currentStaff = staff.find(s => s.user_id === user?.id);

  const resetAll = () => {
    setStep(1);
    setCreatedAppointmentId(null);
    setPatientId("");
    setDentistId("");
    setTreatmentType("");
    setChair("");
    setApptNotes("");
    setSubjective("");
    setObjective("");
    setAssessment("");
    setPlan("");
    setSelectedTreatments([]);
    setDiscount("0");
  };

  const handleStep1 = async () => {
    if (!patientId) { toast({ title: "Select a patient", variant: "destructive" }); return; }
    try {
      if (!prefillAppointmentId) {
        const today = new Date().toISOString().split("T")[0];
        const now = new Date().toTimeString().slice(0, 5);
        const result = await createAppointment.mutateAsync({
          patient_id: patientId,
          dentist_id: dentistId || currentStaff?.id || null,
          chair: chair || null,
          treatment_type: treatmentType || null,
          date: today,
          time: now,
          is_walk_in: true,
          notes: apptNotes || null,
          status: "scheduled",
        });
        setCreatedAppointmentId(result.id);
      }
      setStep(2);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleStep2 = () => setStep(3);

  const handleStep3 = async () => {
    try {
      await createNote.mutateAsync({
        patient_id: patientId,
        appointment_id: createdAppointmentId || undefined,
        dentist_id: currentStaff?.id || dentistId || undefined,
        subjective: subjective || undefined,
        objective: objective || undefined,
        assessment: assessment || undefined,
        plan: plan || undefined,
      });
      setStep(4);
    } catch (e: any) {
      toast({ title: "Error saving note", description: e.message, variant: "destructive" });
    }
  };

  const handleStep4 = async () => {
    try {
      const items = selectedTreatments.map(tid => {
        const t = treatments.find(tr => tr.id === tid);
        return { treatment: t?.name || "", price: Number(t?.price || 0), date: new Date().toISOString().split("T")[0] };
      });
      const total = items.reduce((s, i) => s + i.price, 0) - Number(discount || 0);
      const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
      await createInvoice.mutateAsync({
        patient_id: patientId,
        invoice_number: invoiceNumber,
        items: items as any,
        discount: Number(discount) || 0,
        total: Math.max(0, total),
        status: "pending",
      });
      // Mark appointment as completed
      if (createdAppointmentId) {
        await updateAppointment.mutateAsync({ id: createdAppointmentId, status: "completed" });
      }
      toast({ title: "Visit completed!", description: `Invoice ${invoiceNumber} generated` });
      resetAll();
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const skipInvoice = async () => {
    if (createdAppointmentId) {
      await updateAppointment.mutateAsync({ id: createdAppointmentId, status: "completed" });
    }
    toast({ title: "Visit completed!" });
    resetAll();
    onOpenChange(false);
  };

  const selectedPatient = patients.find(p => p.id === patientId);
  const invoiceTotal = selectedTreatments.reduce((s, tid) => {
    const t = treatments.find(tr => tr.id === tid);
    return s + Number(t?.price || 0);
  }, 0) - Number(discount || 0);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetAll(); onOpenChange(o); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {prefillAppointmentId ? "Continue Visit" : "Start New Visit"}
          </DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-4">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1 flex-1">
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1",
                step === s.id ? "bg-primary text-primary-foreground" :
                step > s.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {step > s.id ? <Check className="h-3.5 w-3.5" /> : <s.icon className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
            </div>
          ))}
        </div>

        {/* Step 1: Patient Selection */}
        {step === 1 && (
          <div className="space-y-4">
            {selectedPatient && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm font-medium">{selectedPatient.name}</p>
                <p className="text-xs text-muted-foreground">{selectedPatient.serial_number} • {selectedPatient.phone || "No phone"}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Select Patient</Label>
              <Select value={patientId} onValueChange={setPatientId}>
                <SelectTrigger><SelectValue placeholder="Search & select patient" /></SelectTrigger>
                <SelectContent>
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.serial_number ? `${p.serial_number} — ` : ""}{p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Dentist</Label>
                <Select value={dentistId} onValueChange={setDentistId}>
                  <SelectTrigger><SelectValue placeholder="Assign dentist" /></SelectTrigger>
                  <SelectContent>
                    {dentists.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Chair</Label>
                <Select value={chair} onValueChange={setChair}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["Chair 1", "Chair 2", "Chair 3", "Chair 4"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Treatment Type</Label>
              <Input placeholder="e.g. Cleaning, Root Canal" value={treatmentType} onChange={e => setTreatmentType(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Quick notes..." value={apptNotes} onChange={e => setApptNotes(e.target.value)} rows={2} />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleStep1} disabled={createAppointment.isPending}>
                {createAppointment.isPending ? "Creating..." : "Next: Diagnosis"} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Quick Diagnosis */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Quick diagnosis for <strong>{selectedPatient?.name}</strong></p>
            <div className="space-y-2">
              <Label>Chief Complaint (Subjective)</Label>
              <Textarea placeholder="Patient's main complaint..." value={subjective} onChange={e => setSubjective(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Examination Findings (Objective)</Label>
              <Textarea placeholder="Clinical findings..." value={objective} onChange={e => setObjective(e.target.value)} rows={2} />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
              <Button onClick={handleStep2}>Next: Notes <ChevronRight className="h-4 w-4 ml-1" /></Button>
            </div>
          </div>
        )}

        {/* Step 3: Assessment & Plan */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Assessment & plan for <strong>{selectedPatient?.name}</strong></p>
            <div className="space-y-2">
              <Label>Assessment / Diagnosis</Label>
              <Textarea placeholder="Your diagnosis..." value={assessment} onChange={e => setAssessment(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Treatment Plan</Label>
              <Textarea placeholder="Planned treatments, follow-up..." value={plan} onChange={e => setPlan(e.target.value)} rows={2} />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
              <Button onClick={handleStep3} disabled={createNote.isPending}>
                {createNote.isPending ? "Saving..." : "Next: Invoice"} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Generate Invoice */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Generate invoice for <strong>{selectedPatient?.name}</strong></p>
            <div className="space-y-2">
              <Label>Select Treatments</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {treatments.map(t => {
                  const selected = selectedTreatments.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTreatments(prev =>
                        selected ? prev.filter(id => id !== t.id) : [...prev, t.id]
                      )}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-lg border text-sm transition-all text-left",
                        selected ? "border-primary bg-primary/5 text-foreground" : "border-border hover:border-primary/40"
                      )}
                    >
                      <span className="truncate">{t.name}</span>
                      <Badge variant="secondary" className="ml-2 shrink-0">₦{Number(t.price).toLocaleString()}</Badge>
                    </button>
                  );
                })}
              </div>
              {treatments.length === 0 && <p className="text-xs text-muted-foreground">No treatments in catalog. Invoice will be empty.</p>}
            </div>
            <div className="space-y-2">
              <Label>Discount (₦)</Label>
              <Input type="number" value={discount} onChange={e => setDiscount(e.target.value)} />
            </div>
            <div className="p-3 rounded-lg bg-muted/50 flex justify-between items-center">
              <span className="text-sm font-medium">Total</span>
              <span className="text-lg font-bold text-primary">₦{Math.max(0, invoiceTotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={skipInvoice}>Skip Invoice</Button>
                <Button onClick={handleStep4} disabled={createInvoice.isPending || selectedTreatments.length === 0}>
                  {createInvoice.isPending ? "Generating..." : "Complete Visit"} <Check className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
