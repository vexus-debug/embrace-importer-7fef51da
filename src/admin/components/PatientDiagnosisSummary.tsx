import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientDiagnosisSummary({ patientId }: { patientId: string }) {
  const [loading, setLoading] = useState(true);
  const [diag, setDiag] = useState<any | null>(null);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const [d, p] = await Promise.all([
        supabase.from("diagnoses").select("*").eq("patient_id", patientId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("treatment_plans").select("*").eq("patient_id", patientId).order("created_at", { ascending: false }),
      ]);
      if (!active) return;
      setDiag(d.data || null);
      setPlans(p.data || []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [patientId]);

  if (loading) return <Skeleton className="h-24 w-full" />;

  return (
    <div className="space-y-4 text-sm">
      <div>
        <h4 className="font-semibold mb-2">Latest Diagnosis</h4>
        {diag ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-muted/40 p-3 rounded">
            <div><span className="text-muted-foreground">Impression:</span> {diag.primary_diagnosis || "—"}</div>
            <div><span className="text-muted-foreground">Definite Diagnosis:</span> {diag.secondary_diagnosis || "—"}</div>
            <div className="md:col-span-2"><span className="text-muted-foreground">Notes:</span> {diag.diagnosis_notes || "—"}</div>
            <div className="md:col-span-2"><span className="text-muted-foreground">HPC:</span> {diag.hpc || "—"}</div>
            <div className="md:col-span-2"><span className="text-muted-foreground">Procedures:</span> {diag.tx_procedures || "—"}</div>
            <div><span className="text-muted-foreground">Medications:</span> {diag.tx_medications || "—"}</div>
            <div><span className="text-muted-foreground">Follow-up:</span> {diag.tx_followup_date || "—"}</div>
            <div className="md:col-span-2"><span className="text-muted-foreground">Instructions:</span> {diag.tx_instructions || "—"}</div>
            <div className="md:col-span-2 text-xs text-muted-foreground">Recorded {new Date(diag.created_at).toLocaleString()}</div>
          </div>
        ) : <p className="text-muted-foreground">No diagnosis recorded.</p>}
      </div>

      <div>
        <h4 className="font-semibold mb-2">Treatment Plans ({plans.length})</h4>
        {plans.length === 0 ? (
          <p className="text-muted-foreground">No treatment plans.</p>
        ) : (
          <div className="space-y-2">
            {plans.map(pl => {
              const procs = Array.isArray(pl.procedures) ? pl.procedures : [];
              return (
                <div key={pl.id} className="bg-muted/40 p-3 rounded">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{new Date(pl.created_at).toLocaleDateString()}</span>
                    <span className="font-semibold">₦{Number(pl.total_cost || 0).toLocaleString()}</span>
                  </div>
                  {procs.length === 0 ? (
                    <p className="text-muted-foreground text-xs">No procedures listed.</p>
                  ) : (
                    <ul className="list-disc list-inside text-xs space-y-1">
                      {procs.map((pr: any, i: number) => (
                        <li key={i}>
                          {pr.name || pr.procedure || "Procedure"}
                          {pr.tooth ? ` — Tooth ${pr.tooth}` : ""}
                          {pr.cost != null ? ` — ₦${Number(pr.cost).toLocaleString()}` : ""}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
