import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/integrations/supabase/client";

export interface InvoiceItem { date: string; treatment: string; dentist: string; price: number; }
export interface InvoicePdfData {
  invoice_number: string;
  created_at: string;
  status: string;
  total: number;
  discount: number;
  paid: number;
  items: InvoiceItem[];
  patient: { name: string; phone?: string | null; email?: string | null; address?: string | null } | null;
}

const COMPANY = {
  name: "Dbridge Dental Clinic",
  address: "123 Dental Avenue, Lagos, Nigeria",
  phone: "+234 800 123 4567",
  email: "info@dbridgedental.com",
  website: "www.dbridgedental.com",
};

export function buildInvoicePdf(inv: InvoicePdfData): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  let y = 15;

  // Header
  doc.setFillColor(14, 165, 233);
  doc.rect(0, 0, pageW, 6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(14, 116, 144);
  doc.text(COMPANY.name, 14, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(COMPANY.address, 14, y + 11);
  doc.text(`${COMPANY.phone}  |  ${COMPANY.email}`, 14, y + 16);
  doc.text(COMPANY.website, 14, y + 21);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(14, 116, 144);
  doc.text("INVOICE", pageW - 14, y + 6, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(`#${inv.invoice_number}`, pageW - 14, y + 12, { align: "right" });
  doc.text(`Date: ${inv.created_at.split("T")[0]}`, pageW - 14, y + 17, { align: "right" });
  doc.text(`Status: ${inv.status.toUpperCase()}`, pageW - 14, y + 22, { align: "right" });

  y += 30;
  doc.setDrawColor(14, 165, 233);
  doc.setLineWidth(0.5);
  doc.line(14, y, pageW - 14, y);
  y += 6;

  // Bill To
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.text("BILL TO", 14, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text(inv.patient?.name || "—", 14, y);
  y += 5;
  doc.setFontSize(9);
  doc.setTextColor(80);
  if (inv.patient?.phone) { doc.text(inv.patient.phone, 14, y); y += 4; }
  if (inv.patient?.email) { doc.text(inv.patient.email, 14, y); y += 4; }
  if (inv.patient?.address) { doc.text(inv.patient.address, 14, y); y += 4; }
  y += 4;

  // Items table
  autoTable(doc, {
    startY: y,
    head: [["#", "Date", "Treatment", "Dentist", "Price (NGN)"]],
    body: inv.items.map((it, i) => [
      String(i + 1),
      it.date || "",
      it.treatment || "",
      it.dentist || "",
      Number(it.price || 0).toLocaleString(),
    ]),
    styles: { fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: [14, 165, 233], textColor: 255, fontStyle: "bold" },
    columnStyles: { 0: { cellWidth: 10 }, 4: { halign: "right" } },
    margin: { left: 14, right: 14 },
  });

  // @ts-ignore
  y = (doc as any).lastAutoTable.finalY + 6;

  // Totals
  const subtotal = inv.items.reduce((s, i) => s + (Number(i.price) || 0), 0);
  const totalsX = pageW - 14;
  doc.setFontSize(10);
  doc.setTextColor(40);
  doc.setFont("helvetica", "normal");
  doc.text(`Subtotal: NGN ${subtotal.toLocaleString()}`, totalsX, y, { align: "right" });
  y += 5;
  if (inv.discount > 0) {
    doc.setTextColor(180, 0, 0);
    doc.text(`Discount: -NGN ${inv.discount.toLocaleString()}`, totalsX, y, { align: "right" });
    y += 5;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(14, 116, 144);
  doc.text(`Total: NGN ${inv.total.toLocaleString()}`, totalsX, y, { align: "right" });
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(4, 120, 87);
  doc.text(`Paid: NGN ${inv.paid.toLocaleString()}`, totalsX, y, { align: "right" });
  y += 5;
  const balance = inv.total - inv.paid;
  if (balance > 0) {
    doc.setTextColor(180, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`Balance Due: NGN ${balance.toLocaleString()}`, totalsX, y, { align: "right" });
  } else {
    doc.setTextColor(4, 120, 87);
    doc.setFont("helvetica", "bold");
    doc.text("Fully Paid", totalsX, y, { align: "right" });
  }

  // Footer
  const pageH = doc.internal.pageSize.getHeight();
  doc.setDrawColor(200);
  doc.line(14, pageH - 20, pageW - 14, pageH - 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(`Thank you for choosing ${COMPANY.name}. We appreciate your trust in our care.`, pageW / 2, pageH - 14, { align: "center" });
  doc.text(`${COMPANY.address}  |  ${COMPANY.phone}  |  ${COMPANY.email}`, pageW / 2, pageH - 10, { align: "center" });

  return doc;
}

/** Upload PDF blob to documents bucket, return signed URL valid 7 days. */
export async function uploadInvoicePdf(inv: InvoicePdfData): Promise<{ url: string; path: string }> {
  const doc = buildInvoicePdf(inv);
  const blob = doc.output("blob");
  const path = `invoices/${inv.invoice_number}-${Date.now()}.pdf`;
  const { error } = await supabase.storage.from("documents").upload(path, blob, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage.from("documents").createSignedUrl(path, 60 * 60 * 24 * 7);
  if (signErr || !data) throw signErr || new Error("Failed to create signed URL");
  return { url: data.signedUrl, path };
}

export function downloadInvoicePdf(inv: InvoicePdfData) {
  const doc = buildInvoicePdf(inv);
  doc.save(`${inv.invoice_number}.pdf`);
}
