import {
  Users, CalendarDays, DollarSign, FileText, Activity, Clock, Plus, UserPlus, Receipt,
  CalendarClock, TrendingUp, ArrowUpRight, ArrowDownRight, Play, Zap, Package, AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CustomTooltip } from "@/admin/components/CustomTooltip";
import { usePatients } from "@/hooks/usePatients";
import { useAppointments, useUpdateAppointment } from "@/hooks/useAppointments";
import { useInvoices, usePayments } from "@/hooks/useInvoices";
import { useExpenses } from "@/hooks/useExpenses";
import { useInventory } from "@/hooks/useInventory";
import { useAuth } from "@/contexts/AuthContext";
import VisitWorkflow from "@/admin/components/VisitWorkflow";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { useMemo, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const CHART_COLORS = [
  "hsl(186, 73%, 45%)",
  "hsl(232, 59%, 30%)",
  "hsl(40, 90%, 55%)",
  "hsl(187, 68%, 66%)",
  "hsl(190, 40%, 50%)",
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  "in-progress": "bg-amber-100 text-amber-700",
};

export default function AdminDashboard() {
  const { data: patients = [], isLoading: loadingPatients } = usePatients();
  const { data: appointments = [], isLoading: loadingAppts } = useAppointments();
  const { data: invoices = [], isLoading: loadingInvoices } = useInvoices();
  const { data: payments = [] } = usePayments();
  const { data: expenses = [] } = useExpenses();
  const { data: inventory = [] } = useInventory();
  const { profile, roles } = useAuth();
  const updateAppointment = useUpdateAppointment();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chartView, setChartView] = useState<"bar" | "area">("area");
  const [visitOpen, setVisitOpen] = useState(false);
  const [visitPatientId, setVisitPatientId] = useState<string | undefined>();
  const [visitAppointmentId, setVisitAppointmentId] = useState<string | undefined>();

  const userRole = roles[0] || "admin";
  if (userRole && userRole !== "admin") {
    if (userRole === "receptionist") return <Navigate to="/admin/appointments" replace />;
    if (userRole === "accountant") return <Navigate to="/admin/billing" replace />;
    return <Navigate to="/admin/appointments" replace />;
  }
  const displayName = profile?.full_name || "Doctor";
  const today = format(new Date(), "yyyy-MM-dd");

  const todayAppointments = useMemo(
    () => appointments.filter((a) => a.date === today).sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, today]
  );

  const scheduledToday = todayAppointments.filter(a => a.status === "scheduled");
  const completedToday = todayAppointments.filter(a => a.status === "completed").length;

  const monthlyRevenue = useMemo(() => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    return payments
      .filter((p) => new Date(p.date) >= start && new Date(p.date) <= end)
      .reduce((sum, p) => sum + Number(p.amount), 0);
  }, [payments]);

  const pendingInvoices = useMemo(
    () => invoices.filter((i) => i.status === "pending" || i.status === "overdue").length,
    [invoices]
  );

  const overdueInvoices = useMemo(
    () => invoices.filter((i) => i.status === "overdue").length,
    [invoices]
  );

  const activePatients = useMemo(
    () => patients.filter((p) => p.status === "active").length,
    [patients]
  );

  const lowStockItems = useMemo(
    () => inventory.filter((item: any) => item.quantity <= item.min_stock),
    [inventory]
  );

  const monthlyPatientData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(new Date(), i);
      const label = format(d, "MMM");
      const start = startOfMonth(d);
      const end = endOfMonth(d);
      const count = patients.filter((p) => {
        const created = new Date(p.created_at);
        return created >= start && created <= end;
      }).length;
      months.push({ month: label, patients: count });
    }
    return months;
  }, [patients]);

  const monthlyExpenses = useMemo(() => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    return expenses
      .filter((e) => new Date(e.date) >= start && new Date(e.date) <= end)
      .reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses]);

  const revenueExpenseData = [
    { name: "Revenue", value: monthlyRevenue, fill: CHART_COLORS[0] },
    { name: "Expenses", value: monthlyExpenses, fill: CHART_COLORS[1] },
    { name: "Profit", value: monthlyRevenue - monthlyExpenses, fill: CHART_COLORS[3] },
  ];

  const isLoading = loadingPatients || loadingAppts || loadingInvoices;

  const handleStartVisit = (appointmentId?: string, patientId?: string) => {
    setVisitPatientId(patientId);
    setVisitAppointmentId(appointmentId);
    setVisitOpen(true);
  };

  const handleQuickStatus = async (id: string, status: string) => {
    try {
      await updateAppointment.mutateAsync({ id, status });
      toast({ title: `Appointment ${status}` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Role-based stat cards
  const statCards = [
    ...(["admin", "receptionist", "dentist", "hygienist"].includes(userRole) ? [{
      title: "Total Patients",
      value: patients.length.toLocaleString(),
      sub: `${activePatients} active`,
      icon: Users,
      color: "from-[hsl(186,73%,45%)] to-[hsl(187,68%,66%)]",
      iconBg: "bg-[hsl(186,73%,45%)]/10 text-[hsl(186,73%,45%)]",
      onClick: () => navigate("/admin/patients"),
    }] : []),
    {
      title: "Today's Appointments",
      value: todayAppointments.length.toString(),
      sub: `${completedToday} completed, ${scheduledToday.length} pending`,
      icon: CalendarDays,
      color: "from-[hsl(232,59%,30%)] to-[hsl(232,59%,45%)]",
      iconBg: "bg-[hsl(232,59%,30%)]/10 text-[hsl(232,59%,30%)]",
      onClick: () => navigate("/admin/appointments"),
    },
    ...(["admin", "receptionist", "accountant"].includes(userRole) ? [{
      title: "Monthly Revenue",
      value: formatNaira(monthlyRevenue),
      sub: `${formatNaira(monthlyExpenses)} expenses`,
      icon: TrendingUp,
      color: "from-[hsl(142,76%,36%)] to-[hsl(142,71%,45%)]",
      iconBg: "bg-emerald-500/10 text-emerald-600",
      onClick: () => navigate("/admin/billing"),
    }] : []),
    ...(["admin", "receptionist", "accountant"].includes(userRole) ? [{
      title: "Pending Invoices",
      value: pendingInvoices.toString(),
      sub: `${overdueInvoices} overdue`,
      icon: FileText,
      color: "from-[hsl(40,90%,55%)] to-[hsl(30,90%,55%)]",
      iconBg: "bg-amber-500/10 text-amber-600",
      onClick: () => navigate("/admin/billing"),
    }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Visit Workflow Dialog */}
      <VisitWorkflow
        open={visitOpen}
        onOpenChange={setVisitOpen}
        prefillPatientId={visitPatientId}
        prefillAppointmentId={visitAppointmentId}
      />

      {/* Welcome Header + Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground tracking-tight">
            {getGreeting()}, {displayName.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {format(new Date(), "EEEE, MMMM d, yyyy")} — {scheduledToday.length} patients waiting
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" className="gap-1.5 rounded-full shadow-sm" onClick={() => handleStartVisit()}>
            <Play className="h-3.5 w-3.5" /> Start Visit
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 rounded-full" onClick={() => navigate("/admin/appointments")}>
            <Plus className="h-3.5 w-3.5" /> Appointment
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 rounded-full" onClick={() => navigate("/admin/patients/add")}>
            <UserPlus className="h-3.5 w-3.5" /> Patient
          </Button>
          {["admin", "receptionist", "accountant"].includes(userRole) && (
            <Button size="sm" variant="outline" className="gap-1.5 rounded-full" onClick={() => navigate("/admin/billing")}>
              <Receipt className="h-3.5 w-3.5" /> Invoice
            </Button>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            onClick={stat.onClick}
            className="group relative overflow-hidden rounded-2xl bg-card border border-border/40 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.iconBg)}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.title}</p>
            <p className="text-[11px] text-muted-foreground/70 mt-1">{stat.sub}</p>
            <div className={cn("absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity", stat.color)} />
          </div>
        ))}
      </div>

      {/* Today's Schedule with Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 rounded-2xl border-border/40 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              Today's Schedule
            </CardTitle>
            {todayAppointments.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {completedToday}/{todayAppointments.length} done
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-0">
            {todayAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
                  <CalendarDays className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No appointments today</p>
                <Button variant="link" size="sm" className="mt-2" onClick={() => handleStartVisit()}>
                  Start a walk-in visit
                </Button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-muted/30 group"
                  >
                    <div className="shrink-0">
                      <p className="text-sm font-bold text-primary">{apt.time}</p>
                      <p className="text-[10px] text-muted-foreground">{apt.chair || "—"}</p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {apt.patient?.name ?? "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {apt.treatment_type || "General"} — {apt.dentist?.name ?? "Unassigned"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant="secondary" className={cn("text-[10px]", statusColors[apt.status] || "")}>
                        {apt.status}
                      </Badge>
                      {apt.status === "scheduled" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs gap-1 text-primary hover:text-primary"
                          onClick={() => handleStartVisit(apt.id, apt.patient_id)}
                        >
                          <Play className="h-3 w-3" /> Start
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerts & Quick Actions Panel */}
        <Card className="rounded-2xl border-border/40 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Alerts & Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Pending invoices alert */}
            {pendingInvoices > 0 && (
              <button onClick={() => navigate("/admin/billing")} className="w-full flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 hover:bg-amber-500/10 transition-colors text-left">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Receipt className="h-4 w-4 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{pendingInvoices} pending invoices</p>
                  <p className="text-[11px] text-muted-foreground">{overdueInvoices > 0 ? `${overdueInvoices} overdue` : "Collect payments"}</p>
                </div>
              </button>
            )}

            {/* Low stock alert */}
            {lowStockItems.length > 0 && (
              <button onClick={() => navigate("/admin/inventory")} className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors text-left">
                <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                  <Package className="h-4 w-4 text-red-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{lowStockItems.length} low stock items</p>
                  <p className="text-[11px] text-muted-foreground">Restock needed</p>
                </div>
              </button>
            )}

            {/* Quick action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1 text-xs" onClick={() => handleStartVisit()}>
                <Play className="h-4 w-4 text-primary" />
                Walk-in
              </Button>
              <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1 text-xs" onClick={() => navigate("/admin/appointments")}>
                <CalendarDays className="h-4 w-4 text-primary" />
                Book Apt
              </Button>
              <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1 text-xs" onClick={() => navigate("/admin/patients/add")}>
                <UserPlus className="h-4 w-4 text-primary" />
                New Patient
              </Button>
              <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1 text-xs" onClick={() => navigate("/admin/billing")}>
                <Receipt className="h-4 w-4 text-primary" />
                Invoice
              </Button>
            </div>

            {/* Daily stats */}
            <div className="pt-2 border-t space-y-2">
              {[
                { label: "Active Patients", value: `${activePatients}`, icon: Users },
                { label: "Completed Today", value: `${completedToday}`, icon: Activity },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 rounded-2xl border-border/40 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-foreground">Patient Growth</CardTitle>
            <div className="flex bg-muted rounded-full p-0.5 gap-0.5">
              <button
                onClick={() => setChartView("area")}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-full transition-all",
                  chartView === "area" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                Area
              </button>
              <button
                onClick={() => setChartView("bar")}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-full transition-all",
                  chartView === "bar" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                Bar
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              {chartView === "area" ? (
                <AreaChart data={monthlyPatientData}>
                  <defs>
                    <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(186, 73%, 45%)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(186, 73%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(190, 25%, 85%)" strokeOpacity={0.4} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Area type="monotone" dataKey="patients" stroke="hsl(186, 73%, 45%)" strokeWidth={2.5} fill="url(#patientGradient)" />
                  <CustomTooltip />
                </AreaChart>
              ) : (
                <BarChart data={monthlyPatientData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(186, 73%, 45%)" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(187, 68%, 66%)" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(190, 25%, 85%)" strokeOpacity={0.4} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="patients" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                  <CustomTooltip />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Donut */}
        <Card className="rounded-2xl border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={revenueExpenseData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {revenueExpenseData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => (
                    <span className="text-xs text-muted-foreground">{value}</span>
                  )}
                />
                <CustomTooltip prefix="₦" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingBottom: 36 }}>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Revenue</p>
                <p className="text-lg font-bold text-foreground">{formatNaira(monthlyRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
