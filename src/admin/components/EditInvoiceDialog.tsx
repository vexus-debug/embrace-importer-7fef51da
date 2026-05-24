import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUpdateInvoice } from "@/hooks/useInvoices";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

interface InvoiceItem {
  date: string;
  treatment: string;
  dentist: string;
  price: number;
}

interface InvoiceData {
  id: string;
  invoice_number: string;
  status: string;
  total: number | null;
  discount: number | null;
  items: InvoiceItem[] | null;
  patient: { name: string } | null;
}

interface Props {
  invoice: InvoiceData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditInvoiceDialog({ invoice, open, onOpenChange }: Props) {
  const { toast } = useToast();
  const updateInvoice = useUpdateInvoice();

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [discount, setDiscount] = useState("0");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (invoice) {
      setItems(Array.isArray(invoice.items) ? invoice.items : []);
      setDiscount(String(invoice.discount || 0));
      setStatus(invoice.status);
    }
  }, [invoice]);

  if (!invoice) return null;

  const subtotal = items.reduce((s, i) => s + (i.price || 0), 0);
  const discountVal = Number(discount) || 0;
  const total = Math.max(0, subtotal - discountVal);

  const updateItem = (idx: number, field: keyof InvoiceItem, value: string | number) => {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { date: new Date().toISOString().split("T")[0], treatment: "", dentist: "", price: 0 }]);
  };

  const handleSave = async () => {
    try {
      await updateInvoice.mutateAsync({
        id: invoice.id,
        items: items as any,
        discount: discountVal,
        total,
        status,
      });
      toast({ title: "Invoice updated" });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" /> Edit Invoice {invoice.invoice_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Patient: <span className="font-medium text-foreground">{invoice.patient?.name}</span></p>
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Dentist</TableHead>
                  <TableHead className="text-right">Price (₦)</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Input type="date" className="h-8 w-32" value={item.date} onChange={(e) => updateItem(idx, "date", e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <Input className="h-8" value={item.treatment} onChange={(e) => updateItem(idx, "treatment", e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <Input className="h-8" value={item.dentist} onChange={(e) => updateItem(idx, "dentist", e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <Input type="number" className="h-8 w-24 text-right" value={item.price} onChange={(e) => updateItem(idx, "price", Number(e.target.value))} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(idx)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-4">No items</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
            <div className="p-2 border-t">
              <Button variant="ghost" size="sm" className="gap-1" onClick={addItem}>
                <Plus className="h-3.5 w-3.5" /> Add Item
              </Button>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({items.length} items)</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Discount (₦)</span>
              <Input type="number" className="w-28 h-8 text-right" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={updateInvoice.isPending}>
              {updateInvoice.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
