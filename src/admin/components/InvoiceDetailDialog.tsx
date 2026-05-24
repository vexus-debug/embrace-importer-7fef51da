import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, Mail, MessageCircle, Phone, MapPin, Globe, Download, Loader2 } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { downloadInvoicePdf, uploadInvoicePdf, type InvoicePdfData } from "@/admin/lib/invoicePdf";
import { useToast } from "@/hooks/use-toast";

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
  created_at: string;
  items: InvoiceItem[] | null;
  patient: { name: string; phone: string | null; email: string | null; address: string | null } | null;
  paid: number;
}

interface Props {
  invoice: InvoiceData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  partial: "bg-blue-100 text-blue-700",
  overdue: "bg-red-100 text-red-700",
};

const COMPANY = {
  name: "Dbridge Dental Clinic",
  address: "123 Dental Avenue, Lagos, Nigeria",
  phone: "+234 800 123 4567",
  email: "info@dbridgedental.com",
  website: "www.dbridgedental.com",
};

export default function InvoiceDetailDialog({ invoice, open, onOpenChange }: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [sharing, setSharing] = useState<"" | "whatsapp" | "email" | "download">("");

  if (!invoice) return null;

  const items: InvoiceItem[] = Array.isArray(invoice.items) ? invoice.items : [];
  const subtotal = items.reduce((s, i) => s + (i.price || 0), 0);
  const discountVal = Number(invoice.discount) || 0;
  const totalVal = Number(invoice.total) || 0;
  const balance = totalVal - invoice.paid;

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printHTML = `
      <html><head><title>Invoice ${invoice.invoice_number}</title>
      <style>
        @page { size: A4; margin: 15mm 20mm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a1a; width: 100%; font-size: 12px; line-height: 1.4; }
        img { max-width: 36px !important; max-height: 36px !important; width: 36px !important; height: 36px !important; border-radius: 6px; object-fit: cover; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; font-size: 11px; }
        th { background: #f5f5f5; font-weight: 600; text-transform: uppercase; font-size: 9px; letter-spacing: 0.05em; color: #555; }
        .text-right { text-align: right; }
        div[class*="flex"] { display: flex; }
        div[class*="justify-between"] { justify-content: space-between; }
        div[class*="items-start"] { align-items: flex-start; }
        div[class*="gap-2"] { gap: 8px; }
        div[class*="border-b"] { border-bottom: 2px solid #0ea5e9; padding-bottom: 12px; margin-bottom: 16px; }
        div[class*="text-right"] { text-align: right; }
        div[class*="bg-muted"] { background: #f8fafc; border-radius: 6px; padding: 10px; margin-bottom: 12px; }
        h2 { font-size: 15px; font-weight: 700; color: #0ea5e9; margin: 0 0 2px; }
        h3 { font-size: 18px; font-weight: 800; color: #0ea5e9; }
        p[class*="text-xs"], p[class*="text-\\[10px\\]"] { font-size: 9px; color: #666; margin: 1px 0; }
        p[class*="font-semibold"] { font-size: 13px; font-weight: 600; }
        p[class*="font-mono"] { font-family: monospace; font-size: 10px; color: #666; }
        span[class*="font-medium"] { font-weight: 500; }
        span[class*="text-red"] { color: #dc2626; }
        span[class*="text-emerald"] { color: #047857; }
        div[class*="space-y-1"] > div { margin: 3px 0; font-size: 11px; }
        div[class*="text-lg"] { font-size: 14px; font-weight: 700; border-top: 2px solid #e5e5e5; padding-top: 6px; }
        div[class*="border-t"][class*="text-center"] { margin-top: 20px; padding-top: 10px; border-top: 1px solid #e5e5e5; text-align: center; font-size: 9px; color: #999; }
        svg { display: none !important; }
        button { display: none !important; }
        .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e5e5; text-align: center; font-size: 9px; color: #999; }
        .footer p { margin: 2px 0; }
        @media print { body { padding: 0; } }
      </style></head><body>
      ${content.innerHTML}
      <div class="footer">
        <p>Thank you for choosing ${COMPANY.name}. We appreciate your trust in our care.</p>
        <p>${COMPANY.address} | ${COMPANY.phone} | ${COMPANY.email}</p>
      </div>
      </body></html>
    `;
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.top = "-10000px";
    iframe.style.left = "-10000px";
    document.body.appendChild(iframe);
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;
    iframeDoc.open();
    iframeDoc.write(printHTML);
    iframeDoc.close();
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 500);
  };

  const buildPdfData = (): InvoicePdfData => ({
    invoice_number: invoice.invoice_number,
    created_at: invoice.created_at,
    status: invoice.status,
    total: totalVal,
    discount: discountVal,
    paid: invoice.paid,
    items,
    patient: invoice.patient,
  });

  const summaryText = (link?: string) => `Invoice ${invoice.invoice_number} from ${COMPANY.name}
Patient: ${invoice.patient?.name}
Date: ${invoice.created_at.split("T")[0]}
Total: NGN ${totalVal.toLocaleString()}
Paid: NGN ${invoice.paid.toLocaleString()}
${balance > 0 ? `Balance Due: NGN ${balance.toLocaleString()}` : "Fully Paid"}
${link ? `\nDownload your invoice PDF:\n${link}` : ""}

${COMPANY.phone} | ${COMPANY.email}`;

  const handleDownload = () => {
    setSharing("download");
    try { downloadInvoicePdf(buildPdfData()); }
    finally { setSharing(""); }
  };

  const handleWhatsApp = async () => {
    setSharing("whatsapp");
    try {
      const { url } = await uploadInvoicePdf(buildPdfData());
      const phone = invoice.patient?.phone?.replace(/\D/g, "") || "";
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(summaryText(url))}`, "_blank");
      toast({ title: "Invoice PDF ready", description: "Link included in WhatsApp message" });
    } catch (e: any) {
      toast({ title: "Failed to share", description: e.message, variant: "destructive" });
    } finally { setSharing(""); }
  };

  const handleEmail = async () => {
    setSharing("email");
    try {
      const { url } = await uploadInvoicePdf(buildPdfData());
      const email = invoice.patient?.email || "";
      const subject = encodeURIComponent(`Invoice ${invoice.invoice_number} — ${COMPANY.name}`);
      const body = encodeURIComponent(summaryText(url));
      window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
      toast({ title: "Invoice PDF ready", description: "Link included in email" });
    } catch (e: any) {
      toast({ title: "Failed to share", description: e.message, variant: "destructive" });
    } finally { setSharing(""); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Invoice {invoice.invoice_number}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrint} title="Print">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload} title="Download PDF" disabled={sharing === "download"}>
                {sharing === "download" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={handleWhatsApp} title="Share PDF via WhatsApp" disabled={sharing === "whatsapp"}>
                {sharing === "whatsapp" ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={handleEmail} title="Share PDF via Email" disabled={sharing === "email"}>
                {sharing === "email" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div ref={printRef}>
          {/* Company Header */}
          <div className="print-header flex justify-between items-start mb-4 pb-3 border-b-2 border-primary">
            <div className="print-header-left flex gap-2">
              <img src={logo} alt="Logo" className="print-logo h-10 w-10 rounded-md object-cover" />
              <div>
                <h2 className="font-bold text-lg text-primary">{COMPANY.name}</h2>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />{COMPANY.address}</p>
                  <p className="flex items-center gap-1"><Phone className="h-3 w-3" />{COMPANY.phone}</p>
                  <p className="flex items-center gap-1"><Mail className="h-3 w-3" />{COMPANY.email}</p>
                  <p className="flex items-center gap-1"><Globe className="h-3 w-3" />{COMPANY.website}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-2xl font-extrabold text-primary">INVOICE</h3>
              <p className="text-xs text-muted-foreground font-mono">#{invoice.invoice_number}</p>
              <p className="text-xs text-muted-foreground">Date: {invoice.created_at.split("T")[0]}</p>
              <Badge className={`mt-2 ${statusColors[invoice.status] || ""}`}>{invoice.status.toUpperCase()}</Badge>
            </div>
          </div>

          {/* Bill To */}
          <div className="bg-muted/40 rounded-lg p-4 mb-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Bill To</p>
            <p className="font-semibold text-base">{invoice.patient?.name}</p>
            {invoice.patient?.phone && <p className="text-xs text-muted-foreground">{invoice.patient.phone}</p>}
            {invoice.patient?.email && <p className="text-xs text-muted-foreground">{invoice.patient.email}</p>}
            {invoice.patient?.address && <p className="text-xs text-muted-foreground">{invoice.patient.address}</p>}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead>Dentist</TableHead>
                <TableHead className="text-right">Price (₦)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell className="text-sm">{item.date}</TableCell>
                  <TableCell>{item.treatment}</TableCell>
                  <TableCell>{item.dentist}</TableCell>
                  <TableCell className="text-right">{(item.price || 0).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-4">No items</TableCell></TableRow>
              )}
            </TableBody>
          </Table>

          <div className="mt-4 space-y-1 text-right text-sm">
            <div>Subtotal: <span className="font-medium">₦{subtotal.toLocaleString()}</span></div>
            {discountVal > 0 && <div>Discount: <span className="font-medium text-red-600">-₦{discountVal.toLocaleString()}</span></div>}
            <div className="text-lg font-bold border-t pt-2">Total: ₦{totalVal.toLocaleString()}</div>
            <div>Paid: <span className="text-emerald-600 font-medium">₦{invoice.paid.toLocaleString()}</span></div>
            {balance > 0 && <div>Balance Due: <span className="text-red-600 font-bold">₦{balance.toLocaleString()}</span></div>}
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
            <p>Thank you for choosing {COMPANY.name}. We appreciate your trust in our care.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
