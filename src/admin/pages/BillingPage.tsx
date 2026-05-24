import { useState } from "react";
import { useInvoices, usePayments, useCreatePayment, useUpdateInvoice } from "@/hooks/useInvoices";
import EditInvoiceDialog from "@/admin/components/EditInvoiceDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, DollarSign, Plus, Mail, FileText, TrendingUp, Clock, AlertTriangle, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import GenerateInvoiceDialog from "@/admin/components/GenerateInvoiceDialog";
import InvoiceDetailDialog from "@/admin/components/InvoiceDetailDialog";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  paid: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  partial: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  overdue: "bg-red-100 text-red-700 hover:bg-red-100",
};

const COMPANY_NAME = "Dbridge Dental Clinic";

export default function BillingPage() {
  const { data: invoices = [], isLoading } = useInvoices();
  const { data: payments = [] } = usePayments();
  const createPayment = useCreatePayment();
  const updateInvoice = useUpdateInvoice();
  const { toast } = useToast();

  const [tab, setTab] = useState("all");
  const [payDialog, setPayDialog] = useState<string | null>(null);
  const [payForm, setPayForm] = useState({ amount: "", method: "cash", date: "", notes: "" });
  const [generateOpen, setGenerateOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<any>(null);
  const [editInvoice, setEditInvoice] = useState<any>(null);

  const filtered = tab === "all" ? invoices : invoices.filter((i) => i.status === tab);

  const getInvoicePaid = (invoiceId: string) =>
    payments.filter(p => p.invoice_id === invoiceId).reduce((s, p) => s + Number(p.amount), 0);

  const totalRevenue = invoices.reduce((s, i) => s + Number(i.total || 0), 0);
  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalOutstanding = totalRevenue - totalCollected;
  const overdueCount = invoices.filter(i => i.status === "overdue").length;

  const handlePay = async () => {
    if (!payDialog || !payForm.amount) return;
    const invoice = invoices.find(i => i.id === payDialog);
    try {
      await createPayment.mutateAsync({
        invoice_id: payDialog,
        amount: Number(payForm.amount),
        method: payForm.method,
        date: payForm.date || new Date().toISOString().split("T")[0],
        notes: payForm.notes || null,
      });
      if (invoice) {
        const prevPaid = getInvoicePaid(payDialog);
        const newPaid = prevPaid + Number(payForm.amount);
        const total = Number(invoice.total) || 0;
        const newStatus = newPaid >= total ? "paid" : "partial";
        await updateInvoice.mutateAsync({ id: payDialog, status: newStatus });
      }
      toast({ title: "Payment recorded" });
      setPayDialog(null);
      setPayForm({ amount: "", method: "cash", date: "", notes: "" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const openDetail = (inv: any) => {
    setViewInvoice({ ...inv, paid: getInvoicePaid(inv.id) });
  };

  const handleEmailInvoice = (inv: any) => {
    const email = inv.patient?.email || "";
    const total = Number(inv.total || 0);
    const paid = getInvoicePaid(inv.id);
    const balance = total - paid;
    const subject = encodeURIComponent(`Invoice ${inv.invoice_number} — ${COMPANY_NAME}`);
    const body = encodeURIComponent(
      `Dear ${inv.patient?.name || "Patient"},\n\nPlease find your invoice details below:\n\nInvoice #: ${inv.invoice_number}\nDate: ${inv.created_at.split("T")[0]}\nTotal: ₦${total.toLocaleString()}\nPaid: ₦${paid.toLocaleString()}\nBalance: ₦${balance.toLocaleString()}\nStatus: ${inv.status}\n\nFor questions, please contact us.\n\nBest regards,\n${COMPANY_NAME}`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Billing & Invoicing</h1>
          <p className="text-sm text-muted-foreground">{invoices.length} invoices</p>
        </div>
        <Button onClick={() => setGenerateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Generate Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="text-lg font-bold">₦{totalRevenue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Collected</p>
              <p className="text-lg font-bold text-emerald-600">₦{totalCollected.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Outstanding</p>
              <p className="text-lg font-bold text-amber-600">₦{totalOutstanding.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Overdue</p>
              <p className="text-lg font-bold text-red-600">{overdueCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All ({invoices.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="partial">Partial</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
              <TabsContent value={tab} className="mt-4">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Invoice #</TableHead><TableHead>Patient</TableHead>
                    <TableHead>Total</TableHead><TableHead className="hidden md:table-cell">Paid</TableHead>
                    <TableHead className="hidden md:table-cell">Balance</TableHead>
                    <TableHead>Status</TableHead><TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="w-36" />
                  </TableRow></TableHeader>
                  <TableBody>
                    {filtered.map((inv) => {
                      const paid = getInvoicePaid(inv.id);
                      const balance = Number(inv.total || 0) - paid;
                      return (
                        <TableRow key={inv.id}>
                          <TableCell className="font-mono text-sm">{inv.invoice_number}</TableCell>
                          <TableCell className="font-medium">{inv.patient?.name ?? "Unknown"}</TableCell>
                          <TableCell>₦{Number(inv.total).toLocaleString()}</TableCell>
                          <TableCell className="hidden md:table-cell text-emerald-600">₦{paid.toLocaleString()}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {balance > 0 ? <span className="text-red-600 font-medium">₦{balance.toLocaleString()}</span> : <span className="text-muted-foreground">—</span>}
                          </TableCell>
                          <TableCell><Badge variant="secondary" className={statusColors[inv.status]}>{inv.status}</Badge></TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{inv.created_at.split("T")[0]}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDetail(inv)} title="View Invoice">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditInvoice(inv)} title="Edit Invoice">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleEmailInvoice(inv)} title="Email Invoice">
                                <Mail className="h-4 w-4" />
                              </Button>
                              {inv.status !== "paid" && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => setPayDialog(inv.id)} title="Record Payment">
                                  <DollarSign className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filtered.length === 0 && (
                      <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No invoices found</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <GenerateInvoiceDialog open={generateOpen} onOpenChange={setGenerateOpen} />
      <InvoiceDetailDialog invoice={viewInvoice} open={!!viewInvoice} onOpenChange={(o) => { if (!o) setViewInvoice(null); }} />
      <EditInvoiceDialog invoice={editInvoice} open={!!editInvoice} onOpenChange={(o) => { if (!o) setEditInvoice(null); }} />

      {/* Payment Dialog */}
      <Dialog open={!!payDialog} onOpenChange={(o) => { if (!o) setPayDialog(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Amount (₦)</Label><Input type="number" placeholder="0" value={payForm.amount} onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Method</Label>
              <Select value={payForm.method} onValueChange={v => setPayForm(f => ({ ...f, method: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="card">Card</SelectItem><SelectItem value="transfer">Transfer</SelectItem></SelectContent>
              </Select></div>
            <div className="space-y-2"><Label>Date</Label><Input type="date" value={payForm.date} onChange={e => setPayForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Notes</Label><Input placeholder="Optional" value={payForm.notes} onChange={e => setPayForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPayDialog(null)}>Cancel</Button>
            <Button onClick={handlePay} disabled={createPayment.isPending}>{createPayment.isPending ? "Saving..." : "Record Payment"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
