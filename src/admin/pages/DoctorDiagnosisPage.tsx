import { useState, useEffect, useCallback } from "react";
import { usePatients } from "@/hooks/usePatients";
import { usePatientTreatmentPlans } from "@/hooks/useTreatments";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronRight, Stethoscope, Save, Clock, Upload, X, FileImage, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DiagnosisForm {
  patient_id: string;
  hpc: string;
  pmh_chronic: string[];
  pmh_surgeries: string;
  pmh_allergies: string;
  pmh_medications: string;
  pmh_other: string;
  past_dental: string;
  family_history: string;
  smoking: string;
  alcohol: string;
  occupation: string;
  lifestyle_notes: string;
  ge_appearance: string;
  ge_vitals_bp: string;
  ge_vitals_pulse: string;
  ge_vitals_temp: string;
  ge_abnormalities: string;
  eoe_facial_symmetry: string;
  eoe_jaw_movement: string;
  eoe_lymph_nodes: string;
  eoe_swelling: string;
  eoe_tmj: string;
  eoe_notes: string;
  io_teeth: string;
  io_gingiva: string;
  io_tongue: string;
  io_palate: string;
  io_mucosa: string;
  io_caries: string;
  io_occlusion: string;
  io_notes: string;
  investigations_notes: string;
  primary_diagnosis: string;
  secondary_diagnosis: string;
  diagnosis_notes: string;
  tx_procedures: string;
  tx_medications: string;
  tx_followup_date: string;
  tx_instructions: string;
  tx_notes: string;
}

const defaultForm: DiagnosisForm = {
  patient_id: "", hpc: "",
  pmh_chronic: [], pmh_surgeries: "", pmh_allergies: "", pmh_medications: "", pmh_other: "",
  past_dental: "",
  family_history: "", smoking: "No", alcohol: "No", occupation: "", lifestyle_notes: "",
  ge_appearance: "", ge_vitals_bp: "", ge_vitals_pulse: "", ge_vitals_temp: "", ge_abnormalities: "",
  eoe_facial_symmetry: "Symmetrical", eoe_jaw_movement: "Normal", eoe_lymph_nodes: "Not palpable",
  eoe_swelling: "None", eoe_tmj: "Normal", eoe_notes: "",
  io_teeth: "", io_gingiva: "", io_tongue: "", io_palate: "", io_mucosa: "", io_caries: "", io_occlusion: "", io_notes: "",
  investigations_notes: "",
  primary_diagnosis: "", secondary_diagnosis: "", diagnosis_notes: "",
  tx_procedures: "", tx_medications: "", tx_followup_date: "", tx_instructions: "", tx_notes: "",
};

const chronicConditions = [
  "Diabetes", "Hypertension", "Heart Disease", "Asthma", "Epilepsy",
  "Hepatitis", "HIV/AIDS", "Kidney Disease", "Thyroid Disorder", "Bleeding Disorder",
];

function CollapsibleSection({ title, number, children, defaultOpen = false }: {
  title: string; number: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="shadow-sm border-border/60">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs font-mono px-2 py-0.5 bg-primary/10 text-primary border-primary/20">{number}</Badge>
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
              </div>
              {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-5">{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export default function DoctorDiagnosisPage() {
  const { data: patients = [] } = usePatients();
  const { toast } = useToast();
  const [form, setForm] = useState<DiagnosisForm>(defaultForm);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; label: string; notes: string; preview?: string; uploading?: boolean; url?: string }[]>([]);

  const { data: patientPlans = [] } = usePatientTreatmentPlans(form.patient_id || undefined);

  const set = useCallback((key: keyof DiagnosisForm, val: any) => {
    setForm(f => ({ ...f, [key]: val }));
  }, []);

  // Auto-save draft every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      if (form.patient_id) {
        localStorage.setItem(`diagnosis_draft_${form.patient_id}`, JSON.stringify(form));
        setLastSaved(new Date().toLocaleTimeString());
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [form]);

  // Load draft when patient changes + auto-fill treatment plan from saved plans
  useEffect(() => {
    if (form.patient_id) {
      const draft = localStorage.getItem(`diagnosis_draft_${form.patient_id}`);
      if (draft) {
        const parsed = JSON.parse(draft);
        setForm(parsed);
        toast({ title: "Draft loaded", description: "Previous unsaved diagnosis loaded" });
      }
    }
  }, [form.patient_id]);

  // Auto-fill treatment plan from patient's latest treatment plan
  useEffect(() => {
    if (patientPlans.length > 0 && form.patient_id) {
      const latestPlan = patientPlans[0];
      const procedures = (latestPlan.procedures as any[] | null) || [];
      const procText = procedures.map((p: any) => `${p.treatmentName} (₦${p.cost}) — ${p.status}`).join("\n");
      const totalCost = latestPlan.total_cost || 0;
      
      // Only auto-fill if tx_procedures is empty (don't overwrite manual edits)
      setForm(f => {
        if (!f.tx_procedures) {
          return { ...f, tx_procedures: procText ? `Treatment Plan (₦${Number(totalCost).toLocaleString()} total):\n${procText}` : f.tx_procedures };
        }
        return f;
      });
    }
  }, [patientPlans, form.patient_id]);

  const handleSaveDraft = () => {
    if (!form.patient_id) { toast({ title: "Select a patient first", variant: "destructive" }); return; }
    localStorage.setItem(`diagnosis_draft_${form.patient_id}`, JSON.stringify(form));
    setLastSaved(new Date().toLocaleTimeString());
    toast({ title: "Draft saved" });
  };

  const handleSubmit = async () => {
    if (!form.patient_id) { toast({ title: "Select a patient first", variant: "destructive" }); return; }
    if (!form.primary_diagnosis) { toast({ title: "Impression is required", variant: "destructive" }); return; }

    const { error } = await supabase.from("diagnoses").insert({
      patient_id: form.patient_id,
      hpc: form.hpc || null,
      pmh_chronic: form.pmh_chronic,
      pmh_surgeries: form.pmh_surgeries || null,
      pmh_allergies: form.pmh_allergies || null,
      pmh_medications: form.pmh_medications || null,
      pmh_other: form.pmh_other || null,
      past_dental: form.past_dental || null,
      family_history: form.family_history || null,
      smoking: form.smoking,
      alcohol: form.alcohol,
      occupation: form.occupation || null,
      lifestyle_notes: form.lifestyle_notes || null,
      ge_appearance: form.ge_appearance || null,
      ge_vitals_bp: form.ge_vitals_bp || null,
      ge_vitals_pulse: form.ge_vitals_pulse || null,
      ge_vitals_temp: form.ge_vitals_temp || null,
      ge_abnormalities: form.ge_abnormalities || null,
      eoe_facial_symmetry: form.eoe_facial_symmetry,
      eoe_jaw_movement: form.eoe_jaw_movement,
      eoe_lymph_nodes: form.eoe_lymph_nodes,
      eoe_swelling: form.eoe_swelling,
      eoe_tmj: form.eoe_tmj,
      eoe_notes: form.eoe_notes || null,
      io_teeth: form.io_teeth || null,
      io_gingiva: form.io_gingiva || null,
      io_tongue: form.io_tongue || null,
      io_palate: form.io_palate || null,
      io_mucosa: form.io_mucosa || null,
      io_caries: form.io_caries || null,
      io_occlusion: form.io_occlusion || null,
      io_notes: form.io_notes || null,
      investigations_notes: form.investigations_notes || null,
      primary_diagnosis: form.primary_diagnosis,
      secondary_diagnosis: form.secondary_diagnosis || null,
      diagnosis_notes: form.diagnosis_notes || null,
      tx_procedures: form.tx_procedures || null,
      tx_medications: form.tx_medications || null,
      tx_followup_date: form.tx_followup_date || null,
      tx_instructions: form.tx_instructions || null,
      tx_notes: form.tx_notes || null,
    });

    if (error) {
      toast({ title: "Error saving diagnosis", description: error.message, variant: "destructive" });
    } else {
      // Save uploaded file references to patient_images table
      for (const file of uploadedFiles) {
        if (file.url) {
          await supabase.from("patient_images").insert({
            patient_id: form.patient_id,
            image_url: file.url,
            image_type: file.label,
            notes: file.notes || null,
          });
        }
      }
      localStorage.removeItem(`diagnosis_draft_${form.patient_id}`);
      setForm(defaultForm);
      setUploadedFiles([]);
      setLastSaved(null);
      toast({ title: "Diagnosis submitted", description: "Record saved successfully" });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !form.patient_id) {
      if (!form.patient_id) toast({ title: "Select a patient first", variant: "destructive" });
      return;
    }

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const filePath = `${form.patient_id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      // Add placeholder entry
      const tempIndex = uploadedFiles.length;
      setUploadedFiles(prev => [...prev, { name: file.name, label: "X-ray", notes: "", uploading: true }]);

      const { error } = await supabase.storage.from("patient-images").upload(filePath, file);

      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        setUploadedFiles(prev => prev.filter((_, i) => i !== prev.length - 1));
        continue;
      }

      const { data: signedData } = await supabase.storage.from("patient-images").createSignedUrl(filePath, 3600);
      const previewUrl = signedData?.signedUrl;

      setUploadedFiles(prev =>
        prev.map((f, i) =>
          i === tempIndex ? { ...f, uploading: false, url: filePath, preview: file.type.startsWith("image/") ? previewUrl : undefined } : f
        )
      );
    }
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleChronic = (condition: string) => {
    setForm(f => ({
      ...f,
      pmh_chronic: f.pmh_chronic.includes(condition)
        ? f.pmh_chronic.filter(c => c !== condition)
        : [...f.pmh_chronic, condition],
    }));
  };

  const selectedPatient = patients.find(p => p.id === form.patient_id);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Stethoscope className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-heading font-bold">Doctor Diagnosis</h1>
            <p className="text-sm text-muted-foreground">Record structured diagnostic notes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Last saved: {lastSaved}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleSaveDraft}><Save className="h-4 w-4 mr-1" />Save Draft</Button>
        </div>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="space-y-2 flex-1 w-full">
              <Label className="font-semibold">Select Patient</Label>
              <Select value={form.patient_id} onValueChange={v => set("patient_id", v)}>
                <SelectTrigger><SelectValue placeholder="Choose a patient..." /></SelectTrigger>
                <SelectContent>
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {(p as any).serial_number ? `${(p as any).serial_number} — ` : ""}{p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedPatient && (
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p><strong>DOB:</strong> {selectedPatient.dob || "N/A"}</p>
                <p><strong>Gender:</strong> {selectedPatient.gender || "N/A"}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 1. HPC */}
      <CollapsibleSection title="History of Presenting Complaint (HPC)" number="1" defaultOpen>
        <Textarea
          className="min-h-[140px]"
          placeholder="Record the patient's main complaint, onset, duration, progression, severity, triggers, relieving factors, and any previous treatment..."
          value={form.hpc}
          onChange={e => set("hpc", e.target.value)}
        />
      </CollapsibleSection>

      {/* 2. PMH */}
      <CollapsibleSection title="Past Medical History (PMH)" number="2">
        <div className="space-y-4">
          <div>
            <Label className="font-semibold mb-2 block">Chronic Illnesses</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {chronicConditions.map(c => (
                <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={form.pmh_chronic.includes(c)} onCheckedChange={() => toggleChronic(c)} />
                  {c}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2"><Label>Previous Surgeries / Hospitalizations</Label><Textarea placeholder="Details..." value={form.pmh_surgeries} onChange={e => set("pmh_surgeries", e.target.value)} /></div>
          <div className="space-y-2"><Label>Allergies</Label><Input placeholder="Known allergies..." value={form.pmh_allergies} onChange={e => set("pmh_allergies", e.target.value)} /></div>
          <div className="space-y-2"><Label>Current Medications</Label><Textarea placeholder="List current medications..." value={form.pmh_medications} onChange={e => set("pmh_medications", e.target.value)} /></div>
          <div className="space-y-2"><Label>Other Relevant Conditions</Label><Input value={form.pmh_other} onChange={e => set("pmh_other", e.target.value)} /></div>
        </div>
      </CollapsibleSection>

      {/* 3. Past Dental History */}
      <CollapsibleSection title="Past Dental History" number="3">
        <Textarea
          className="min-h-[120px]"
          placeholder="Document previous dental treatments, oral hygiene habits, trauma history, and past complications..."
          value={form.past_dental}
          onChange={e => set("past_dental", e.target.value)}
        />
      </CollapsibleSection>

      {/* 4. Family and Social History */}
      <CollapsibleSection title="Family and Social History" number="4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2"><Label>Family Disease History</Label><Textarea placeholder="Relevant family medical history..." value={form.family_history} onChange={e => set("family_history", e.target.value)} /></div>
          <div className="space-y-2"><Label>Smoking</Label>
            <Select value={form.smoking} onValueChange={v => set("smoking", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="No">No</SelectItem><SelectItem value="Yes - Current">Yes - Current</SelectItem><SelectItem value="Yes - Former">Yes - Former</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Alcohol Use</Label>
            <Select value={form.alcohol} onValueChange={v => set("alcohol", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="No">No</SelectItem><SelectItem value="Occasional">Occasional</SelectItem><SelectItem value="Regular">Regular</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Occupation</Label><Input value={form.occupation} onChange={e => set("occupation", e.target.value)} /></div>
          <div className="space-y-2"><Label>Lifestyle Risk Factors</Label><Input placeholder="e.g. sedentary, high stress" value={form.lifestyle_notes} onChange={e => set("lifestyle_notes", e.target.value)} /></div>
        </div>
      </CollapsibleSection>

      {/* 5. General Examination */}
      <CollapsibleSection title="General Examination (GE)" number="5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2"><Label>General Appearance</Label><Input placeholder="Alert, oriented, well-nourished..." value={form.ge_appearance} onChange={e => set("ge_appearance", e.target.value)} /></div>
          <div className="space-y-2"><Label>Blood Pressure</Label><Input placeholder="e.g. 120/80 mmHg" value={form.ge_vitals_bp} onChange={e => set("ge_vitals_bp", e.target.value)} /></div>
          <div className="space-y-2"><Label>Pulse</Label><Input placeholder="e.g. 72 bpm" value={form.ge_vitals_pulse} onChange={e => set("ge_vitals_pulse", e.target.value)} /></div>
          <div className="space-y-2"><Label>Temperature</Label><Input placeholder="e.g. 37.0°C" value={form.ge_vitals_temp} onChange={e => set("ge_vitals_temp", e.target.value)} /></div>
          <div className="space-y-2"><Label>Observable Abnormalities</Label><Input value={form.ge_abnormalities} onChange={e => set("ge_abnormalities", e.target.value)} /></div>
        </div>
      </CollapsibleSection>

      {/* 6. Extra Oral Examination */}
      <CollapsibleSection title="Extra Oral Examination (EOE)" number="6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Facial Symmetry</Label>
            <Select value={form.eoe_facial_symmetry} onValueChange={v => set("eoe_facial_symmetry", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Symmetrical">Symmetrical</SelectItem><SelectItem value="Asymmetrical">Asymmetrical</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Jaw Movement</Label>
            <Select value={form.eoe_jaw_movement} onValueChange={v => set("eoe_jaw_movement", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Normal">Normal</SelectItem><SelectItem value="Restricted">Restricted</SelectItem><SelectItem value="Deviation">Deviation</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Lymph Nodes</Label>
            <Select value={form.eoe_lymph_nodes} onValueChange={v => set("eoe_lymph_nodes", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Not palpable">Not palpable</SelectItem><SelectItem value="Palpable - Non-tender">Palpable - Non-tender</SelectItem><SelectItem value="Palpable - Tender">Palpable - Tender</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Swelling / Tenderness</Label>
            <Select value={form.eoe_swelling} onValueChange={v => set("eoe_swelling", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="None">None</SelectItem><SelectItem value="Present - Localized">Present - Localized</SelectItem><SelectItem value="Present - Diffuse">Present - Diffuse</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>TMJ Assessment</Label>
            <Select value={form.eoe_tmj} onValueChange={v => set("eoe_tmj", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Normal">Normal</SelectItem><SelectItem value="Click">Click</SelectItem><SelectItem value="Crepitus">Crepitus</SelectItem><SelectItem value="Pain">Pain</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Additional Notes</Label><Input value={form.eoe_notes} onChange={e => set("eoe_notes", e.target.value)} /></div>
        </div>
      </CollapsibleSection>

      {/* 7. Intra Oral Examination */}
      <CollapsibleSection title="Intra Oral Examination" number="7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Teeth Condition</Label><Input placeholder="General teeth condition" value={form.io_teeth} onChange={e => set("io_teeth", e.target.value)} /></div>
          <div className="space-y-2"><Label>Gingiva</Label><Input placeholder="Gingival condition" value={form.io_gingiva} onChange={e => set("io_gingiva", e.target.value)} /></div>
          <div className="space-y-2"><Label>Tongue</Label><Input placeholder="Tongue appearance" value={form.io_tongue} onChange={e => set("io_tongue", e.target.value)} /></div>
          <div className="space-y-2"><Label>Palate</Label><Input placeholder="Palate examination" value={form.io_palate} onChange={e => set("io_palate", e.target.value)} /></div>
          <div className="space-y-2"><Label>Mucosa</Label><Input placeholder="Mucosal condition" value={form.io_mucosa} onChange={e => set("io_mucosa", e.target.value)} /></div>
          <div className="space-y-2"><Label>Caries / Lesions</Label><Input placeholder="Any caries or lesions noted" value={form.io_caries} onChange={e => set("io_caries", e.target.value)} /></div>
          <div className="space-y-2"><Label>Occlusion</Label><Input placeholder="Occlusion type/class" value={form.io_occlusion} onChange={e => set("io_occlusion", e.target.value)} /></div>
          <div className="space-y-2"><Label>Additional Notes</Label><Input value={form.io_notes} onChange={e => set("io_notes", e.target.value)} /></div>
        </div>
      </CollapsibleSection>

      {/* 8. Investigations */}
      <CollapsibleSection title="Investigations" number="8">
        <div className="space-y-4">
          <div>
            <Label className="font-semibold mb-2 block">Upload Files</Label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-muted/30 transition-colors">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload X-rays, scans, photos, lab results</span>
              <input type="file" multiple accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              {uploadedFiles.map((file, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20">
                  {file.preview ? (
                    <img src={file.preview} alt={file.name} className="h-16 w-16 object-cover rounded border" />
                  ) : (
                    <div className="h-16 w-16 flex items-center justify-center bg-muted rounded border"><FileImage className="h-6 w-6 text-muted-foreground" /></div>
                  )}
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">{file.name} {file.uploading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}</p>
                    <Select value={file.label} onValueChange={v => setUploadedFiles(prev => prev.map((f, idx) => idx === i ? { ...f, label: v } : f))}>
                      <SelectTrigger className="h-8 w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["X-ray","CT Scan","Photo","Lab Result","Other"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Notes for this file..." className="h-8 text-sm" value={file.notes} onChange={e => setUploadedFiles(prev => prev.map((f, idx) => idx === i ? { ...f, notes: e.target.value } : f))} />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeFile(i)}><X className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-2"><Label>Investigation Notes</Label><Textarea placeholder="Additional notes about investigations..." value={form.investigations_notes} onChange={e => set("investigations_notes", e.target.value)} /></div>
        </div>
      </CollapsibleSection>

      {/* 9. Diagnosis */}
      <CollapsibleSection title="Diagnosis" number="9">
        <div className="space-y-4">
          <div className="space-y-2"><Label className="font-semibold">Impression</Label><Input placeholder="Clinical impression..." value={form.primary_diagnosis} onChange={e => set("primary_diagnosis", e.target.value)} /></div>
          <div className="space-y-2"><Label>Definite Diagnosis</Label><Input placeholder="Definite diagnosis..." value={form.secondary_diagnosis} onChange={e => set("secondary_diagnosis", e.target.value)} /></div>
          <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Clinical reasoning and conclusions..." value={form.diagnosis_notes} onChange={e => set("diagnosis_notes", e.target.value)} /></div>
        </div>
      </CollapsibleSection>

      {/* 10. Treatment Plan */}
      <CollapsibleSection title="Treatment Plan" number="10">
        <div className="space-y-4">
          <div className="space-y-2"><Label>Recommended Procedures</Label><Textarea placeholder="List recommended dental/medical procedures..." value={form.tx_procedures} onChange={e => set("tx_procedures", e.target.value)} /></div>
          <div className="space-y-2"><Label>Medications</Label><Textarea placeholder="Prescribed medications with dosage..." value={form.tx_medications} onChange={e => set("tx_medications", e.target.value)} /></div>
          <div className="space-y-2 max-w-xs"><Label>Follow-up Date</Label><Input type="date" value={form.tx_followup_date} onChange={e => set("tx_followup_date", e.target.value)} /></div>
          <div className="space-y-2"><Label>Patient Instructions</Label><Textarea placeholder="Post-visit instructions for the patient..." value={form.tx_instructions} onChange={e => set("tx_instructions", e.target.value)} /></div>
          <div className="space-y-2"><Label>Additional Notes</Label><Textarea placeholder="Any other treatment notes..." value={form.tx_notes} onChange={e => set("tx_notes", e.target.value)} /></div>
        </div>
      </CollapsibleSection>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 pb-6">
        <Button variant="outline" onClick={handleSaveDraft}><Save className="h-4 w-4 mr-1" />Save Draft</Button>
        <Button onClick={handleSubmit}>
          Submit Diagnosis
        </Button>
      </div>
    </div>
  );
}
