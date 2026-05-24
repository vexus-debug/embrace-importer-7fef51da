import { useState } from "react";
import { useInventory, useCreateInventoryItem, useUpdateInventoryItem } from "@/hooks/useInventory";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search, AlertTriangle, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function InventoryPage() {
  const { data: inventory = [], isLoading } = useInventory();
  const createItem = useCreateInventoryItem();
  const updateItem = useUpdateInventoryItem();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", unit: "", quantity: "", min_stock: "", supplier: "" });

  const handleSave = async () => {
    if (!form.name) { toast({ title: "Name is required", variant: "destructive" }); return; }
    try {
      await createItem.mutateAsync({
        name: form.name,
        category: form.category || null,
        unit: form.unit || null,
        quantity: Number(form.quantity) || 0,
        min_stock: Number(form.min_stock) || 0,
        supplier: form.supplier || null,
      });
      toast({ title: "Item added" });
      setDialogOpen(false);
      setForm({ name: "", category: "", unit: "", quantity: "", min_stock: "", supplier: "" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleRestock = async (id: string, currentQty: number) => {
    try {
      await updateItem.mutateAsync({
        id,
        quantity: currentQty + 50,
        last_restocked: new Date().toISOString().split("T")[0],
      });
      toast({ title: "Item restocked" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const filtered = inventory.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) || (i.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Inventory</h1>
          <p className="text-sm text-muted-foreground">{inventory.length} items tracked</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Item</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Name</Label><Input placeholder="Item name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Category</Label><Input placeholder="e.g. PPE" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Unit</Label><Input placeholder="e.g. pcs" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Quantity</Label><Input type="number" placeholder="0" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Min Stock</Label><Input type="number" placeholder="0" value={form.min_stock} onChange={e => setForm(f => ({ ...f, min_stock: e.target.value }))} /></div>
              </div>
              <div className="space-y-2"><Label>Supplier</Label><Input placeholder="Supplier name" value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} /></div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={createItem.isPending}>{createItem.isPending ? "Saving..." : "Save"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search inventory..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Item</TableHead><TableHead>Category</TableHead><TableHead>Qty</TableHead>
                <TableHead className="hidden md:table-cell">Min Stock</TableHead><TableHead className="hidden lg:table-cell">Supplier</TableHead>
                <TableHead className="hidden md:table-cell">Last Restocked</TableHead><TableHead className="w-24" />
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map((item) => {
                  const isLow = item.quantity <= item.min_stock;
                  return (
                    <TableRow key={item.id} className={isLow ? "bg-red-50" : ""}>
                      <TableCell className="font-medium">
                        {item.name}
                        {isLow && <Badge variant="destructive" className="ml-2 text-[10px]"><AlertTriangle className="h-3 w-3 mr-1" />Low</Badge>}
                      </TableCell>
                      <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                      <TableCell className={`font-semibold ${isLow ? "text-destructive" : ""}`}>{item.quantity} {item.unit}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.min_stock}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{item.supplier}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{item.last_restocked}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleRestock(item.id, item.quantity)}>
                          <RefreshCw className="h-3 w-3 mr-1" />Restock
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No items found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
