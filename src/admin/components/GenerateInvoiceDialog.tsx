import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { usePatients } from "@/hooks/usePatients";
import { usePatientAppointments, useCreateInvoice } from "@/hooks/useInvoices";
import { useTreatments } from "@/hooks/useTreatments";
import { useToast } from "@/hooks/use-toast";
import { FileText } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GenerateInvoiceDialog({ open, onOpenChange }: Props) {
  const { toast } = useToast();
  const { data: patients = [] } = usePatients();
  const { data: treatments = [] } = useTreatments();
  const createInvoice = useCreateInvoice();

  const [patientId, setPatientId] = useState<string>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedAppts, setSelectedAppts] = useState<Set<string>>(new Set());
  const [discount, setDiscount] = useState("0");

  const { data: appointments = [], isLoading: loadingAppts } = usePatientAppointments(
    patientId || null,
    dateFrom || null,
    dateTo || null
  );

  const treatmentPriceMap = useMemo(() => {
    const map: Record<string, number> = {};
    treatments.forEach((t) => {
      map[t.name.toLowerCase()] = Number(t.price);
    });
    return map;
  }, [treatments]);

  const getPrice = (treatmentType: string | null) => {
    if (!treatmentType) return 0;
    return treatmentPriceMap[treatmentType.toLowerCase()] ?? 0;
  };

  const selectedItems = appointments.filter((a) => selectedAppts.has(a.id));
  const subtotal = selectedItems.reduce((s, a) => s + getPrice(a.treatment_type), 0);
  const discountAmount = Number(discount) || 0;
  const total = Math.max(0, subtotal - discountAmount);

  const toggleAppt = (id: string) => {
    setSelectedAppts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedAppts.size === appointments.length) {
      setSelectedAppts(new Set());
    } else {
      setSelectedAppts(new Set(appointments.map((a) => a.id)));
    }
  };

  const handleGenerate = async () => {
    if (!patientId || selectedItems.length === 0) {
      toast({ title: "Select at least one appointment", variant: "destructive" });
      return;
    }

    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
    const items = selectedItems.map((a) => ({
      date: a.date,
      treatment: a.treatment_type || "General",
      dentist: a.dentist?.name || "N/A",
      price: getPrice(a.treatment_type),
    }));

    try {
      await createInvoice.mutateAsync({
        patient_id: patientId,
        invoice_number: invoiceNumber,
        items: items as any,
        discount: discountAmount,
        total,
        status: "pending",
      });
      toast({ title: "Invoice generated", description: invoiceNumber });
      onOpenChange(false);
      resetForm();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setPatientId("");
    setDateFrom("");
    setDateTo("");
    setSelectedAppts(new Set());
    setDiscount("0");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); onOpenChange(o); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Generate Invoice
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient & Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Patient</Label>
              <Select value={patientId} onValueChange={(v) => { setPatientId(v); setSelectedAppts(new Set()); }}>
                <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>From</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>

          {/* Appointments table */}
          {patientId && dateFrom && dateTo && (
            <div className="border rounded-lg">
              {loadingAppts ? (
                <div className="p-4 space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : appointments.length === 0 ? (
                <p className="p-6 text-center text-muted-foreground text-sm">No appointments found in this date range.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox checked={selectedAppts.size === appointments.length && appointments.length > 0} onCheckedChange={toggleAll} />
                      </TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Dentist</TableHead>
                      <TableHead className="text-right">Price (₦)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell><Checkbox checked={selectedAppts.has(a.id)} onCheckedChange={() => toggleAppt(a.id)} /></TableCell>
                        <TableCell className="text-sm">{a.date}</TableCell>
                        <TableCell>{a.treatment_type || "General"}</TableCell>
                        <TableCell>{a.dentist?.name || "N/A"}</TableCell>
                        <TableCell className="text-right">{getPrice(a.treatment_type).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {/* Totals */}
          {selectedItems.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({selectedItems.length} items)</span>
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
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false); }}>Cancel</Button>
            <Button onClick={handleGenerate} disabled={createInvoice.isPending || selectedItems.length === 0}>
              {createInvoice.isPending ? "Generating..." : "Generate Invoice"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
