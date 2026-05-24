import { useState } from "react";
import { usePatients } from "@/hooks/usePatients";
import { useTreatments } from "@/hooks/useTreatments";
import { useStaff } from "@/hooks/useStaff";
import { useCreateAppointment } from "@/hooks/useAppointments";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Clock, User, Phone } from "lucide-react";

export default function BookAppointmentPage() {
  const { data: treatments = [] } = useTreatments();
  const { data: staff = [] } = useStaff();
  const createAppointment = useCreateAppointment();
  const { data: patients = [] } = usePatients();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", date: "", time: "", treatment_type: "", dentist_id: "", notes: "",
  });

  const dentists = staff.filter(s => s.role === "dentist" && s.status === "active");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.time) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    try {
      // Find or note: in a real system we'd create the patient or find them
      // For now we use a walk-in appointment with notes containing patient info
      const existingPatient = patients.find(p => p.phone === form.phone);
      if (!existingPatient) {
        toast({ title: "Please contact the clinic to register first, or call us.", description: "Patient not found with this phone number.", variant: "destructive" });
        return;
      }
      await createAppointment.mutateAsync({
        patient_id: existingPatient.id,
        date: form.date,
        time: form.time,
        treatment_type: form.treatment_type || undefined,
        dentist_id: form.dentist_id || undefined,
        notes: form.notes || undefined,
        is_walk_in: false,
        status: "scheduled",
      });
      setSubmitted(true);
    } catch (err: any) {
      toast({ title: "Error booking appointment", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHero badge="Booking" title="Book an Appointment" subtitle="Schedule your visit online" />

      <section className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          {submitted ? (
            <Card className="shadow-card">
              <CardContent className="py-12 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <CalendarDays className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Appointment Booked!</h2>
                <p className="text-muted-foreground">Your appointment has been scheduled. We'll confirm it shortly.</p>
                <Button onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", date: "", time: "", treatment_type: "", dentist_id: "", notes: "" }); }}>Book Another</Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card">
              <CardHeader><CardTitle>Appointment Details</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2"><Label>Full Name *</Label><Input placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Phone *</Label><Input placeholder="+971..." value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required /></div>
                    <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Date *</Label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required min={new Date().toISOString().split("T")[0]} /></div>
                    <div className="space-y-2"><Label>Time *</Label><Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required /></div>
                  </div>
                  <div className="space-y-2"><Label>Treatment</Label>
                    <Select value={form.treatment_type} onValueChange={v => setForm(f => ({ ...f, treatment_type: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select treatment" /></SelectTrigger>
                      <SelectContent>{treatments.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
                    </Select></div>
                  <div className="space-y-2"><Label>Preferred Dentist</Label>
                    <Select value={form.dentist_id} onValueChange={v => setForm(f => ({ ...f, dentist_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Any available" /></SelectTrigger>
                      <SelectContent>{dentists.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                    </Select></div>
                  <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Any special requests?" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
                  <Button type="submit" className="w-full" disabled={createAppointment.isPending}>{createAppointment.isPending ? "Booking..." : "Book Appointment"}</Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
