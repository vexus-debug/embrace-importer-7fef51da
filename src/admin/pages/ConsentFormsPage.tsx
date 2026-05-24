import { useState } from "react";
import { useConsentForms, useCreateConsentForm } from "@/hooks/useConsentForms";
import { usePatients } from "@/hooks/usePatients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const formTypes = ["General Consent", "Treatment Consent", "Sedation Consent", "Surgery Consent", "Orthodontic Consent", "Extraction Consent"];

export default function ConsentFormsPage() {
  const { data: forms = [], isLoading } = useConsentForms();
  const { data: patients = [] } = usePatients();
  const createForm = useCreateConsentForm();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ patient_id: "", form_type: "", witness_name: "", notes: "" });

  const handleSave = async () => {
    if (!form.patient_id || !form.form_type) { toast({ title: "Patient and form type required", variant: "destructive" }); return; }
    try {
      await createForm.mutateAsync({
        patient_id: form.patient_id,
        form_type: form.form_type,
        witness_name: form.witness_name || undefined,
        signed_at: new Date().toISOString(),
        form_content: { notes: form.notes },
      });
      toast({ title: "Consent form created" }); setOpen(false);
      setForm({ patient_id: "", form_type: "", witness_name: "", notes: "" });
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Consent Forms</h1>
          <p className="text-sm text-muted-foreground">Digital consent form signing and tracking</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />New Consent Form</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Consent Form</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Patient</Label>
                <Select value={form.patient_id} onValueChange={v => setForm(f => ({ ...f, patient_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select></div>
              <div className="space-y-2"><Label>Form Type</Label>
                <Select value={form.form_type} onValueChange={v => setForm(f => ({ ...f, form_type: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>{formTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select></div>
              <div className="space-y-2"><Label>Witness Name</Label><Input placeholder="Witness name" value={form.witness_name} onChange={e => setForm(f => ({ ...f, witness_name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Additional notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={createForm.isPending}>{createForm.isPending ? "Saving..." : "Save & Sign"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div> : (
        <div className="space-y-4">
          {forms.length === 0 && <Card className="shadow-card"><CardContent className="py-12 text-center text-muted-foreground">No consent forms yet</CardContent></Card>}
          {forms.map(f => (
            <Card key={f.id} className="shadow-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-semibold">{(f as any).patient?.name ?? "Unknown"}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{f.form_type}</Badge>
                    {f.signed_at ? <Badge className="bg-primary/10 text-primary" variant="secondary">Signed</Badge> : <Badge variant="secondary">Unsigned</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {f.signed_at && <span>Signed: {new Date(f.signed_at).toLocaleDateString()}</span>}
                  {f.witness_name && <span>Witness: {f.witness_name}</span>}
                  <span>Created: {f.created_at.split("T")[0]}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
