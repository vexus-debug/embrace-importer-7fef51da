import { useMemo } from "react";
import { useInvoices, usePayments } from "@/hooks/useInvoices";
import { useExpenses } from "@/hooks/useExpenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const pieColors = ["hsl(186, 73%, 45%)", "hsl(232, 59%, 30%)", "hsl(40, 90%, 55%)", "hsl(187, 68%, 66%)", "hsl(190, 40%, 65%)"];

export default function ReportsPage() {
  const { data: invoices = [], isLoading: loadingInvoices } = useInvoices();
  const { data: payments = [], isLoading: loadingPayments } = usePayments();
  const { data: expenses = [], isLoading: loadingExpenses } = useExpenses();

  const totalRevenue = useMemo(() => payments.reduce((s, p) => s + Number(p.amount), 0), [payments]);
  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + Number(e.amount), 0), [expenses]);
  const netProfit = totalRevenue - totalExpenses;

  const revenueByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    invoices.forEach(inv => {
      const items = (inv.items as { description: string; amount: number }[] | null) || [];
      items.forEach(item => {
        const cat = item.description || "Other";
        categories[cat] = (categories[cat] || 0) + Number(item.amount);
      });
    });
    return Object.entries(categories).map(([category, revenue]) => ({ category, revenue })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [invoices]);

  const isLoading = loadingInvoices || loadingPayments || loadingExpenses;

  const stats = [
    { title: "Total Revenue", value: `₦${totalRevenue.toLocaleString()}`, icon: DollarSign, sub: "From all payments" },
    { title: "Expenses", value: `₦${totalExpenses.toLocaleString()}`, icon: TrendingDown, sub: `${((totalExpenses / (totalRevenue || 1)) * 100).toFixed(1)}% of revenue` },
    { title: "Net Profit", value: `₦${netProfit.toLocaleString()}`, icon: TrendingUp, sub: `${((netProfit / (totalRevenue || 1)) * 100).toFixed(1)}% margin` },
    { title: "Total Invoices", value: `${invoices.length}`, icon: Wallet, sub: `${invoices.filter(i => i.status === "paid").length} paid` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Reports & Revenue</h1>
        <p className="text-sm text-muted-foreground">Financial overview and revenue allocation</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.title} className="shadow-card">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.sub}</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-card">
              <CardHeader className="pb-2"><CardTitle className="text-base">Revenue by Service</CardTitle></CardHeader>
              <CardContent>
                {revenueByCategory.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No revenue data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={revenueByCategory} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(190, 25%, 85%)" />
                      <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                      <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} width={120} />
                      <Tooltip formatter={(val: number) => `₦${val.toLocaleString()}`} />
                      <Bar dataKey="revenue" fill="hsl(186, 73%, 45%)" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-2"><CardTitle className="text-base">Revenue Allocation</CardTitle></CardHeader>
              <CardContent>
                {revenueByCategory.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={revenueByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="revenue" paddingAngle={4}>
                        {revenueByCategory.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} />
                      <Tooltip formatter={(val: number) => `₦${val.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
