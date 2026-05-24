import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingBookButton from "./components/FloatingBookButton";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import TeamPage from "./pages/TeamPage";
import ReviewsPage from "./pages/ReviewsPage";
import ContactPage from "./pages/ContactPage";
import GalleryPage from "./pages/GalleryPage";
import NotFound from "./pages/NotFound";

// Service sub-pages
import PreventiveDentistryPage from "./pages/services/PreventiveDentistryPage";
import RestorativeDentistryPage from "./pages/services/RestorativeDentistryPage";
import CosmeticDentistryPage from "./pages/services/CosmeticDentistryPage";
import OrthodonticsPage from "./pages/services/OrthodonticsPage";
import PediatricDentistryPage from "./pages/services/PediatricDentistryPage";
import OralSurgeryPage from "./pages/services/OralSurgeryPage";
import PeriodonticsPage from "./pages/services/PeriodonticsPage";
import ProsthodonticsPage from "./pages/services/ProsthodonticsPage";
import EmergencyDentalServicesPage from "./pages/services/EmergencyDentalServicesPage";
import SedationDentistryPage from "./pages/services/SedationDentistryPage";

// Admin pages
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import PatientsPage from "./admin/pages/PatientsPage";
import AddPatientPage from "./admin/pages/AddPatientPage";
import PatientDetailPage from "./admin/pages/PatientDetailPage";
import DoctorDiagnosisPage from "./admin/pages/DoctorDiagnosisPage";
import AppointmentsPage from "./admin/pages/AppointmentsPage";
import DentalChartsPage from "./admin/pages/DentalChartsPage";
import TreatmentsPage from "./admin/pages/TreatmentsPage";
import BillingPage from "./admin/pages/BillingPage";
import ReportsPage from "./admin/pages/ReportsPage";
import InventoryPage from "./admin/pages/InventoryPage";
import StaffPage from "./admin/pages/StaffPage";
import MessagingPage from "./admin/pages/MessagingPage";
import NotificationsPage from "./admin/pages/NotificationsPage";
import SettingsPage from "./admin/pages/SettingsPage";
import TutorialsPage from "./admin/pages/TutorialsPage";
import AdminLoginPage from "./admin/pages/AdminLoginPage";
import ExpensesPage from "./admin/pages/ExpensesPage";
import InsurancePage from "./admin/pages/InsurancePage";
import ClinicalNotesPage from "./admin/pages/ClinicalNotesPage";
import ConsentFormsPage from "./admin/pages/ConsentFormsPage";
import AuditLogsPage from "./admin/pages/AuditLogsPage";
import DocumentsPage from "./admin/pages/DocumentsPage";
import ChairManagementPage from "./admin/pages/ChairManagementPage";
import PatientReviewsPage from "./admin/pages/PatientReviewsPage";
import BookAppointmentPage from "./pages/BookAppointmentPage";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public website routes */}
          <Route path="/" element={<><FloatingBookButton /><Index /></>} />
          <Route path="/about" element={<><FloatingBookButton /><AboutPage /></>} />
          <Route path="/services" element={<><FloatingBookButton /><ServicesPage /></>} />
          <Route path="/services/preventive-dentistry" element={<><FloatingBookButton /><PreventiveDentistryPage /></>} />
          <Route path="/services/restorative-dentistry" element={<><FloatingBookButton /><RestorativeDentistryPage /></>} />
          <Route path="/services/cosmetic-dentistry" element={<><FloatingBookButton /><CosmeticDentistryPage /></>} />
          <Route path="/services/orthodontics" element={<><FloatingBookButton /><OrthodonticsPage /></>} />
          <Route path="/services/pediatric-dentistry" element={<><FloatingBookButton /><PediatricDentistryPage /></>} />
          <Route path="/services/oral-surgery" element={<><FloatingBookButton /><OralSurgeryPage /></>} />
          <Route path="/services/periodontics" element={<><FloatingBookButton /><PeriodonticsPage /></>} />
          <Route path="/services/prosthodontics" element={<><FloatingBookButton /><ProsthodonticsPage /></>} />
          <Route path="/services/emergency-dental-services" element={<><FloatingBookButton /><EmergencyDentalServicesPage /></>} />
          <Route path="/services/sedation-dentistry" element={<><FloatingBookButton /><SedationDentistryPage /></>} />
          <Route path="/team" element={<><FloatingBookButton /><TeamPage /></>} />
          <Route path="/reviews" element={<><FloatingBookButton /><ReviewsPage /></>} />
          <Route path="/gallery" element={<><FloatingBookButton /><GalleryPage /></>} />
          <Route path="/contact" element={<><FloatingBookButton /><ContactPage /></>} />
          <Route path="/book-appointment" element={<BookAppointmentPage />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="patients/add" element={<AddPatientPage />} />
            <Route path="patients/:id" element={<PatientDetailPage />} />
            <Route path="diagnosis" element={<DoctorDiagnosisPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="dental-charts" element={<DentalChartsPage />} />
            <Route path="treatments" element={<TreatmentsPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="messaging" element={<MessagingPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="insurance" element={<InsurancePage />} />
            <Route path="clinical-notes" element={<ClinicalNotesPage />} />
            <Route path="consent-forms" element={<ConsentFormsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="chairs" element={<ChairManagementPage />} />
            <Route path="reviews" element={<PatientReviewsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="tutorials" element={<TutorialsPage />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
