import { useState } from "react";
import { useInsuranceProviders, useCreateInsuranceProvider, useInsuranceClaims, useCreateInsuranceClaim, useUpdateInsuranceClaim } from "@/hooks/useInsurance";
import { usePatients } from "@/hooks/usePatients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors: Record<string, string> = { submitted: "bg-blue-100 text-blue-700", approved: "bg-emerald-100 text-emerald-700", denied: "bg-red-100 text-red-700", pending: "bg-yellow-100 text-yellow-700" };

export default function InsurancePage() {
  const { data: providers = [], isLoading: lp } = useInsuranceProviders();
  const { data: claims = [], isLoading: lc } = useInsuranceClaims();
  const { data: patients = [] } = usePatients();
  const createProvider = useCreateInsuranceProvider();
  const createClaim = useCreateInsuranceClaim();
  const updateClaim = useUpdateInsuranceClaim();
  const { toast } = useToast();
  const [tab, setTab] = useState("claims");
  const [providerOpen, setProviderOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  const [pForm, setPForm] = useState({ name: "", contact_phone: "", contact_email: "" });
  const [cForm, setCForm] = useState({ patient_id: "", provider_id: "", claim_number: "", amount_claimed: "" });

  const handleAddProvider = async () => {
    if (!pForm.name) { toast({ title: "Name required", variant: "destructive" }); return; }
    try {
      await createProvider.mutateAsync({ name: pForm.name, contact_phone: pForm.contact_phone || undefined, contact_email: pForm.contact_email || undefined });
      toast({ title: "Provider added" }); setProviderOpen(false); setPForm({ name: "", contact_phone: "", contact_email: "" });
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  const handleAddClaim = async () => {
    if (!cForm.patient_id || !cForm.provider_id || !cForm.amount_claimed) { toast({ title: "Fill required fields", variant: "destructive" }); return; }
    try {
      await createClaim.mutateAsync({ patient_id: cForm.patient_id, provider_id: cForm.provider_id, claim_number: cForm.claim_number || undefined, amount_claimed: Number(cForm.amount_claimed) });
      toast({ title: "Claim submitted" }); setClaimOpen(false); setCForm({ patient_id: "", provider_id: "", claim_number: "", amount_claimed: "" });
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  const isLoading = lp || lc;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Insurance & Claims</h1>
          <p className="text-sm text-muted-foreground">Manage insurance providers and claims</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={claimOpen} onOpenChange={setClaimOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />New Claim</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Submit Insurance Claim</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label>Patient</Label>
                  <Select value={cForm.patient_id} onValueChange={v => setCForm(f => ({ ...f, patient_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                    <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                  </Select></div>
                <div className="space-y-2"><Label>Insurance Provider</Label>
                  <Select value={cForm.provider_id} onValueChange={v => setCForm(f => ({ ...f, provider_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                    <SelectContent>{providers.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                  </Select></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Claim Number</Label><Input placeholder="CLM-001" value={cForm.claim_number} onChange={e => setCForm(f => ({ ...f, claim_number: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Amount Claimed (₦)</Label><Input type="number" placeholder="0" value={cForm.amount_claimed} onChange={e => setCForm(f => ({ ...f, amount_claimed: e.target.value }))} /></div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setClaimOpen(false)}>Cancel</Button>
                <Button onClick={handleAddClaim} disabled={createClaim.isPending}>{createClaim.isPending ? "Submitting..." : "Submit"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          {isLoading ? <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div> : (
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="claims">Claims</TabsTrigger>
                <TabsTrigger value="providers">Providers</TabsTrigger>
              </TabsList>

              <TabsContent value="claims" className="mt-4">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Patient</TableHead><TableHead>Provider</TableHead><TableHead>Claim #</TableHead>
                    <TableHead>Claimed</TableHead><TableHead>Approved</TableHead><TableHead>Status</TableHead><TableHead className="w-24">Actions</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {claims.map(c => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{(c as any).patient?.name ?? "—"}</TableCell>
                        <TableCell>{(c as any).provider?.name ?? "—"}</TableCell>
                        <TableCell className="text-sm">{c.claim_number || "—"}</TableCell>
                        <TableCell>₦{Number(c.amount_claimed).toLocaleString()}</TableCell>
                        <TableCell>₦{Number(c.amount_approved).toLocaleString()}</TableCell>
                        <TableCell><Badge className={statusColors[c.status] || ""} variant="secondary">{c.status}</Badge></TableCell>
                        <TableCell className="flex gap-1">
                          {c.status === "submitted" && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => updateClaim.mutate({ id: c.id, status: "approved", amount_approved: Number(c.amount_claimed), resolved_at: new Date().toISOString() })}>Approve</Button>
                              <Button variant="outline" size="sm" className="text-destructive" onClick={() => updateClaim.mutate({ id: c.id, status: "denied", resolved_at: new Date().toISOString() })}>Deny</Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {claims.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No claims</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="providers" className="mt-4">
                <div className="flex justify-end mb-4">
                  <Dialog open={providerOpen} onOpenChange={setProviderOpen}>
                    <DialogTrigger asChild><Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" />Add Provider</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Add Insurance Provider</DialogTitle></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>Name</Label><Input placeholder="Provider name" value={pForm.name} onChange={e => setPForm(f => ({ ...f, name: e.target.value }))} /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>Phone</Label><Input placeholder="Phone" value={pForm.contact_phone} onChange={e => setPForm(f => ({ ...f, contact_phone: e.target.value }))} /></div>
                          <div className="space-y-2"><Label>Email</Label><Input placeholder="Email" value={pForm.contact_email} onChange={e => setPForm(f => ({ ...f, contact_email: e.target.value }))} /></div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setProviderOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddProvider} disabled={createProvider.isPending}>{createProvider.isPending ? "Saving..." : "Save"}</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>Email</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {providers.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium"><div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />{p.name}</div></TableCell>
                        <TableCell>{p.contact_phone || "—"}</TableCell>
                        <TableCell>{p.contact_email || "—"}</TableCell>
                      </TableRow>
                    ))}
                    {providers.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No providers</TableCell></TableRow>}
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
