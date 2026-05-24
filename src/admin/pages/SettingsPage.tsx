import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  // Profile form
  const [profileForm, setProfileForm] = useState({ full_name: "", phone: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileForm({ full_name: profile.full_name || "", phone: "" });
    }
  }, [profile]);

  // Load phone from profiles table
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("phone").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data?.phone) setProfileForm(f => ({ ...f, phone: data.phone || "" }));
    });
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase.from("profiles").update({
        full_name: profileForm.full_name,
        phone: profileForm.phone || null,
      }).eq("user_id", user.id);
      if (error) throw error;
      toast({ title: "Profile updated" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setSavingProfile(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Clinic configuration and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="clinic">Clinic Info</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">My Profile</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Full Name</Label><Input value={profileForm.full_name} onChange={e => setProfileForm(f => ({ ...f, full_name: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Email</Label><Input value={user?.email || ""} disabled /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} placeholder="+971..." /></div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={savingProfile}>{savingProfile ? "Saving..." : "Update Profile"}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinic" className="mt-4">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Clinic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Clinic settings are managed by the system administrator. Contact support for changes.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Clinic Name</Label><Input defaultValue="Dbridge Dental Clinic" disabled /></div>
                <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+971 4 123 4567" disabled /></div>
                <div className="space-y-2"><Label>Working Hours (Weekdays)</Label><Input defaultValue="08:00 AM - 08:00 PM" disabled /></div>
                <div className="space-y-2"><Label>Working Hours (Weekend)</Label><Input defaultValue="09:00 AM - 05:00 PM" disabled /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
