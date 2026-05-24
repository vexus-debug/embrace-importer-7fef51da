import { useState } from "react";
import { useStaff } from "@/hooks/useStaff";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Pencil, Trash2, KeyRound } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"] | "nurse";

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  dentist: "bg-blue-100 text-blue-700",
  receptionist: "bg-pink-100 text-pink-700",
  hygienist: "bg-teal-100 text-teal-700",
  assistant: "bg-amber-100 text-amber-700",
  accountant: "bg-emerald-100 text-emerald-700",
};

const roles: AppRole[] = ["admin", "dentist", "receptionist", "hygienist", "assistant", "accountant", "nurse" as AppRole];

export default function StaffPage() {
  const { data: staff = [], isLoading } = useStaff();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "assistant" as AppRole, specialty: "", phone: "", email: "", password: "" });
  const [pwDialog, setPwDialog] = useState<{ open: boolean; userId: string | null }>({ open: false, userId: null });
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const openEdit = (s: any) => {
    setEditingId(s.id);
    setEditingUserId(s.user_id || null);
    setForm({ name: s.name, role: s.role, specialty: s.specialty || "", phone: s.phone || "", email: s.email || "", password: "" });
    setDialogOpen(true);
  };

  const resetForm = () => { setEditingId(null); setEditingUserId(null); setForm({ name: "", role: "assistant", specialty: "", phone: "", email: "", password: "" }); };

  const handleSave = async () => {
    if (!form.name) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      if (editingId) {
        // Update staff record
        const { error } = await supabase.functions.invoke("manage-user", {
          body: { action: "update_staff", staff_id: editingId, name: form.name, specialty: form.specialty || null, phone: form.phone || null, email: form.email || null },
        });
        if (error) throw error;
        // Update role (and linked user role) if user_id exists
        if (editingUserId) {
          const { error: rErr } = await supabase.functions.invoke("manage-user", {
            body: { action: "update_role", user_id: editingUserId, role: form.role },
          });
          if (rErr) throw rErr;
        } else {
          await supabase.from("staff").update({ role: form.role }).eq("id", editingId);
        }
        qc.invalidateQueries({ queryKey: ["staff"] });
        toast({ title: "Staff member updated" });
      } else {
        if (!form.email || !form.password) {
          toast({ title: "Email and password required to create login", variant: "destructive" });
          setSaving(false);
          return;
        }
        const { error } = await supabase.functions.invoke("manage-user", {
          body: { action: "create", email: form.email, password: form.password, full_name: form.name, role: form.role, specialty: form.specialty || null, phone: form.phone || null },
        });
        if (error) throw error;
        qc.invalidateQueries({ queryKey: ["staff"] });
        toast({ title: "Staff member added" });
      }
      setDialogOpen(false);
      resetForm();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const s = staff.find((x: any) => x.id === id) as any;
    if (!confirm(`Delete ${s?.name}? This will remove their login account.`)) return;
    try {
      const { error } = await supabase.functions.invoke("manage-user", {
        body: { action: "delete", staff_id: id, user_id: s?.user_id || null },
      });
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["staff"] });
      toast({ title: "Staff member deleted" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleChangePassword = async () => {
    if (!pwDialog.userId || !newPassword) return;
    try {
      const { error } = await supabase.functions.invoke("manage-user", {
        body: { action: "update_password", user_id: pwDialog.userId, password: newPassword },
      });
      if (error) throw error;
      toast({ title: "Password updated" });
      setPwDialog({ open: false, userId: null });
      setNewPassword("");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const filtered = staff.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || s.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Staff Management</h1>
          <p className="text-sm text-muted-foreground">{staff.length} staff members</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Staff</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingId ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Role</Label>
                <Select value={form.role} onValueChange={(v: AppRole) => setForm(f => ({ ...f, role: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{roles.map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}</SelectContent>
                </Select></div>
              <div className="space-y-2"><Label>Specialty</Label><Input placeholder="e.g. Orthodontics (optional)" value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Phone</Label><Input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              </div>
            {!editingId && (
              <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="Initial password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
            )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editingId ? "Update" : "Save"}</Button>
            </div>
          </DialogContent>
        </Dialog>

      <Dialog open={pwDialog.open} onOpenChange={(o) => { if (!o) { setPwDialog({ open: false, userId: null }); setNewPassword(""); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
          <div className="space-y-2 py-4">
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 chars" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPwDialog({ open: false, userId: null })}>Cancel</Button>
            <Button onClick={handleChangePassword}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search staff..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Name</TableHead><TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Specialty</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Email</TableHead>
                <TableHead>Status</TableHead><TableHead className="w-20" />
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">{s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                        <span className="font-medium">{s.name}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary" className={roleColors[s.role] || ""}>{s.role}</Badge></TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{s.specialty || "—"}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{s.phone}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{s.email}</TableCell>
                    <TableCell><Badge variant={s.status === "active" ? "default" : "secondary"} className={s.status === "active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}>{s.status}</Badge></TableCell>
                    <TableCell className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                      {s.user_id && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPwDialog({ open: true, userId: s.user_id })}><KeyRound className="h-3.5 w-3.5" /></Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No staff found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
