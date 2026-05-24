import { useAuditLogs } from "@/hooks/useAuditLogs";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield } from "lucide-react";

const actionColors: Record<string, string> = { INSERT: "bg-emerald-100 text-emerald-700", UPDATE: "bg-blue-100 text-blue-700", DELETE: "bg-red-100 text-red-700" };

export default function AuditLogsPage() {
  const { data: logs = [], isLoading } = useAuditLogs(200);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold flex items-center gap-2"><Shield className="h-6 w-6 text-primary" />Audit Logs</h1>
        <p className="text-sm text-muted-foreground">Track who viewed/edited what and when</p>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          {isLoading ? <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div> : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Time</TableHead><TableHead>Action</TableHead><TableHead>Table</TableHead>
                <TableHead>Record ID</TableHead><TableHead>User ID</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</TableCell>
                    <TableCell><Badge className={actionColors[log.action] || ""} variant="secondary">{log.action}</Badge></TableCell>
                    <TableCell className="font-medium text-sm">{log.table_name}</TableCell>
                    <TableCell className="text-xs font-mono">{log.record_id?.substring(0, 8) ?? "—"}</TableCell>
                    <TableCell className="text-xs font-mono">{log.user_id?.substring(0, 8) ?? "system"}</TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No audit logs yet</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
