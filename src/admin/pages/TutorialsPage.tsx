import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Users, CalendarDays, Stethoscope, Receipt, Package, MessageSquare, Settings } from "lucide-react";

const tutorials = [
  { icon: Users, title: "Patient Management", content: "Navigate to the Patients page from the sidebar. Click 'Add Patient' to register a new patient with their personal details, medical history, allergies, and emergency contact. Use the search bar and filters to find existing patients. Click the actions menu (⋯) to view profiles, edit details, or manage patient records." },
  { icon: CalendarDays, title: "Booking Appointments", content: "Go to the Appointments page and click 'Book Appointment'. Select the patient, assign a dentist and chair, choose the date/time, and specify the treatment type. Toggle 'Walk-in' for unscheduled patients. Use the status tabs to filter appointments by their current state (Scheduled, Completed, Cancelled)." },
  { icon: Stethoscope, title: "Dental Charts & Treatments", content: "The Dental Charts page provides an interactive tooth diagram per patient. Click any tooth to view its history or log a new procedure. The Treatments page has three tabs: Treatment Catalog for managing available procedures, Treatment Plans for patient-specific multi-procedure plans, and Prescriptions for medication management." },
  { icon: Receipt, title: "Billing & Invoices", content: "Create invoices from the Billing page by clicking 'Create Invoice'. Add line items from treatments, apply discounts, and track payment status. Use the payment dialog (💲 icon) to record payments by cash, card, or transfer. Filter invoices by status: Pending, Paid, Partial, or Overdue." },
  { icon: Package, title: "Inventory Management", content: "Track dental supplies in the Inventory page. Items below their minimum stock threshold are highlighted in red with a 'Low' warning badge. Click 'Restock' to update quantities. Add new items with their category, unit, supplier, and minimum stock level." },
  { icon: MessageSquare, title: "Internal Messaging", content: "Use the Messaging page to communicate with staff members. Select a contact from the sidebar to open a conversation. Type messages and press Enter or click the send button. Unread message counts are shown as badges on contact names." },
  { icon: Settings, title: "Settings & Configuration", content: "The Settings page has three tabs: Clinic Info for updating clinic details and working hours, Notification Preferences for configuring email and in-app alerts per event type, and My Profile for managing your personal account details." },
];

export default function TutorialsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Tutorials & Guide</h1>
        <p className="text-sm text-muted-foreground">Learn how to use each module of the management system</p>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <Accordion type="multiple" className="w-full">
            {tutorials.map((t, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <t.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-semibold">{t.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pl-12">
                  {t.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
