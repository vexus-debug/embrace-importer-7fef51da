// ==================== TYPES ====================
export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  address: string;
  allergies: string[];
  medicalHistory: string[];
  emergencyContact: { name: string; phone: string; relation: string };
  referralSource: string;
  status: "active" | "inactive";
  lastVisit: string;
  createdAt: string;
}

export interface Staff {
  id: string;
  name: string;
  role: "admin" | "dentist" | "receptionist" | "hygienist" | "assistant" | "accountant";
  specialty?: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  avatar?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  dentistId: string;
  dentistName: string;
  chair: string;
  date: string;
  time: string;
  treatmentType: string;
  status: "scheduled" | "completed" | "cancelled";
  isWalkIn: boolean;
  notes?: string;
}

export interface Treatment {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number; // minutes
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  patientName: string;
  procedures: { treatmentId: string; treatmentName: string; status: "pending" | "completed"; cost: number }[];
  totalCost: number;
  createdAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  medications: { name: string; dosage: string; frequency: string; duration: string }[];
  notes?: string;
  createdAt: string;
  dentistName: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  items: { description: string; amount: number }[];
  discount: number;
  total: number;
  status: "pending" | "paid" | "partial" | "overdue";
  payments: Payment[];
  createdAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  method: "cash" | "card" | "transfer";
  date: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  supplier: string;
  minStock: number;
  lastRestocked: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

export interface Notification {
  id: string;
  type: "appointment" | "low_stock" | "payment" | "lab_order";
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

export interface ToothRecord {
  id: string;
  toothNumber: number;
  procedure: string;
  status: "healthy" | "decayed" | "treated" | "missing";
  dentistName: string;
  date: string;
  notes?: string;
}

// ==================== MOCK DATA ====================

export const mockPatients: Patient[] = [
  { id: "P001", name: "Ahmed Al-Rashid", phone: "+971 50 123 4567", email: "ahmed@email.com", dob: "1985-03-15", gender: "Male", bloodGroup: "A+", address: "123 Main St, Dubai", allergies: ["Penicillin"], medicalHistory: ["Diabetes Type 2"], emergencyContact: { name: "Fatima Al-Rashid", phone: "+971 50 987 6543", relation: "Wife" }, referralSource: "Google", status: "active", lastVisit: "2026-02-05", createdAt: "2024-06-10" },
  { id: "P002", name: "Sara Johnson", phone: "+971 55 234 5678", email: "sara@email.com", dob: "1992-07-22", gender: "Female", bloodGroup: "O-", address: "45 Palm Ave, Abu Dhabi", allergies: [], medicalHistory: [], emergencyContact: { name: "Mark Johnson", phone: "+971 55 876 5432", relation: "Husband" }, referralSource: "Referral", status: "active", lastVisit: "2026-02-08", createdAt: "2025-01-15" },
  { id: "P003", name: "Mohammed Hassan", phone: "+971 52 345 6789", email: "mohammed@email.com", dob: "1978-11-30", gender: "Male", bloodGroup: "B+", address: "78 Creek Rd, Sharjah", allergies: ["Latex", "Aspirin"], medicalHistory: ["Hypertension"], emergencyContact: { name: "Aisha Hassan", phone: "+971 52 765 4321", relation: "Sister" }, referralSource: "Walk-in", status: "active", lastVisit: "2026-01-28", createdAt: "2023-09-20" },
  { id: "P004", name: "Emily Chen", phone: "+971 56 456 7890", email: "emily@email.com", dob: "2000-05-14", gender: "Female", bloodGroup: "AB+", address: "12 Marina Walk, Dubai", allergies: [], medicalHistory: [], emergencyContact: { name: "David Chen", phone: "+971 56 654 3210", relation: "Father" }, referralSource: "Instagram", status: "active", lastVisit: "2026-02-10", createdAt: "2025-08-01" },
  { id: "P005", name: "Omar Al-Farsi", phone: "+971 54 567 8901", email: "omar@email.com", dob: "1965-09-08", gender: "Male", bloodGroup: "O+", address: "90 Corniche Rd, Ajman", allergies: ["Ibuprofen"], medicalHistory: ["Heart Disease", "Diabetes Type 2"], emergencyContact: { name: "Layla Al-Farsi", phone: "+971 54 543 2109", relation: "Daughter" }, referralSource: "Referral", status: "inactive", lastVisit: "2025-11-15", createdAt: "2022-03-05" },
  { id: "P006", name: "Priya Sharma", phone: "+971 58 678 9012", email: "priya@email.com", dob: "1990-01-25", gender: "Female", bloodGroup: "A-", address: "34 JBR, Dubai", allergies: [], medicalHistory: ["Asthma"], emergencyContact: { name: "Raj Sharma", phone: "+971 58 432 1098", relation: "Husband" }, referralSource: "Google", status: "active", lastVisit: "2026-02-09", createdAt: "2024-11-20" },
];

export const mockStaff: Staff[] = [
  { id: "S001", name: "Dr. Khalid Ibrahim", role: "dentist", specialty: "Orthodontics", phone: "+971 50 111 2222", email: "khalid@clinic.com", status: "active" },
  { id: "S002", name: "Dr. Nadia Al-Sayed", role: "dentist", specialty: "Cosmetic Dentistry", phone: "+971 50 333 4444", email: "nadia@clinic.com", status: "active" },
  { id: "S003", name: "Dr. James Wilson", role: "dentist", specialty: "Oral Surgery", phone: "+971 50 555 6666", email: "james@clinic.com", status: "active" },
  { id: "S004", name: "Mariam Al-Hashimi", role: "receptionist", phone: "+971 50 777 8888", email: "mariam@clinic.com", status: "active" },
  { id: "S005", name: "Rania Farouk", role: "hygienist", specialty: "Periodontics", phone: "+971 50 999 0000", email: "rania@clinic.com", status: "active" },
  { id: "S006", name: "Ali Mahmoud", role: "assistant", phone: "+971 50 222 3333", email: "ali@clinic.com", status: "active" },
  { id: "S007", name: "Fatima Al-Khatib", role: "accountant", phone: "+971 50 444 5555", email: "fatima@clinic.com", status: "active" },
  { id: "S008", name: "Admin User", role: "admin", phone: "+971 50 666 7777", email: "admin@clinic.com", status: "active" },
];

export const mockAppointments: Appointment[] = [
  { id: "A001", patientId: "P001", patientName: "Ahmed Al-Rashid", dentistId: "S001", dentistName: "Dr. Khalid Ibrahim", chair: "Chair 1", date: "2026-02-11", time: "09:00", treatmentType: "Orthodontic Checkup", status: "scheduled", isWalkIn: false },
  { id: "A002", patientId: "P002", patientName: "Sara Johnson", dentistId: "S002", dentistName: "Dr. Nadia Al-Sayed", chair: "Chair 2", date: "2026-02-11", time: "09:30", treatmentType: "Teeth Whitening", status: "scheduled", isWalkIn: false },
  { id: "A003", patientId: "P004", patientName: "Emily Chen", dentistId: "S001", dentistName: "Dr. Khalid Ibrahim", chair: "Chair 1", date: "2026-02-11", time: "10:30", treatmentType: "Braces Adjustment", status: "scheduled", isWalkIn: false },
  { id: "A004", patientId: "P003", patientName: "Mohammed Hassan", dentistId: "S003", dentistName: "Dr. James Wilson", chair: "Chair 3", date: "2026-02-11", time: "11:00", treatmentType: "Root Canal", status: "scheduled", isWalkIn: true },
  { id: "A005", patientId: "P006", patientName: "Priya Sharma", dentistId: "S002", dentistName: "Dr. Nadia Al-Sayed", chair: "Chair 2", date: "2026-02-11", time: "14:00", treatmentType: "Dental Veneer Consultation", status: "scheduled", isWalkIn: false },
  { id: "A006", patientId: "P001", patientName: "Ahmed Al-Rashid", dentistId: "S001", dentistName: "Dr. Khalid Ibrahim", chair: "Chair 1", date: "2026-02-05", time: "10:00", treatmentType: "Orthodontic Checkup", status: "completed", isWalkIn: false },
  { id: "A007", patientId: "P005", patientName: "Omar Al-Farsi", dentistId: "S003", dentistName: "Dr. James Wilson", chair: "Chair 3", date: "2026-02-03", time: "09:00", treatmentType: "Extraction", status: "completed", isWalkIn: false },
  { id: "A008", patientId: "P002", patientName: "Sara Johnson", dentistId: "S002", dentistName: "Dr. Nadia Al-Sayed", chair: "Chair 2", date: "2026-02-01", time: "15:00", treatmentType: "Cleaning", status: "cancelled", isWalkIn: false },
];

export const mockTreatments: Treatment[] = [
  { id: "T001", name: "Dental Cleaning", category: "Preventive", price: 300, duration: 30 },
  { id: "T002", name: "Teeth Whitening", category: "Cosmetic", price: 1500, duration: 60 },
  { id: "T003", name: "Root Canal", category: "Restorative", price: 2500, duration: 90 },
  { id: "T004", name: "Dental Crown", category: "Restorative", price: 3000, duration: 60 },
  { id: "T005", name: "Braces Adjustment", category: "Orthodontics", price: 500, duration: 30 },
  { id: "T006", name: "Tooth Extraction", category: "Oral Surgery", price: 800, duration: 45 },
  { id: "T007", name: "Dental Implant", category: "Prosthodontics", price: 8000, duration: 120 },
  { id: "T008", name: "Veneer", category: "Cosmetic", price: 2000, duration: 60 },
  { id: "T009", name: "Filling", category: "Restorative", price: 400, duration: 30 },
  { id: "T010", name: "Fluoride Treatment", category: "Preventive", price: 200, duration: 15 },
];

export const mockTreatmentPlans: TreatmentPlan[] = [
  { id: "TP001", patientId: "P001", patientName: "Ahmed Al-Rashid", procedures: [{ treatmentId: "T005", treatmentName: "Braces Adjustment", status: "completed", cost: 500 }, { treatmentId: "T001", treatmentName: "Dental Cleaning", status: "pending", cost: 300 }], totalCost: 800, createdAt: "2026-01-10" },
  { id: "TP002", patientId: "P003", patientName: "Mohammed Hassan", procedures: [{ treatmentId: "T003", treatmentName: "Root Canal", status: "pending", cost: 2500 }, { treatmentId: "T004", treatmentName: "Dental Crown", status: "pending", cost: 3000 }], totalCost: 5500, createdAt: "2026-02-01" },
];

export const mockPrescriptions: Prescription[] = [
  { id: "RX001", patientId: "P003", patientName: "Mohammed Hassan", medications: [{ name: "Amoxicillin", dosage: "500mg", frequency: "3x daily", duration: "7 days" }, { name: "Ibuprofen", dosage: "400mg", frequency: "As needed", duration: "5 days" }], notes: "Take after meals", createdAt: "2026-02-03", dentistName: "Dr. James Wilson" },
  { id: "RX002", patientId: "P005", patientName: "Omar Al-Farsi", medications: [{ name: "Clindamycin", dosage: "300mg", frequency: "4x daily", duration: "5 days" }], notes: "Allergic to Ibuprofen — use Paracetamol for pain", createdAt: "2026-02-03", dentistName: "Dr. James Wilson" },
];

export const mockInvoices: Invoice[] = [
  { id: "INV001", invoiceNumber: "INV-2026-001", patientId: "P001", patientName: "Ahmed Al-Rashid", items: [{ description: "Orthodontic Checkup", amount: 500 }, { description: "Braces Adjustment", amount: 500 }], discount: 100, total: 900, status: "paid", payments: [{ id: "PAY001", amount: 900, method: "card", date: "2026-02-05", notes: "" }], createdAt: "2026-02-05" },
  { id: "INV002", invoiceNumber: "INV-2026-002", patientId: "P003", patientName: "Mohammed Hassan", items: [{ description: "Root Canal", amount: 2500 }], discount: 0, total: 2500, status: "partial", payments: [{ id: "PAY002", amount: 1000, method: "cash", date: "2026-02-03", notes: "First installment" }], createdAt: "2026-02-03" },
  { id: "INV003", invoiceNumber: "INV-2026-003", patientId: "P006", patientName: "Priya Sharma", items: [{ description: "Dental Cleaning", amount: 300 }, { description: "Fluoride Treatment", amount: 200 }], discount: 50, total: 450, status: "pending", payments: [], createdAt: "2026-02-09" },
  { id: "INV004", invoiceNumber: "INV-2026-004", patientId: "P005", patientName: "Omar Al-Farsi", items: [{ description: "Tooth Extraction", amount: 800 }], discount: 0, total: 800, status: "overdue", payments: [], createdAt: "2025-12-15" },
];

export const mockInventory: InventoryItem[] = [
  { id: "IT001", name: "Disposable Gloves", category: "PPE", quantity: 500, unit: "pairs", supplier: "MedSupply Co.", minStock: 100, lastRestocked: "2026-02-01" },
  { id: "IT002", name: "Dental Mirrors", category: "Instruments", quantity: 25, unit: "pcs", supplier: "DentalPro", minStock: 10, lastRestocked: "2026-01-15" },
  { id: "IT003", name: "Composite Resin", category: "Materials", quantity: 8, unit: "syringes", supplier: "3M Dental", minStock: 10, lastRestocked: "2026-01-20" },
  { id: "IT004", name: "Anesthetic Cartridges", category: "Medication", quantity: 45, unit: "pcs", supplier: "Septodont", minStock: 20, lastRestocked: "2026-02-05" },
  { id: "IT005", name: "Face Masks", category: "PPE", quantity: 3, unit: "boxes", supplier: "MedSupply Co.", minStock: 5, lastRestocked: "2026-01-10" },
  { id: "IT006", name: "Impression Material", category: "Materials", quantity: 12, unit: "packs", supplier: "Zhermack", minStock: 5, lastRestocked: "2026-02-08" },
  { id: "IT007", name: "Sterilization Pouches", category: "PPE", quantity: 200, unit: "pcs", supplier: "MedSupply Co.", minStock: 50, lastRestocked: "2026-01-25" },
];

export const mockNotifications: Notification[] = [
  { id: "N001", type: "appointment", title: "New Appointment", message: "Sara Johnson booked for Teeth Whitening at 09:30", read: false, timestamp: "2026-02-11T08:00:00" },
  { id: "N002", type: "low_stock", title: "Low Stock Alert", message: "Face Masks below minimum stock (3/5 boxes)", read: false, timestamp: "2026-02-11T07:30:00" },
  { id: "N003", type: "low_stock", title: "Low Stock Alert", message: "Composite Resin below minimum stock (8/10 syringes)", read: false, timestamp: "2026-02-11T07:30:00" },
  { id: "N004", type: "payment", title: "Payment Received", message: "AED 1,000 received from Mohammed Hassan (INV-2026-002)", read: true, timestamp: "2026-02-10T16:00:00" },
  { id: "N005", type: "appointment", title: "Appointment Completed", message: "Ahmed Al-Rashid's orthodontic checkup completed", read: true, timestamp: "2026-02-05T11:00:00" },
];

export const mockMessages: Message[] = [
  { id: "M001", senderId: "S004", senderName: "Mariam Al-Hashimi", receiverId: "S001", receiverName: "Dr. Khalid Ibrahim", content: "Dr. Khalid, your 10:30 patient Emily Chen has arrived.", timestamp: "2026-02-11T10:25:00", read: true },
  { id: "M002", senderId: "S001", senderName: "Dr. Khalid Ibrahim", receiverId: "S004", receiverName: "Mariam Al-Hashimi", content: "Thank you Mariam, please send her to Chair 1.", timestamp: "2026-02-11T10:26:00", read: true },
  { id: "M003", senderId: "S007", senderName: "Fatima Al-Khatib", receiverId: "S008", receiverName: "Admin User", content: "Monthly revenue report is ready for review.", timestamp: "2026-02-10T15:00:00", read: false },
  { id: "M004", senderId: "S005", senderName: "Rania Farouk", receiverId: "S001", receiverName: "Dr. Khalid Ibrahim", content: "Patient P003 needs a follow-up scaling appointment.", timestamp: "2026-02-09T14:30:00", read: true },
];

export const mockToothRecords: ToothRecord[] = [
  { id: "TR001", toothNumber: 14, procedure: "Filling", status: "treated", dentistName: "Dr. Khalid Ibrahim", date: "2025-06-15", notes: "Composite filling placed" },
  { id: "TR002", toothNumber: 36, procedure: "Root Canal", status: "treated", dentistName: "Dr. James Wilson", date: "2025-09-20", notes: "Three canals treated" },
  { id: "TR003", toothNumber: 18, procedure: "Extraction", status: "missing", dentistName: "Dr. James Wilson", date: "2024-03-10", notes: "Wisdom tooth removed" },
  { id: "TR004", toothNumber: 21, procedure: "Veneer", status: "treated", dentistName: "Dr. Nadia Al-Sayed", date: "2025-12-01", notes: "Porcelain veneer" },
  { id: "TR005", toothNumber: 46, procedure: "Decay detected", status: "decayed", dentistName: "Dr. Khalid Ibrahim", date: "2026-02-05", notes: "Needs filling — scheduled" },
];

// Dashboard stats
export const dashboardStats = {
  totalPatients: 1248,
  todayAppointments: 5,
  monthlyRevenue: 145600,
  pendingInvoices: 12,
  patientChange: 8.2,
  appointmentChange: -2.1,
  revenueChange: 12.5,
  invoiceChange: -5.3,
};

export const monthlyPatientData = [
  { month: "Sep", patients: 85 }, { month: "Oct", patients: 102 }, { month: "Nov", patients: 95 },
  { month: "Dec", patients: 78 }, { month: "Jan", patients: 115 }, { month: "Feb", patients: 48 },
];

export const revenueExpenseData = [
  { name: "Revenue", value: 145600, fill: "hsl(186, 73%, 45%)" },
  { name: "Expenses", value: 52300, fill: "hsl(232, 59%, 30%)" },
];

export const recentActivity = [
  { id: 1, action: "New patient registered", detail: "Emily Chen", time: "10 min ago", type: "patient" as const },
  { id: 2, action: "Appointment completed", detail: "Ahmed Al-Rashid — Orthodontic Checkup", time: "1 hour ago", type: "appointment" as const },
  { id: 3, action: "Payment received", detail: "AED 1,000 from Mohammed Hassan", time: "3 hours ago", type: "payment" as const },
  { id: 4, action: "Low stock alert", detail: "Face Masks below threshold", time: "5 hours ago", type: "inventory" as const },
  { id: 5, action: "Invoice created", detail: "INV-2026-003 for Priya Sharma", time: "Yesterday", type: "invoice" as const },
];
