import { useState } from "react";
import { useTreatments, useCreateTreatment, useDeleteTreatment, useTreatmentPlans, usePrescriptions, useCreateTreatmentPlan, useCreatePrescription } from "@/hooks/useTreatments";
import { useCreateInvoice } from "@/hooks/useInvoices";
import { usePatients } from "@/hooks/usePatients";
import { useStaff } from "@/hooks/useStaff";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Procedure { treatmentId?: string; treatmentName: string; status: string; cost: number }
interface Medication { name: string; dosage: string; frequency: string; duration: string }

export default function TreatmentsPage() {
  const { data: treatments = [], isLoading: loadingTreatments } = useTreatments();
  const { data: plans = [], isLoading: loadingPlans } = useTreatmentPlans();
  const { data: prescriptions = [], isLoading: loadingRx } = usePrescriptions();
  const { data: patients = [] } = usePatients();
  const { data: staff = [] } = useStaff();
  const createTreatment = useCreateTreatment();
  const createInvoice = useCreateInvoice();
  const deleteTreatment = useDeleteTreatment();
  const createPlan = useCreateTreatmentPlan();
  const createPrescription = useCreatePrescription();
  const { toast } = useToast();

  const dentists = staff.filter(s => s.role === "dentist");

  const [tab, setTab] = useState("catalog");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", price: "", duration: "", patient_id: "" });

  // Treatment Plan dialog
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [planForm, setPlanForm] = useState({ patient_id: "", procedures: [{ treatmentName: "", status: "pending", cost: 0 }] as Procedure[] });

  // Prescription dialog
  const [rxDialogOpen, setRxDialogOpen] = useState(false);
  const [rxForm, setRxForm] = useState({ patient_id: "", dentist_id: "", notes: "", medications: [{ name: "", dosage: "", frequency: "", duration: "" }] as Medication[] });

  const handleSave = async () => {
    if (!form.name) { toast({ title: "Name is required", variant: "destructive" }); return; }
    try {
      await createTreatment.mutateAsync({
        name: form.name,
        category: form.category || null,
        price: Number(form.price) || 0,
        duration: Number(form.duration) || 30,
      });

      // Auto-generate invoice if a patient is selected
      if (form.patient_id) {
        const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
        const price = Number(form.price) || 0;
        await createInvoice.mutateAsync({
          patient_id: form.patient_id,
          invoice_number: invoiceNumber,
          items: [{ date: new Date().toISOString().split("T")[0], treatment: form.name, price }] as any,
          discount: 0,
          total: price,
          status: "pending",
        });
        toast({ title: "Treatment added & invoice generated", description: invoiceNumber });
      } else {
        toast({ title: "Treatment added" });
      }

      setDialogOpen(false);
      setForm({ name: "", category: "", price: "", duration: "", patient_id: "" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleSavePlan = async () => {
    if (!planForm.patient_id) { toast({ title: "Patient is required", variant: "destructive" }); return; }
    const validProcs = planForm.procedures.filter(p => p.treatmentName);
    if (validProcs.length === 0) { toast({ title: "Add at least one procedure", variant: "destructive" }); return; }
    const totalCost = validProcs.reduce((s, p) => s + (p.cost || 0), 0);
    try {
      await createPlan.mutateAsync({
        patient_id: planForm.patient_id,
        procedures: validProcs as any,
        total_cost: totalCost,
      });
      toast({ title: "Treatment plan created" });
      setPlanDialogOpen(false);
      setPlanForm({ patient_id: "", procedures: [{ treatmentName: "", status: "pending", cost: 0 }] });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleSaveRx = async () => {
    if (!rxForm.patient_id) { toast({ title: "Patient is required", variant: "destructive" }); return; }
    const validMeds = rxForm.medications.filter(m => m.name);
    if (validMeds.length === 0) { toast({ title: "Add at least one medication", variant: "destructive" }); return; }
    try {
      await createPrescription.mutateAsync({
        patient_id: rxForm.patient_id,
        dentist_id: rxForm.dentist_id || null,
        notes: rxForm.notes || null,
        medications: validMeds as any,
      });
      toast({ title: "Prescription created" });
      setRxDialogOpen(false);
      setRxForm({ patient_id: "", dentist_id: "", notes: "", medications: [{ name: "", dosage: "", frequency: "", duration: "" }] });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const addProcedureRow = () => setPlanForm(f => ({ ...f, procedures: [...f.procedures, { treatmentName: "", status: "pending", cost: 0 }] }));
  const removeProcedureRow = (i: number) => setPlanForm(f => ({ ...f, procedures: f.procedures.filter((_, idx) => idx !== i) }));
  const updateProcedure = (i: number, key: keyof Procedure, val: any) => setPlanForm(f => ({ ...f, procedures: f.procedures.map((p, idx) => idx === i ? { ...p, [key]: val } : p) }));

  const addMedRow = () => setRxForm(f => ({ ...f, medications: [...f.medications, { name: "", dosage: "", frequency: "", duration: "" }] }));
  const removeMedRow = (i: number) => setRxForm(f => ({ ...f, medications: f.medications.filter((_, idx) => idx !== i) }));
  const updateMed = (i: number, key: keyof Medication, val: string) => setRxForm(f => ({ ...f, medications: f.medications.map((m, idx) => idx === i ? { ...m, [key]: val } : m) }));

  const isLoading = loadingTreatments || loadingPlans || loadingRx;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Treatments & Prescriptions</h1>
          <p className="text-sm text-muted-foreground">Manage treatment catalog, plans, and prescriptions</p>
        </div>
        <div className="flex gap-2">
          {tab === "catalog" && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Treatment</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Treatment</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Patient <span className="text-muted-foreground text-xs">(optional — auto-generates invoice)</span></Label>
                    <Select value={form.patient_id} onValueChange={v => setForm(f => ({ ...f, patient_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                      <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{p.serial_number ? `${p.serial_number} — ` : ""}{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Name</Label><Input placeholder="Treatment name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Category</Label>
                    <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{["Preventive","Cosmetic","Restorative","Orthodontics","Oral Surgery","Prosthodontics"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Price (₦)</Label><Input type="number" placeholder="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
                    <div className="space-y-2"><Label>Duration (min)</Label><Input type="number" placeholder="30" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} /></div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave} disabled={createTreatment.isPending}>{createTreatment.isPending ? "Saving..." : "Save"}</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {tab === "plans" && (
            <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
              <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Plan</Button></DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader><DialogTitle>New Treatment Plan</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Patient</Label>
                    <Select value={planForm.patient_id} onValueChange={v => setPlanForm(f => ({ ...f, patient_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                      <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{(p as any).serial_number ? `${(p as any).serial_number} — ` : ""}{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label>Procedures</Label>
                    {planForm.procedures.map((proc, i) => (
                      <div key={i} className="flex gap-2 items-end">
                        <div className="flex-1 space-y-1">
                          <Input placeholder="Procedure name" value={proc.treatmentName} onChange={e => updateProcedure(i, "treatmentName", e.target.value)} />
                        </div>
                        <div className="w-28 space-y-1">
                          <Input type="number" placeholder="Cost" value={proc.cost || ""} onChange={e => updateProcedure(i, "cost", Number(e.target.value))} />
                        </div>
                        <div className="w-28 space-y-1">
                          <Select value={proc.status} onValueChange={v => updateProcedure(i, "status", v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {planForm.procedures.length > 1 && (
                          <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0" onClick={() => removeProcedureRow(i)}><X className="h-4 w-4" /></Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addProcedureRow}><Plus className="h-3 w-3 mr-1" />Add Procedure</Button>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSavePlan} disabled={createPlan.isPending}>{createPlan.isPending ? "Saving..." : "Save Plan"}</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {tab === "prescriptions" && (
            <Dialog open={rxDialogOpen} onOpenChange={setRxDialogOpen}>
              <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Prescription</Button></DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader><DialogTitle>New Prescription</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Patient</Label>
                      <Select value={rxForm.patient_id} onValueChange={v => setRxForm(f => ({ ...f, patient_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                        <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{(p as any).serial_number ? `${(p as any).serial_number} — ` : ""}{p.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Dentist</Label>
                      <Select value={rxForm.dentist_id} onValueChange={v => setRxForm(f => ({ ...f, dentist_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select dentist" /></SelectTrigger>
                        <SelectContent>{dentists.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Medications</Label>
                    {rxForm.medications.map((med, i) => (
                      <div key={i} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-end">
                        <Input placeholder="Medication name" value={med.name} onChange={e => updateMed(i, "name", e.target.value)} />
                        <Input placeholder="Dosage" className="w-24" value={med.dosage} onChange={e => updateMed(i, "dosage", e.target.value)} />
                        <Input placeholder="Frequency" className="w-24" value={med.frequency} onChange={e => updateMed(i, "frequency", e.target.value)} />
                        <Input placeholder="Duration" className="w-24" value={med.duration} onChange={e => updateMed(i, "duration", e.target.value)} />
                        {rxForm.medications.length > 1 && (
                          <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0" onClick={() => removeMedRow(i)}><X className="h-4 w-4" /></Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addMedRow}><Plus className="h-3 w-3 mr-1" />Add Medication</Button>
                  </div>
                  <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Additional notes..." value={rxForm.notes} onChange={e => setRxForm(f => ({ ...f, notes: e.target.value }))} /></div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setRxDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveRx} disabled={createPrescription.isPending}>{createPrescription.isPending ? "Saving..." : "Save Prescription"}</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="catalog">Treatment Catalog</TabsTrigger>
                <TabsTrigger value="plans">Treatment Plans</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
              </TabsList>

              <TabsContent value="catalog" className="mt-4">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead>
                    <TableHead className="hidden md:table-cell">Duration</TableHead><TableHead className="w-12" />
                  </TableRow></TableHeader>
                  <TableBody>
                    {treatments.map(t => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.name}</TableCell>
                        <TableCell><Badge variant="outline">{t.category}</Badge></TableCell>
                        <TableCell>₦{Number(t.price).toLocaleString()}</TableCell>
                        <TableCell className="hidden md:table-cell">{t.duration} min</TableCell>
                        <TableCell className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteTreatment.mutate(t.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {treatments.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No treatments found</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="plans" className="mt-4">
                <div className="space-y-4">
                  {plans.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No treatment plans</p>}
                  {plans.map(plan => {
                    const procedures = (plan.procedures as unknown as Procedure[] | null) || [];
                    const patient = plan.patient as any;
                    return (
                      <Card key={plan.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-sm font-semibold">{patient?.name ?? "Unknown"}</CardTitle>
                              {patient?.serial_number && <p className="text-xs text-primary font-mono">{patient.serial_number}</p>}
                            </div>
                            <span className="text-sm font-semibold text-primary">₦{Number(plan.total_cost).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Created: {plan.created_at.split("T")[0]}</p>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {procedures.map((proc, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/50">
                              <span className="text-sm">{proc.treatmentName}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">₦{proc.cost}</span>
                                <Badge variant="secondary" className={proc.status === "completed" ? "bg-emerald-100 text-emerald-700" : ""}>{proc.status}</Badge>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="prescriptions" className="mt-4">
                <div className="space-y-4">
                  {prescriptions.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No prescriptions</p>}
                  {prescriptions.map(rx => {
                    const medications = (rx.medications as unknown as Medication[] | null) || [];
                    const patient = rx.patient as any;
                    return (
                      <Card key={rx.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-sm font-semibold">{patient?.name ?? "Unknown"}</CardTitle>
                              {patient?.serial_number && <p className="text-xs text-primary font-mono">{patient.serial_number}</p>}
                            </div>
                            <span className="text-xs text-muted-foreground">{rx.created_at.split("T")[0]} — {(rx.dentist as any)?.name ?? "—"}</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader><TableRow>
                              <TableHead>Medication</TableHead><TableHead>Dosage</TableHead>
                              <TableHead>Frequency</TableHead><TableHead>Duration</TableHead>
                            </TableRow></TableHeader>
                            <TableBody>
                              {medications.map((med, i) => (
                                <TableRow key={i}>
                                  <TableCell className="font-medium">{med.name}</TableCell>
                                  <TableCell>{med.dosage}</TableCell>
                                  <TableCell>{med.frequency}</TableCell>
                                  <TableCell>{med.duration}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          {rx.notes && <p className="text-xs text-muted-foreground mt-2 italic">Note: {rx.notes}</p>}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
