import { useState } from "react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, useDeleteNotification } from "@/hooks/useNotifications";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CalendarDays, Package, DollarSign, FlaskConical, Check, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const typeIcons: Record<string, typeof Bell> = {
  appointment: CalendarDays,
  low_stock: Package,
  payment: DollarSign,
  lab_order: FlaskConical,
};

const typeColors: Record<string, string> = {
  appointment: "bg-blue-100 text-blue-600",
  low_stock: "bg-amber-100 text-amber-600",
  payment: "bg-emerald-100 text-emerald-600",
  lab_order: "bg-purple-100 text-purple-600",
};

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();
  const { toast } = useToast();

  const [tab, setTab] = useState("all");

  const filtered = tab === "all" ? notifications : tab === "unread" ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === tab);

  const handleMarkAllRead = async () => {
    try {
      await markAllRead.mutateAsync();
      toast({ title: "All marked as read" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">{notifications.filter(n => !n.read).length} unread</p>
        </div>
        <Button variant="outline" onClick={handleMarkAllRead} disabled={markAllRead.isPending}>
          Mark all as read
        </Button>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : (
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="appointment">Appointments</TabsTrigger>
                <TabsTrigger value="low_stock">Stock</TabsTrigger>
                <TabsTrigger value="payment">Payments</TabsTrigger>
              </TabsList>
              <TabsContent value={tab} className="mt-4 space-y-2">
                {filtered.length === 0 && (
                  <p className="text-sm text-muted-foreground py-8 text-center">No notifications</p>
                )}
                {filtered.map((n) => {
                  const Icon = typeIcons[n.type] || Bell;
                  return (
                    <div key={n.id} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${n.read ? "bg-background" : "bg-muted/50"}`}>
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${typeColors[n.type] || "bg-muted"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${n.read ? "" : "font-semibold"}`}>{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.message}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {!n.read && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => markRead.mutate(n.id)}>
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteNotification.mutate(n.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
