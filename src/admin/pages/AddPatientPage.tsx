import { useState } from "react";
import { useCreatePatient } from "@/hooks/usePatients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function AddPatientPage() {
  const createPatient = useCreatePatient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const emptyForm = {
    name: "", dob: "", gender: "Male", phone: "", email: "", blood_group: "",
    address: "", allergies: "", medical_history: "", ec_name: "", ec_phone: "",
    ec_relation: "", referral_source: "",
  };
  const [form, setForm] = useState(emptyForm);

  const handleSave = async () => {
    if (!form.name) { toast({ title: "Name is required", variant: "destructive" }); return; }
    const payload = {
      name: form.name,
      dob: form.dob || null,
      gender: form.gender,
      phone: form.phone || null,
      email: form.email || null,
      blood_group: form.blood_group || null,
      address: form.address || null,
      allergies: form.allergies ? form.allergies.split(",").map(s => s.trim()) : [],
      medical_history: form.medical_history ? form.medical_history.split(",").map(s => s.trim()) : [],
      emergency_contact: form.ec_name ? { name: form.ec_name, phone: form.ec_phone, relation: form.ec_relation } : {},
      referral_source: form.referral_source || null,
    };
    try {
      await createPatient.mutateAsync(payload);
      toast({ title: "Patient added successfully" });
      navigate("/admin/patients");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <UserPlus className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-heading font-bold">Add New Patient</h1>
          <p className="text-sm text-muted-foreground">Register a new patient into the system</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Full Name *</Label><Input placeholder="Patient name" value={form.name} onChange={e => set("name", e.target.value)} /></div>
          <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" value={form.dob} onChange={e => set("dob", e.target.value)} /></div>
          <div className="space-y-2"><Label>Gender</Label>
            <Select value={form.gender} onValueChange={v => set("gender", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Phone</Label><Input placeholder="+971 50 000 0000" value={form.phone} onChange={e => set("phone", e.target.value)} /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@example.com" value={form.email} onChange={e => set("email", e.target.value)} /></div>
          <div className="space-y-2"><Label>Blood Group</Label>
            <Select value={form.blood_group} onValueChange={v => set("blood_group", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2"><Label>Address</Label><Input placeholder="Full address" value={form.address} onChange={e => set("address", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Medical Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="space-y-2"><Label>Allergies</Label><Input placeholder="Comma separated" value={form.allergies} onChange={e => set("allergies", e.target.value)} /></div>
          <div className="space-y-2"><Label>Medical History</Label><Textarea placeholder="Any existing conditions..." value={form.medical_history} onChange={e => set("medical_history", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Emergency Contact</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2"><Label>Name</Label><Input value={form.ec_name} onChange={e => set("ec_name", e.target.value)} /></div>
          <div className="space-y-2"><Label>Phone</Label><Input value={form.ec_phone} onChange={e => set("ec_phone", e.target.value)} /></div>
          <div className="space-y-2"><Label>Relation</Label><Input placeholder="e.g. Wife, Father" value={form.ec_relation} onChange={e => set("ec_relation", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Referral</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-xs">
            <Label>Referral Source</Label>
            <Select value={form.referral_source} onValueChange={v => set("referral_source", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Google","Instagram","Referral","Walk-in","Other"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/admin/patients")}>Cancel</Button>
        <Button onClick={handleSave} disabled={createPatient.isPending}>
          {createPatient.isPending ? "Saving..." : "Save Patient"}
        </Button>
      </div>
    </div>
  );
}
