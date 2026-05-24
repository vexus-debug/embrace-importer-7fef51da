import { useState } from "react";
import { usePatientReviews, useUpdateReview, useDeleteReview } from "@/hooks/usePatientReviews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, EyeOff, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useMemo } from "react";

export default function PatientReviewsPage() {
  const { data: reviews = [], isLoading } = usePatientReviews();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();
  const { toast } = useToast();

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);

  const togglePublic = async (id: string, current: boolean | null) => {
    await updateReview.mutateAsync({ id, is_public: !current });
    toast({ title: current ? "Review hidden" : "Review made public" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Patient Reviews</h1>
        <p className="text-sm text-muted-foreground">{reviews.length} reviews — Average: {avgRating} ★</p>
      </div>

      {isLoading ? <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div> : (
        <div className="space-y-4">
          {reviews.length === 0 && <Card className="shadow-card"><CardContent className="py-12 text-center text-muted-foreground">No reviews yet</CardContent></Card>}
          {reviews.map(r => (
            <Card key={r.id} className="shadow-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-semibold">{(r as any).patient?.name ?? "Anonymous"}</CardTitle>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={r.is_public ? "default" : "secondary"}>{r.is_public ? "Public" : "Private"}</Badge>
                    <span className="text-xs text-muted-foreground">{r.created_at.split("T")[0]}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {r.comment && <p className="text-sm mb-3">{r.comment}</p>}
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => togglePublic(r.id, r.is_public)}>
                    {r.is_public ? <><EyeOff className="h-3.5 w-3.5 mr-1" />Hide</> : <><Eye className="h-3.5 w-3.5 mr-1" />Make Public</>}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteReview.mutate(r.id)}><Trash2 className="h-3.5 w-3.5 mr-1" />Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
