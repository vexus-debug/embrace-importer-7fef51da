import { useState } from "react";
import { usePatients, useDeletePatient, useUpdatePatient } from "@/hooks/usePatients";
import PatientDentalChart from "@/admin/components/PatientDentalChart";
import PatientDiagnosisSummary from "@/admin/components/PatientDiagnosisSummary";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, MoreHorizontal, Pencil, Trash2, Eye, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export default function PatientsPage() {
  const { data: patients = [], isLoading } = usePatients();
  const updatePatient = useUpdatePatient();
  const deletePatient = useDeletePatient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingPatient, setViewingPatient] = useState<any>(null);

  const emptyForm = {
    name: "", dob: "", gender: "Male", phone: "", email: "", blood_group: "",
    address: "", allergies: "", medical_history: "", ec_name: "", ec_phone: "",
    ec_relation: "", referral_source: "",
  };
  const [form, setForm] = useState(emptyForm);

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "", dob: p.dob || "", gender: p.gender || "Male",
      phone: p.phone || "", email: p.email || "", blood_group: p.blood_group || "",
      address: p.address || "", allergies: (p.allergies || []).join(", "),
      medical_history: (p.medical_history || []).join(", "),
      ec_name: (p.emergency_contact as any)?.name || "",
      ec_phone: (p.emergency_contact as any)?.phone || "",
      ec_relation: (p.emergency_contact as any)?.relation || "",
      referral_source: p.referral_source || "",
    });
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !editingId) return;
    const payload = {
      name: form.name, dob: form.dob || null, gender: form.gender,
      phone: form.phone || null, email: form.email || null, blood_group: form.blood_group || null,
      address: form.address || null,
      allergies: form.allergies ? form.allergies.split(",").map(s => s.trim()) : [],
      medical_history: form.medical_history ? form.medical_history.split(",").map(s => s.trim()) : [],
      emergency_contact: form.ec_name ? { name: form.ec_name, phone: form.ec_phone, relation: form.ec_relation } : {},
      referral_source: form.referral_source || null,
    };
    try {
      await updatePatient.mutateAsync({ id: editingId, ...payload });
      toast({ title: "Patient updated" });
      setEditDialogOpen(false);
      resetForm();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePatient.mutateAsync(id);
      toast({ title: "Patient deleted" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const filtered = patients.filter((p) => {
    const serial = (p as any).serial_number || "";
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || serial.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Patients</h1>
          <p className="text-sm text-muted-foreground">{patients.length} total patients</p>
        </div>
        <Button onClick={() => navigate("/admin/patients/add")}><Plus className="h-4 w-4 mr-2" />Add Patient</Button>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or serial number..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead className="hidden md:table-cell">Gender</TableHead>
                  <TableHead className="hidden lg:table-cell">Blood Group</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Last Visit</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs text-primary font-semibold">{(p as any).serial_number || "—"}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{p.phone || "—"}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{p.gender || "—"}</TableCell>
                    <TableCell className="hidden lg:table-cell">{p.blood_group || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === "active" ? "default" : "secondary"} className={p.status === "active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{p.last_visit ?? "—"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/patients/${p.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(p)}>
                            <Pencil className="h-4 w-4 mr-2" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(p.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && !isLoading && (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No patients found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Patient Details</DialogTitle></DialogHeader>
          {viewingPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Serial #:</span> <strong className="text-primary">{(viewingPatient as any).serial_number || "N/A"}</strong></div>
                <div><span className="text-muted-foreground">Name:</span> <strong>{viewingPatient.name}</strong></div>
                <div><span className="text-muted-foreground">DOB:</span> {viewingPatient.dob || "N/A"}</div>
                <div><span className="text-muted-foreground">Gender:</span> {viewingPatient.gender || "N/A"}</div>
                <div><span className="text-muted-foreground">Phone:</span> {viewingPatient.phone || "N/A"}</div>
                <div><span className="text-muted-foreground">Email:</span> {viewingPatient.email || "N/A"}</div>
                <div><span className="text-muted-foreground">Blood Group:</span> {viewingPatient.blood_group || "N/A"}</div>
                <div><span className="text-muted-foreground">Status:</span> {viewingPatient.status}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {viewingPatient.address || "N/A"}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Allergies:</span> {(viewingPatient.allergies || []).join(", ") || "None"}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Medical History:</span> {(viewingPatient.medical_history || []).join(", ") || "None"}</div>
                <div><span className="text-muted-foreground">Emergency Contact:</span> {(viewingPatient.emergency_contact as any)?.name || "N/A"}</div>
                <div><span className="text-muted-foreground">EC Phone:</span> {(viewingPatient.emergency_contact as any)?.phone || "N/A"}</div>
                <div><span className="text-muted-foreground">Referral Source:</span> {viewingPatient.referral_source || "N/A"}</div>
                <div><span className="text-muted-foreground">Last Visit:</span> {viewingPatient.last_visit || "N/A"}</div>
              </div>
              {/* Diagnosis & Treatment */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3">Diagnosis & Treatment</h3>
                <PatientDiagnosisSummary patientId={viewingPatient.id} />
              </div>
              {/* Dental Chart */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3">Dental Chart</h3>
                <PatientDentalChart patientId={viewingPatient.id} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(o) => { setEditDialogOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Patient</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2"><Label>Full Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Gender</Label>
              <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
              </Select></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Blood Group</Label>
              <Select value={form.blood_group} onValueChange={v => setForm(f => ({ ...f, blood_group: v }))}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(g=><SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select></div>
            <div className="space-y-2 md:col-span-2"><Label>Address</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Allergies</Label><Input placeholder="Comma separated" value={form.allergies} onChange={e => setForm(f => ({ ...f, allergies: e.target.value }))} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Medical History</Label><Textarea value={form.medical_history} onChange={e => setForm(f => ({ ...f, medical_history: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Emergency Contact Name</Label><Input value={form.ec_name} onChange={e => setForm(f => ({ ...f, ec_name: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Emergency Contact Phone</Label><Input value={form.ec_phone} onChange={e => setForm(f => ({ ...f, ec_phone: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Relation</Label><Input value={form.ec_relation} onChange={e => setForm(f => ({ ...f, ec_relation: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Referral Source</Label>
              <Select value={form.referral_source} onValueChange={v => setForm(f => ({ ...f, referral_source: v }))}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Google","Instagram","Referral","Walk-in","Other"].map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select></div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={updatePatient.isPending}>
              {updatePatient.isPending ? "Saving..." : "Update Patient"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}