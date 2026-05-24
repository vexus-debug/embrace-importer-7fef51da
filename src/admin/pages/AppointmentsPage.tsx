import { useState } from "react";
import { useAppointments, useCreateAppointment, useUpdateAppointment } from "@/hooks/useAppointments";
import { usePatients } from "@/hooks/usePatients";
import { useStaff } from "@/hooks/useStaff";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CheckCircle, XCircle, Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import VisitWorkflow from "@/admin/components/VisitWorkflow";

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  completed: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  cancelled: "bg-red-100 text-red-700 hover:bg-red-100",
};

export default function AppointmentsPage() {
  const { data: appointments = [], isLoading } = useAppointments();
  const { data: patients = [] } = usePatients();
  const { data: staff = [] } = useStaff();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const { toast } = useToast();

  const [tab, setTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ patient_id: "", dentist_id: "", chair: "", treatment_type: "", date: "", time: "", is_walk_in: false, notes: "" });

  // Visit workflow
  const [visitOpen, setVisitOpen] = useState(false);
  const [visitPatientId, setVisitPatientId] = useState<string | undefined>();
  const [visitAppointmentId, setVisitAppointmentId] = useState<string | undefined>();

  const dentists = staff.filter((s) => s.role === "dentist");
  const filtered = tab === "all" ? appointments : appointments.filter((a) => a.status === tab);

  const handleBook = async () => {
    if (!form.patient_id || !form.date || !form.time) { toast({ title: "Patient, date, and time are required", variant: "destructive" }); return; }
    try {
      await createAppointment.mutateAsync({
        patient_id: form.patient_id,
        dentist_id: form.dentist_id || null,
        chair: form.chair || null,
        treatment_type: form.treatment_type || null,
        date: form.date,
        time: form.time,
        is_walk_in: form.is_walk_in,
        notes: form.notes || null,
      });
      toast({ title: "Appointment booked" });
      setDialogOpen(false);
      setForm({ patient_id: "", dentist_id: "", chair: "", treatment_type: "", date: "", time: "", is_walk_in: false, notes: "" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateAppointment.mutateAsync({ id, status });
      toast({ title: `Appointment ${status}` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleStartVisit = (appointmentId: string, patientId: string) => {
    setVisitPatientId(patientId);
    setVisitAppointmentId(appointmentId);
    setVisitOpen(true);
  };

  return (
    <div className="space-y-6">
      <VisitWorkflow
        open={visitOpen}
        onOpenChange={setVisitOpen}
        prefillPatientId={visitPatientId}
        prefillAppointmentId={visitAppointmentId}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Appointments</h1>
          <p className="text-sm text-muted-foreground">{appointments.length} total appointments</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Book Appointment</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Book Appointment</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Patient</Label>
                <Select value={form.patient_id} onValueChange={v => setForm(f => ({ ...f, patient_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select></div>
              <div className="space-y-2"><Label>Dentist</Label>
                <Select value={form.dentist_id} onValueChange={v => setForm(f => ({ ...f, dentist_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select dentist" /></SelectTrigger>
                  <SelectContent>{dentists.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Chair</Label>
                  <Select value={form.chair} onValueChange={v => setForm(f => ({ ...f, chair: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{["Chair 1","Chair 2","Chair 3"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select></div>
                <div className="space-y-2"><Label>Treatment Type</Label><Input placeholder="e.g. Cleaning" value={form.treatment_type} onChange={e => setForm(f => ({ ...f, treatment_type: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Time</Label><Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></div>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="walkin" checked={form.is_walk_in} onCheckedChange={v => setForm(f => ({ ...f, is_walk_in: v }))} /><Label htmlFor="walkin">Walk-in Patient</Label>
              </div>
              <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Optional notes..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleBook} disabled={createAppointment.isPending}>{createAppointment.isPending ? "Booking..." : "Book"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              <TabsContent value={tab} className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead><TableHead className="hidden md:table-cell">Dentist</TableHead>
                      <TableHead>Date</TableHead><TableHead>Time</TableHead>
                      <TableHead className="hidden lg:table-cell">Treatment</TableHead><TableHead>Status</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">
                          {a.patient?.name ?? "Unknown"}
                          {a.is_walk_in && <Badge variant="outline" className="ml-2 text-[10px]">Walk-in</Badge>}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{a.dentist?.name ?? "—"}</TableCell>
                        <TableCell className="text-sm">{a.date}</TableCell>
                        <TableCell className="text-sm font-semibold text-primary">{a.time}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">{a.treatment_type}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusColors[a.status] || ""}>{a.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {a.status === "scheduled" && (
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleStartVisit(a.id, a.patient_id)} title="Start Visit">
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600" onClick={() => handleStatusUpdate(a.id, "completed")} title="Mark Completed">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleStatusUpdate(a.id, "cancelled")} title="Cancel">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No appointments found</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
