import { HelpCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from "@/components/ui/dialog";

type HelpEntry = { title: string; summary: string; points: string[] };

const HELP: Record<string, HelpEntry> = {
  "/admin": {
    title: "Dashboard",
    summary: "Your clinic at a glance — today's activity, key stats, and quick actions.",
    points: [
      "See appointments, revenue, and patient counts for today",
      "Spot trends with charts and recent activity",
      "Jump quickly to common tasks like adding a patient or appointment",
    ],
  },
  "/admin/patients": {
    title: "Patients",
    summary: "The full patient directory.",
    points: [
      "Search, filter, and open any patient record",
      "View contact details, medical history, and visit history",
      "Add new patients or edit existing ones",
    ],
  },
  "/admin/patients/add": {
    title: "Add Patient",
    summary: "Register a new patient in the clinic.",
    points: [
      "Capture personal, contact, and medical info",
      "Saved patients become available everywhere (appointments, billing, charts)",
    ],
  },
  "/admin/appointments": {
    title: "Appointments",
    summary: "Manage the clinic's schedule.",
    points: [
      "Book, reschedule, or cancel appointments",
      "Filter by date, doctor, status, or patient",
      "Track scheduled, in-progress, completed, and cancelled visits",
    ],
  },
  "/admin/chairs": {
    title: "Chair Management",
    summary: "Visual schedule of every treatment chair for the day.",
    points: [
      "See which chair is booked at which time",
      "Avoid double-booking and balance chair utilization",
      "Color-coded by appointment status",
    ],
  },
  "/admin/treatments": {
    title: "Treatments",
    summary: "Catalog of services and treatment plans.",
    points: [
      "Manage treatment types, prices, and durations",
      "Reference treatments when creating appointments and invoices",
    ],
  },
  "/admin/dental-charts": {
    title: "Dental Charts",
    summary: "Tooth-by-tooth clinical records for each patient.",
    points: [
      "View and update conditions on the dental chart",
      "Track restorations, extractions, and ongoing work per tooth",
    ],
  },
  "/admin/diagnosis": {
    title: "Doctor Diagnosis",
    summary: "Record diagnoses and link them to treatment plans.",
    points: [
      "Add new diagnoses per patient",
      "Connect findings to recommended treatments",
    ],
  },
  "/admin/clinical-notes": {
    title: "Clinical Notes",
    summary: "Written notes from each patient visit.",
    points: [
      "Record SOAP-style notes and observations",
      "Attach notes to a patient and appointment",
    ],
  },
  "/admin/consent-forms": {
    title: "Consent Forms",
    summary: "Patient consent documents and signatures.",
    points: [
      "Track signed and pending consent forms",
      "Required before specific treatments",
    ],
  },
  "/admin/documents": {
    title: "Documents",
    summary: "Patient files: X-rays, scans, IDs, referrals.",
    points: [
      "Upload, preview, and download patient documents",
      "Organize by patient and document type",
    ],
  },
  "/admin/billing": {
    title: "Billing",
    summary: "Invoices and payments.",
    points: [
      "Generate invoices for treatments",
      "Record payments and track outstanding balances",
      "View invoice history per patient",
    ],
  },
  "/admin/insurance": {
    title: "Insurance",
    summary: "Insurance providers and patient claims.",
    points: [
      "Manage insurance provider list",
      "Track patient policies and submitted claims",
    ],
  },
  "/admin/expenses": {
    title: "Expenses",
    summary: "Clinic operating expenses.",
    points: [
      "Record costs by category (supplies, rent, salaries, etc.)",
      "Used in reports to calculate net revenue",
    ],
  },
  "/admin/inventory": {
    title: "Inventory",
    summary: "Stock of supplies, materials, and instruments.",
    points: [
      "Track quantities and reorder levels",
      "Get low-stock alerts in notifications",
    ],
  },
  "/admin/staff": {
    title: "Staff",
    summary: "Dentists, hygienists, and admin team.",
    points: [
      "Manage staff profiles, roles, and contact info",
      "Assign staff to appointments and treatments",
    ],
  },
  "/admin/messaging": {
    title: "Messaging",
    summary: "Internal and patient messages in one place.",
    points: [
      "Send messages to staff or patients",
      "Search conversations by contact",
    ],
  },
  "/admin/notifications": {
    title: "Notifications",
    summary: "System alerts for appointments, stock, payments, and lab orders.",
    points: [
      "Mark items as read or delete them",
      "Filter by category to focus on what matters",
    ],
  },
  "/admin/reviews": {
    title: "Patient Reviews",
    summary: "Feedback collected from patients.",
    points: [
      "See ratings and comments",
      "Make reviews public on the website or keep them private",
    ],
  },
  "/admin/reports": {
    title: "Reports",
    summary: "Performance analytics for the clinic.",
    points: [
      "Revenue, appointments, and treatment breakdowns",
      "Use to spot trends and make business decisions",
    ],
  },
  "/admin/audit-logs": {
    title: "Audit Logs",
    summary: "A record of who did what and when.",
    points: [
      "Track inserts, updates, and deletes across the system",
      "Use for compliance and investigating changes",
    ],
  },
  "/admin/tutorials": {
    title: "Tutorials",
    summary: "Guides and how-tos for using the admin panel.",
    points: ["Step-by-step walkthroughs for common workflows"],
  },
  "/admin/settings": {
    title: "Settings",
    summary: "Your profile and clinic configuration.",
    points: [
      "Update your name, email, and phone",
      "View clinic information",
    ],
  },
};

const DEFAULT_HELP: HelpEntry = {
  title: "Admin Panel",
  summary: "Use the sidebar to navigate. Each page has its own Help button explaining what it does.",
  points: [],
};

function getHelp(pathname: string): HelpEntry {
  if (HELP[pathname]) return HELP[pathname];
  // Match longest prefix
  const match = Object.keys(HELP)
    .filter((k) => pathname === k || pathname.startsWith(k + "/"))
    .sort((a, b) => b.length - a.length)[0];
  return match ? HELP[match] : DEFAULT_HELP;
}

export function HelpButton() {
  const { pathname } = useLocation();
  const help = getHelp(pathname);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Help for this page">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{help.title} — What this page does</DialogTitle>
          <DialogDescription>{help.summary}</DialogDescription>
        </DialogHeader>
        {help.points.length > 0 && (
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
            {help.points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
