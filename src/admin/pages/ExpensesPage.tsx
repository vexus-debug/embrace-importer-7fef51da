import { useState } from "react";
import { useExpenses, useCreateExpense, useDeleteExpense } from "@/hooks/useExpenses";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, DollarSign, TrendingDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

const categories = ["Rent", "Utilities", "Supplies", "Equipment", "Salaries", "Marketing", "Maintenance", "Insurance", "Other"];

export default function ExpensesPage() {
  const { data: expenses = [], isLoading } = useExpenses();
  const createExpense = useCreateExpense();
  const deleteExpense = useDeleteExpense();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ description: "", amount: "", category: "", vendor: "", payment_method: "cash", notes: "" });

  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + Number(e.amount), 0), [expenses]);
  const thisMonth = useMemo(() => {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return expenses.filter(e => e.date.startsWith(prefix)).reduce((s, e) => s + Number(e.amount), 0);
  }, [expenses]);

  const handleSave = async () => {
    if (!form.description || !form.amount) { toast({ title: "Description and amount required", variant: "destructive" }); return; }
    try {
      await createExpense.mutateAsync({ description: form.description, amount: Number(form.amount), category: form.category || undefined, vendor: form.vendor || undefined, payment_method: form.payment_method, notes: form.notes || undefined });
      toast({ title: "Expense added" });
      setOpen(false);
      setForm({ description: "", amount: "", category: "", vendor: "", payment_method: "cash", notes: "" });
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Expense Tracking</h1>
          <p className="text-sm text-muted-foreground">Track clinic expenses and costs</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Expense</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Description</Label><Input placeholder="Expense description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Amount (₦)</Label><Input type="number" placeholder="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Category</Label>
                  <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Vendor</Label><Input placeholder="Vendor name" value={form.vendor} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Payment Method</Label>
                  <Select value={form.payment_method} onValueChange={v => setForm(f => ({ ...f, payment_method: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Optional notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={createExpense.isPending}>{createExpense.isPending ? "Saving..." : "Save"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="shadow-card"><CardContent className="p-5 flex items-start justify-between">
          <div><p className="text-sm text-muted-foreground">Total Expenses</p><p className="text-xl font-bold">₦{totalExpenses.toLocaleString()}</p></div>
          <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-destructive" /></div>
        </CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-5 flex items-start justify-between">
          <div><p className="text-sm text-muted-foreground">This Month</p><p className="text-xl font-bold">₦{thisMonth.toLocaleString()}</p></div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><TrendingDown className="h-5 w-5 text-primary" /></div>
        </CardContent></Card>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          {isLoading ? <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div> : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Category</TableHead>
                <TableHead>Vendor</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead className="w-12" />
              </TableRow></TableHeader>
              <TableBody>
                {expenses.map(e => (
                  <TableRow key={e.id}>
                    <TableCell className="text-sm">{e.date}</TableCell>
                    <TableCell className="font-medium">{e.description}</TableCell>
                    <TableCell><Badge variant="outline">{e.category || "—"}</Badge></TableCell>
                    <TableCell className="text-sm">{e.vendor || "—"}</TableCell>
                    <TableCell className="font-semibold text-destructive">₦{Number(e.amount).toLocaleString()}</TableCell>
                    <TableCell className="text-sm capitalize">{e.payment_method}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteExpense.mutate(e.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
                  </TableRow>
                ))}
                {expenses.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No expenses recorded</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
