import { useState } from "react";
import { useDocuments, useCreateDocument, useDeleteDocument } from "@/hooks/useDocuments";
import { usePatients } from "@/hooks/usePatients";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, FileText, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const docCategories = ["Contract", "License", "Certificate", "Report", "Letter", "Other"];

export default function DocumentsPage() {
  const { data: docs = [], isLoading } = useDocuments();
  const { data: patients = [] } = usePatients();
  const createDoc = useCreateDocument();
  const deleteDoc = useDeleteDocument();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", patient_id: "", notes: "" });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!form.name || !file) { toast({ title: "Name and file required", variant: "destructive" }); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("documents").upload(path, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(path);
      await createDoc.mutateAsync({
        name: form.name,
        file_url: publicUrl,
        category: form.category || undefined,
        patient_id: form.patient_id || undefined,
        notes: form.notes || undefined,
      });
      toast({ title: "Document uploaded" }); setOpen(false);
      setForm({ name: "", category: "", patient_id: "", notes: "" }); setFile(null);
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Document Management</h1>
          <p className="text-sm text-muted-foreground">Store contracts, licenses, certificates</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Upload Document</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Document Name</Label><Input placeholder="Document name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>File</Label><Input type="file" onChange={e => setFile(e.target.files?.[0] || null)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Category</Label>
                  <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{docCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select></div>
                <div className="space-y-2"><Label>Patient (optional)</Label>
                  <Select value={form.patient_id} onValueChange={v => setForm(f => ({ ...f, patient_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                  </Select></div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleUpload} disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          {isLoading ? <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div> : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Date</TableHead><TableHead className="w-24">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {docs.map(d => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium"><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />{d.name}</div></TableCell>
                    <TableCell><Badge variant="outline">{d.category || "—"}</Badge></TableCell>
                    <TableCell className="text-sm">{d.created_at.split("T")[0]}</TableCell>
                    <TableCell className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild><a href={d.file_url} target="_blank" rel="noreferrer"><Download className="h-3.5 w-3.5" /></a></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteDoc.mutate(d.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {docs.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No documents</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
