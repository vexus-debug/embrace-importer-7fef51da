import { useMemo, useRef, useState } from "react";
import { useConsentForms, useCreateConsentForm } from "@/hooks/useConsentForms";
import { usePatients } from "@/hooks/usePatients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileCheck, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CONSENT_TEMPLATES, CONSENT_CATEGORIES, ConsentTemplate } from "@/admin/data/consentTemplates";
import { SignaturePad, SignaturePadHandle } from "@/admin/components/SignaturePad";

type Decision = "agree" | "disagree" | null;

export default function ConsentFormsPage() {
  const { data: forms = [], isLoading } = useConsentForms();
  const { data: patients = [] } = usePatients();
  const createForm = useCreateConsentForm();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [viewForm, setViewForm] = useState<any | null>(null);

  const [patientId, setPatientId] = useState("");
  const [witness, setWitness] = useState("");
  const [templateId, setTemplateId] = useState<string>(CONSENT_TEMPLATES[0].id);
  const template = useMemo(() => CONSENT_TEMPLATES.find(t => t.id === templateId)!, [templateId]);
  const [decisions, setDecisions] = useState<Record<number, Decision>>({});
  const sigRef = useRef<SignaturePadHandle>(null);

  const resetForm = () => {
    setPatientId(""); setWitness(""); setDecisions({});
    setTemplateId(CONSENT_TEMPLATES[0].id); sigRef.current?.clear();
  };

  const requiredIndexes = template.sections
    .map((s, i) => (s.requireAgree ? i : -1))
    .filter(i => i >= 0);
  const allRequiredAgreed = requiredIndexes.every(i => decisions[i] === "agree");
  const anyDisagreed = Object.values(decisions).some(d => d === "disagree");

  const handleSave = async () => {
    if (!patientId) { toast({ title: "Select a patient", variant: "destructive" }); return; }
    if (anyDisagreed) { toast({ title: "Cannot sign", description: "Patient has disagreed with at least one section.", variant: "destructive" }); return; }
    if (!allRequiredAgreed) { toast({ title: "All required sections must be agreed", variant: "destructive" }); return; }
    const sig = sigRef.current?.toDataURL();
    if (!sig) { toast({ title: "Signature required", variant: "destructive" }); return; }
    try {
      await createForm.mutateAsync({
        patient_id: patientId,
        form_type: template.title,
        witness_name: witness || undefined,
        signed_at: new Date().toISOString(),
        signature_data: sig,
        form_content: {
          template_id: template.id,
          category: template.category,
          decisions,
          sections: template.sections,
          closing: template.closing,
        },
      });
      toast({ title: "Consent form signed and saved to patient profile" });
      setOpen(false); resetForm();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const formsByCategory = useMemo(() => {
    const groups: Record<string, any[]> = { All: forms };
    forms.forEach(f => {
      const cat = (f.form_content as any)?.category ?? "Other";
      groups[cat] = groups[cat] || [];
      groups[cat].push(f);
    });
    return groups;
  }, [forms]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Consent Forms</h1>
          <p className="text-sm text-muted-foreground">Digital consent forms — agree, disagree, and sign</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />New Consent Form</Button></DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{template.title}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>Patient</Label>
                <Select value={patientId} onValueChange={setPatientId}>
                  <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Form Type</Label>
                <Select value={templateId} onValueChange={(v) => { setTemplateId(v); setDecisions({}); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CONSENT_TEMPLATES.map(t => <SelectItem key={t.id} value={t.id}>{t.category} — {t.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Witness Name</Label>
                <Input placeholder="Optional" value={witness} onChange={e => setWitness(e.target.value)} />
              </div>
            </div>

            <div className="border rounded-md p-4 bg-muted/20">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Please read each section carefully before signing</p>
              <div className="space-y-5">
                {template.sections.map((s, i) => (
                  <div key={i} className="space-y-2 pb-4 border-b last:border-0">
                    <h3 className="font-semibold text-sm">{s.heading}{s.requireAgree && <span className="text-destructive ml-1">*</span>}</h3>
                    {s.body && <p className="text-sm text-foreground/80 leading-relaxed">{s.body}</p>}
                    {s.bullets && (
                      <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-1">
                        {s.bullets.map((b, j) => <li key={j}>{b}</li>)}
                      </ul>
                    )}
                    <div className="flex gap-4 pt-1">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox checked={decisions[i] === "agree"} onCheckedChange={(c) => setDecisions(d => ({ ...d, [i]: c ? "agree" : null }))} />
                        I Agree
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox checked={decisions[i] === "disagree"} onCheckedChange={(c) => setDecisions(d => ({ ...d, [i]: c ? "disagree" : null }))} />
                        I Disagree
                      </label>
                    </div>
                  </div>
                ))}
                {template.closing && <p className="text-sm font-medium pt-2">{template.closing}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Patient Signature *</Label>
              <SignaturePad ref={sigRef} />
            </div>

            <div className="flex justify-end gap-2 sticky bottom-0 bg-background pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={createForm.isPending}>
                {createForm.isPending ? "Saving..." : "Sign & Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="All">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="All">All</TabsTrigger>
          {CONSENT_CATEGORIES.map(c => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}
        </TabsList>
        {["All", ...CONSENT_CATEGORIES].map(cat => (
          <TabsContent key={cat} value={cat} className="mt-4">
            {isLoading ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
            ) : (
              <div className="space-y-3">
                {(formsByCategory[cat] ?? []).length === 0 && (
                  <Card className="shadow-card"><CardContent className="py-10 text-center text-muted-foreground text-sm">No consent forms in this category</CardContent></Card>
                )}
                {(formsByCategory[cat] ?? []).map(f => (
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
                          <Button size="sm" variant="ghost" onClick={() => setViewForm(f)}><Eye className="h-4 w-4" /></Button>
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
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!viewForm} onOpenChange={(o) => !o && setViewForm(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          {viewForm && (
            <>
              <DialogHeader><DialogTitle>{viewForm.form_type}</DialogTitle></DialogHeader>
              <div className="text-xs text-muted-foreground mb-2">
                Patient: {viewForm.patient?.name ?? "Unknown"} · Signed: {viewForm.signed_at ? new Date(viewForm.signed_at).toLocaleString() : "—"}
                {viewForm.witness_name && ` · Witness: ${viewForm.witness_name}`}
              </div>
              <div className="space-y-4">
                {(viewForm.form_content?.sections ?? []).map((s: any, i: number) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{s.heading}</h4>
                      {viewForm.form_content?.decisions?.[i] && (
                        <Badge variant={viewForm.form_content.decisions[i] === "agree" ? "secondary" : "destructive"}>
                          {viewForm.form_content.decisions[i] === "agree" ? "Agreed" : "Disagreed"}
                        </Badge>
                      )}
                    </div>
                    {s.body && <p className="text-sm text-muted-foreground">{s.body}</p>}
                    {s.bullets && <ul className="list-disc pl-5 text-sm text-muted-foreground">{s.bullets.map((b: string, j: number) => <li key={j}>{b}</li>)}</ul>}
                  </div>
                ))}
                {viewForm.signature_data && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Signature</h4>
                    <img src={viewForm.signature_data} alt="Signature" className="border rounded-md bg-white max-h-48" />
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
