import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Stethoscope, Calendar, Receipt, FileText, Image as ImageIcon, ClipboardList, Pill, ShieldCheck, FileSignature } from "lucide-react";
import PatientDentalChart from "@/admin/components/PatientDentalChart";

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<any>(null);
  const [data, setData] = useState<{
    diagnoses: any[]; plans: any[]; appointments: any[]; invoices: any[]; payments: any[];
    notes: any[]; prescriptions: any[]; documents: any[]; images: any[]; toothRecords: any[];
    consents: any[]; insurance: any[];
  }>({ diagnoses: [], plans: [], appointments: [], invoices: [], payments: [], notes: [], prescriptions: [], documents: [], images: [], toothRecords: [], consents: [], insurance: [] });
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      setLoading(true);
      const [pRes, diag, plans, appts, invs, notes, presc, docs, imgs, teeth, consents, ins] = await Promise.all([
        supabase.from("patients").select("*").eq("id", id).maybeSingle(),
        supabase.from("diagnoses").select("*").eq("patient_id", id).order("created_at", { ascending: false }),
        supabase.from("treatment_plans").select("*").eq("patient_id", id).order("created_at", { ascending: false }),
        supabase.from("appointments").select("*, dentist:staff(name)").eq("patient_id", id).order("date", { ascending: false }),
        supabase.from("invoices").select("*").eq("patient_id", id).order("created_at", { ascending: false }),
        supabase.from("clinical_notes").select("*, dentist:staff(name)").eq("patient_id", id).order("created_at", { ascending: false }),
        supabase.from("prescriptions").select("*, dentist:staff(name)").eq("patient_id", id).order("created_at", { ascending: false }),
        supabase.from("documents").select("*").eq("patient_id", id).order("created_at", { ascending: false }),
        supabase.from("patient_images").select("*").eq("patient_id", id).order("created_at", { ascending: false }),
        supabase.from("tooth_records").select("*").eq("patient_id", id).order("date", { ascending: false }),
        supabase.from("consent_forms").select("*").eq("patient_id", id).order("created_at", { ascending: false }),
        supabase.from("patient_insurance").select("*, provider:insurance_providers(name)").eq("patient_id", id).order("created_at", { ascending: false }),
      ]);

      const invoiceIds = (invs.data || []).map(i => i.id);
      let pays: any[] = [];
      if (invoiceIds.length) {
        const { data: pd } = await supabase.from("payments").select("*").in("invoice_id", invoiceIds).order("date", { ascending: false });
        pays = pd || [];
      }

      // Sign image urls
      const urlMap: Record<string, string> = {};
      await Promise.all((imgs.data || []).map(async (im: any) => {
        if (im.image_url && !im.image_url.startsWith("http")) {
          const { data: sd } = await supabase.storage.from("patient-images").createSignedUrl(im.image_url, 3600);
          if (sd?.signedUrl) urlMap[im.id] = sd.signedUrl;
        } else if (im.image_url) {
          urlMap[im.id] = im.image_url;
        }
      }));

      if (!active) return;
      setPatient(pRes.data);
      setData({
        diagnoses: diag.data || [], plans: plans.data || [], appointments: appts.data || [],
        invoices: invs.data || [], payments: pays, notes: notes.data || [], prescriptions: presc.data || [],
        documents: docs.data || [], images: imgs.data || [], toothRecords: teeth.data || [],
        consents: consents.data || [], insurance: ins.data || [],
      });
      setImageUrls(urlMap);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-96 w-full" /></div>;
  }

  if (!patient) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Patient not found.</p>
        <Button onClick={() => navigate("/admin/patients")}><ArrowLeft className="h-4 w-4 mr-2" />Back to Patients</Button>
      </div>
    );
  }

  const totalInvoiced = data.invoices.reduce((s, i) => s + Number(i.total || 0), 0);
  const totalPaid = data.payments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const balance = totalInvoiced - totalPaid;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/patients")}><ArrowLeft className="h-4 w-4 mr-1" />Back</Button>
          <div>
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
              {patient.name}
              <Badge variant={patient.status === "active" ? "default" : "secondary"}>{patient.status}</Badge>
            </h1>
            <p className="text-sm text-muted-foreground font-mono">{patient.serial_number || "—"}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="px-3 py-2 rounded-md bg-muted/60"><p className="text-[10px] text-muted-foreground uppercase">Invoiced</p><p className="font-bold">₦{totalInvoiced.toLocaleString()}</p></div>
          <div className="px-3 py-2 rounded-md bg-emerald-50 dark:bg-emerald-950/30"><p className="text-[10px] text-muted-foreground uppercase">Paid</p><p className="font-bold text-emerald-700">₦{totalPaid.toLocaleString()}</p></div>
          <div className="px-3 py-2 rounded-md bg-red-50 dark:bg-red-950/30"><p className="text-[10px] text-muted-foreground uppercase">Balance</p><p className="font-bold text-red-700">₦{balance.toLocaleString()}</p></div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="overview"><User className="h-3.5 w-3.5 mr-1" />Overview</TabsTrigger>
          <TabsTrigger value="diagnosis"><Stethoscope className="h-3.5 w-3.5 mr-1" />Diagnosis & Plans</TabsTrigger>
          <TabsTrigger value="appointments"><Calendar className="h-3.5 w-3.5 mr-1" />Appointments</TabsTrigger>
          <TabsTrigger value="billing"><Receipt className="h-3.5 w-3.5 mr-1" />Billing</TabsTrigger>
          <TabsTrigger value="notes"><ClipboardList className="h-3.5 w-3.5 mr-1" />Clinical Notes</TabsTrigger>
          <TabsTrigger value="prescriptions"><Pill className="h-3.5 w-3.5 mr-1" />Prescriptions</TabsTrigger>
          <TabsTrigger value="images"><ImageIcon className="h-3.5 w-3.5 mr-1" />Images</TabsTrigger>
          <TabsTrigger value="documents"><FileText className="h-3.5 w-3.5 mr-1" />Documents</TabsTrigger>
          <TabsTrigger value="chart"><Stethoscope className="h-3.5 w-3.5 mr-1" />Dental Chart</TabsTrigger>
          <TabsTrigger value="consents"><FileSignature className="h-3.5 w-3.5 mr-1" />Consents</TabsTrigger>
          <TabsTrigger value="insurance"><ShieldCheck className="h-3.5 w-3.5 mr-1" />Insurance</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <Card><CardHeader><CardTitle className="text-base">Patient Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <Info label="DOB" value={patient.dob} />
              <Info label="Gender" value={patient.gender} />
              <Info label="Blood Group" value={patient.blood_group} />
              <Info label="Phone" value={patient.phone} />
              <Info label="Email" value={patient.email} />
              <Info label="Referral" value={patient.referral_source} />
              <Info label="Address" value={patient.address} className="md:col-span-3" />
              <Info label="Allergies" value={(patient.allergies || []).join(", ") || "None"} className="md:col-span-3" />
              <Info label="Medical History" value={(patient.medical_history || []).join(", ") || "None"} className="md:col-span-3" />
              <Info label="Emergency Contact" value={`${patient.emergency_contact?.name || "—"} (${patient.emergency_contact?.relation || "—"}) ${patient.emergency_contact?.phone || ""}`} className="md:col-span-3" />
              <Info label="Last Visit" value={patient.last_visit} />
              <Info label="Created" value={new Date(patient.created_at).toLocaleDateString()} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diagnosis */}
        <TabsContent value="diagnosis" className="space-y-4">
          <Card><CardHeader><CardTitle className="text-base">Diagnoses ({data.diagnoses.length})</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {data.diagnoses.length === 0 ? <Empty text="No diagnoses recorded." /> : data.diagnoses.map(d => (
                <div key={d.id} className="bg-muted/40 rounded p-3 space-y-1 text-sm">
                  <div className="flex justify-between text-xs text-muted-foreground"><span>{new Date(d.created_at).toLocaleString()}</span></div>
                  <Row label="Impression" value={d.primary_diagnosis} />
                  <Row label="Definite Diagnosis" value={d.secondary_diagnosis} />
                  <Row label="HPC" value={d.hpc} />
                  <Row label="Notes" value={d.diagnosis_notes} />
                  <Row label="Procedures" value={d.tx_procedures} />
                  <Row label="Medications" value={d.tx_medications} />
                  <Row label="Follow-up" value={d.tx_followup_date} />
                  <Row label="Instructions" value={d.tx_instructions} />
                  <Row label="Investigations" value={d.investigations_notes} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-base">Treatment Plans ({data.plans.length})</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {data.plans.length === 0 ? <Empty text="No treatment plans." /> : data.plans.map(pl => {
                const procs = Array.isArray(pl.procedures) ? pl.procedures : [];
                return (
                  <div key={pl.id} className="bg-muted/40 rounded p-3 text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-muted-foreground">{new Date(pl.created_at).toLocaleDateString()}</span>
                      <span className="font-bold">₦{Number(pl.total_cost || 0).toLocaleString()}</span>
                    </div>
                    {procs.length === 0 ? <p className="text-xs text-muted-foreground">No procedures.</p> :
                      <ul className="list-disc list-inside text-xs space-y-0.5">
                        {procs.map((p: any, i: number) => <li key={i}>{p.name || p.treatmentName || "Procedure"}{p.tooth ? ` — Tooth ${p.tooth}` : ""}{p.cost != null ? ` — ₦${Number(p.cost).toLocaleString()}` : ""}{p.status ? ` (${p.status})` : ""}</li>)}
                      </ul>}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments */}
        <TabsContent value="appointments">
          <Card><CardContent className="pt-6">
            {data.appointments.length === 0 ? <Empty text="No appointments." /> :
              <div className="space-y-2 text-sm">
                {data.appointments.map(a => (
                  <div key={a.id} className="flex flex-wrap justify-between gap-2 p-2 rounded bg-muted/40">
                    <span>{a.date} {a.time?.slice(0, 5)}</span>
                    <span>{a.treatment_type || "—"}</span>
                    <span>{a.dentist?.name || "—"}</span>
                    <Badge variant="outline">{a.status}</Badge>
                  </div>
                ))}
              </div>}
          </CardContent></Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-4">
          <Card><CardHeader><CardTitle className="text-base">Invoices</CardTitle></CardHeader>
            <CardContent>{data.invoices.length === 0 ? <Empty text="No invoices." /> :
              <div className="space-y-2 text-sm">
                {data.invoices.map(i => (
                  <div key={i.id} className="flex justify-between p-2 rounded bg-muted/40">
                    <span className="font-mono">{i.invoice_number}</span>
                    <span>{i.created_at.split("T")[0]}</span>
                    <span className="font-bold">₦{Number(i.total || 0).toLocaleString()}</span>
                    <Badge variant={i.status === "paid" ? "default" : "outline"}>{i.status}</Badge>
                  </div>
                ))}
              </div>}
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-base">Payments</CardTitle></CardHeader>
            <CardContent>{data.payments.length === 0 ? <Empty text="No payments." /> :
              <div className="space-y-2 text-sm">
                {data.payments.map(p => (
                  <div key={p.id} className="flex justify-between p-2 rounded bg-muted/40">
                    <span>{p.date}</span>
                    <span>{p.method}</span>
                    <span className="font-bold text-emerald-700">₦{Number(p.amount || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clinical Notes */}
        <TabsContent value="notes"><Card><CardContent className="pt-6 space-y-3">
          {data.notes.length === 0 ? <Empty text="No clinical notes." /> : data.notes.map(n => (
            <div key={n.id} className="bg-muted/40 rounded p-3 text-sm">
              <div className="text-xs text-muted-foreground mb-2">{new Date(n.created_at).toLocaleString()} · {n.dentist?.name || "—"}</div>
              <Row label="Subjective" value={n.subjective} />
              <Row label="Objective" value={n.objective} />
              <Row label="Assessment" value={n.assessment} />
              <Row label="Plan" value={n.plan} />
            </div>
          ))}
        </CardContent></Card></TabsContent>

        {/* Prescriptions */}
        <TabsContent value="prescriptions"><Card><CardContent className="pt-6 space-y-3">
          {data.prescriptions.length === 0 ? <Empty text="No prescriptions." /> : data.prescriptions.map(p => {
            const meds = Array.isArray(p.medications) ? p.medications : [];
            return (
              <div key={p.id} className="bg-muted/40 rounded p-3 text-sm">
                <div className="text-xs text-muted-foreground mb-2">{new Date(p.created_at).toLocaleString()} · {p.dentist?.name || "—"}</div>
                {meds.length === 0 ? <p className="text-xs text-muted-foreground">No medications.</p> :
                  <ul className="list-disc list-inside text-xs space-y-0.5">
                    {meds.map((m: any, i: number) => <li key={i}>{m.name} {m.dosage ? `— ${m.dosage}` : ""} {m.frequency ? `· ${m.frequency}` : ""} {m.duration ? `· ${m.duration}` : ""}</li>)}
                  </ul>}
                {p.notes && <p className="mt-2 text-xs">{p.notes}</p>}
              </div>
            );
          })}
        </CardContent></Card></TabsContent>

        {/* Images */}
        <TabsContent value="images"><Card><CardContent className="pt-6">
          {data.images.length === 0 ? <Empty text="No images uploaded." /> :
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {data.images.map(im => (
                <a key={im.id} href={imageUrls[im.id]} target="_blank" rel="noreferrer" className="group block">
                  <div className="aspect-square bg-muted rounded overflow-hidden">
                    {imageUrls[im.id] ? (
                      <img src={imageUrls[im.id]} alt={im.image_type} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ImageIcon className="h-6 w-6 text-muted-foreground" /></div>
                    )}
                  </div>
                  <div className="text-xs mt-1">
                    <Badge variant="outline" className="text-[10px]">{im.image_type}</Badge>
                    {im.tooth_number && <span className="ml-1 text-muted-foreground">Tooth {im.tooth_number}</span>}
                    {im.notes && <p className="text-muted-foreground line-clamp-2 mt-0.5">{im.notes}</p>}
                  </div>
                </a>
              ))}
            </div>}
        </CardContent></Card></TabsContent>

        {/* Documents */}
        <TabsContent value="documents"><Card><CardContent className="pt-6">
          {data.documents.length === 0 ? <Empty text="No documents." /> :
            <div className="space-y-2 text-sm">
              {data.documents.map(d => (
                <div key={d.id} className="flex justify-between p-2 rounded bg-muted/40">
                  <span>{d.name}</span>
                  <Badge variant="outline">{d.category}</Badge>
                  <a href={d.file_url} target="_blank" rel="noreferrer" className="text-primary text-xs">Open</a>
                </div>
              ))}
            </div>}
        </CardContent></Card></TabsContent>

        {/* Dental Chart */}
        <TabsContent value="chart"><Card><CardContent className="pt-6">
          <PatientDentalChart patientId={patient.id} />
          {data.toothRecords.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold text-sm">Tooth Record History</h4>
              {data.toothRecords.map(t => (
                <div key={t.id} className="flex justify-between p-2 rounded bg-muted/40 text-sm">
                  <span>Tooth {t.tooth_number}</span>
                  <span>{t.procedure || "—"}</span>
                  <Badge variant="outline">{t.status}</Badge>
                  <span className="text-xs text-muted-foreground">{t.date}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent></Card></TabsContent>

        {/* Consents */}
        <TabsContent value="consents"><Card><CardContent className="pt-6 space-y-2">
          {data.consents.length === 0 ? <Empty text="No consent forms." /> : data.consents.map(c => (
            <div key={c.id} className="flex justify-between p-2 rounded bg-muted/40 text-sm">
              <span>{c.form_type}</span>
              <span className="text-xs text-muted-foreground">{c.signed_at ? `Signed ${new Date(c.signed_at).toLocaleDateString()}` : "Pending"}</span>
              {c.witness_name && <span className="text-xs">Witness: {c.witness_name}</span>}
            </div>
          ))}
        </CardContent></Card></TabsContent>

        {/* Insurance */}
        <TabsContent value="insurance"><Card><CardContent className="pt-6 space-y-2">
          {data.insurance.length === 0 ? <Empty text="No insurance on file." /> : data.insurance.map(ins => (
            <div key={ins.id} className="p-3 rounded bg-muted/40 text-sm space-y-1">
              <div className="flex justify-between"><strong>{ins.provider?.name || "—"}</strong><span className="text-xs">{ins.policy_number}</span></div>
              <div className="text-xs text-muted-foreground">Group: {ins.group_number || "—"} · Subscriber: {ins.subscriber_name || "—"} ({ins.relationship})</div>
              <div className="text-xs text-muted-foreground">Valid: {ins.valid_from || "—"} → {ins.valid_to || "—"}</div>
            </div>
          ))}
        </CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}

function Info({ label, value, className = "" }: { label: string; value: any; className?: string }) {
  return <div className={className}><span className="text-muted-foreground">{label}:</span> <strong>{value || "—"}</strong></div>;
}
function Row({ label, value }: { label: string; value: any }) {
  if (!value) return null;
  return <div><span className="text-muted-foreground text-xs">{label}:</span> <span className="whitespace-pre-wrap">{value}</span></div>;
}
function Empty({ text }: { text: string }) {
  return <p className="text-sm text-muted-foreground text-center py-6">{text}</p>;
}
