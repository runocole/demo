import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Search, Plus, Filter, Trash2, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import {
  getTools,
  createTool,
  updateTool,
  deleteTool,
} from "../services/api";

// --- TYPES ---
interface Tool {
  id: string;
  name: string;
  code: string;
  cost: string;
  stock: number;
  description?: string; 
  supplier?: string;
  category?: string;
  invoice_number?: string;
  date_added?: string;
}

          
// --- CONSTANTS ---
const CATEGORY_OPTIONS = [
  "Receiver",
  "Accessory",
  "Total Station",
  "Level",
  "Drones",
  "Ecosounder",
  "Laser Scanner",
];

const SUPPLIER_OPTIONS = [
  "COMNAV TECHNOLOGY",
  "GINTEC",
  "AMAZE MULTILINKS",
  "HARRYMORE",
  "LEICA SYSTEMS",
  "GEOSYSTEMS LTD",
  "LEICA GHANA", 
  "QUEST",
  "ADA SWISS-SURVEY",
  "IVY ZENGYU",
  "FOIF",
  "SANGRAO HAODI",
];

// --- COMPONENT ---
const Tools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog and form states
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingToolId, setEditingToolId] = useState<string | null>(null);

  // Search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // Form model
 const [form, setForm] = useState({
  name: "",
  code: "",
  cost: "",
  stock: "1",
  description: "",
  supplier: "",
  category: "",
  invoice_number: "",
});

  // Fetch tools
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const data = await getTools();
        const normalized: Tool[] = data.map((t: any) => ({
          ...t,
          stock: typeof t.stock === "number" ? t.stock : Number(t.stock || 0),
          category: t.category || "",
        }));
        setTools(normalized);
      } catch (error) {
        console.error("Error fetching tools:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  // --- Helpers ---
  const resetForm = () =>
setForm({
  name: "",
  code: "",
  cost: "",
  stock: "1",
  description: "",
  supplier: "",
  category: "",
  invoice_number: "",
});


  const openAddModal = () => {
    resetForm();
    setIsEditMode(false);
    setEditingToolId(null);
    setOpen(true);
  };

  const openEditModal = (tool: Tool) => {
  setForm({
  name: "",
  code: "",
  cost: "",
  stock: "1",
  description: "",
  supplier: "",
  category: "",
  invoice_number: "",
});

    setIsEditMode(true);
    setEditingToolId(tool.id);
    setOpen(true);
  };

  // --- Add or Update tool ---
  const handleSaveTool = async () => {
    if (!form.name.trim() || !form.code.trim() || !form.cost.trim()) {
      alert("Please fill in required fields: Name, Code, Cost.");
      return;
    }

    const parsedStock = Math.max(0, Number(form.stock) || 0);
    const payload = {
      name: form.name.trim(),
      code: form.code.trim(),
      cost: form.cost.trim(),
      stock: parsedStock,
      description: form.description.trim(),
      supplier: form.supplier.trim(),
      category: form.category,
      invoice_number: form.invoice_number.trim(),
      date_added: new Date().toISOString(),
    };

    if (isEditMode && editingToolId) {
      try {
        const updated = await updateTool(editingToolId, payload);
        setTools((prev) => prev.map((t) => (t.id === editingToolId ? updated : t)));
        setOpen(false);
        resetForm();
        setIsEditMode(false);
        setEditingToolId(null);
      } catch (err) {
        console.error("Error updating tool:", err);
        alert("Failed to update tool.");
      }
      return;
    }

    try {
      const existing = tools.find(
        (t) => t.code.toLowerCase() === form.code.trim().toLowerCase()
      );
      if (existing) {
        const newStock = (existing.stock || 0) + parsedStock;
        const updated = await updateTool(existing.id, { stock: newStock });
        setTools((prev) => prev.map((t) => (t.id === existing.id ? updated : t)));
        alert(`Tool "${existing.code}" already exists. Quantity increased by ${parsedStock}.`);
      } else {
        const created = await createTool(payload);
        const normalizedCreated: Tool = {
          ...created,
          stock: typeof created.stock === "number" ? created.stock : Number(created.stock || parsedStock),
          category: created.category || form.category,
        };
        setTools((prev) => [normalizedCreated, ...prev]);
      }
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving tool:", error);
      alert("Failed to save tool.");
    }
  };

  // Delete tool
  const handleDeleteTool = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this tool?")) return;
    try {
      await deleteTool(id);
      setTools((prev) => prev.filter((tool) => tool.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete tool");
    }
  };

  // --- Filtering & Search ---
  const filteredTools = tools.filter((t) => {
    const matchesCategory =
      categoryFilter === "all" ||
      !categoryFilter ||
      (t.category || "").toLowerCase() === categoryFilter.toLowerCase();
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // --- Stock Summary ---
  const totalTools = tools.length;
  const totalStock = tools.reduce((acc, t) => acc + (t.stock || 0), 0);
  const lowStock = tools.filter((t) => (t.stock || 0) <= 5).length;

  if (loading) return <p className="p-6 text-gray-400">Loading tools...</p>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
            <p className="text-gray-500">Manage your equipment records and details</p>
          </div>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={openAddModal}>
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search tools by name, code or description..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 items-center">
            <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORY_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
              }}
            >
              <Filter className="h-4 w-4" /> Reset
            </Button>
          </div>
        </div>

        {/* Stock Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Total Tools</p>
              <h3 className="text-2xl font-bold">{totalTools}</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Items in Stock</p>
              <h3 className="text-2xl font-bold">{totalStock}</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Low Stock (≤5)</p>
              <h3 className="text-2xl font-bold">{lowStock}</h3>
            </CardContent>
          </Card>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{tool.name}</h3>
                    <p className="text-sm text-gray-400">
                      {tool.code} • {tool.category || "Uncategorized"}
                    </p>
                    <p className="text-xs text-gray-500">
  Added: {tool.date_added ? new Date(tool.date_added).toLocaleDateString() : "—"}
</p>
<p className="text-xs text-gray-500">
  Invoice: {tool.invoice_number || "—"}
</p>

                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(tool)}
                      className="text-slate-400 hover:bg-slate-700"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTool(tool.id)}
                      className="text-red-600 hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-400">Description</p>
                    <p className="text-sm font-medium">{tool.description || "—"}</p>
                    <p className="text-xs text-gray-400 mt-2">Supplier</p>
                    <p className="text-sm">{tool.supplier || "—"}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400">Cost</p>
                    <p className="text-sm font-bold text-blue-400">${tool.cost}</p>

                    <p className="text-xs text-gray-400 mt-3">Stock</p>
                    <div
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        tool.stock <= 5
                          ? "bg-amber-600/20 text-amber-300"
                          : "bg-green-600/10 text-green-300"
                      }`}
                    >
                      {tool.stock}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add/Edit Tool Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Tool" : "Add New Item"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Item name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Serial Number</Label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="e.g. TL-001"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(val) => setForm({ ...form, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label>Cost</Label>
                <Input
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: e.target.value })}
                  placeholder="100.00"
                />
              </div>
              <div>
                <Label>Stock</Label>
                <Input
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="1"
                />
              </div>
              <div>
                <Label>Supplier</Label>
                <Select
                  value={form.supplier}
                  onValueChange={(val) => setForm({ ...form, supplier: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPLIER_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
  <div>
    <Label>Box Type</Label>
    <Select
      value={form.description}
      onValueChange={(val) => setForm({ ...form, description: val })}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select box type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Base">Base</SelectItem>
        <SelectItem value="Rover">Rover</SelectItem>
        <SelectItem value="Base and Rover">Base and Rover</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <div>
    <Label>Invoice Number</Label>
    <Input
      value={form.invoice_number}
      onChange={(e) =>
        setForm({ ...form, invoice_number: e.target.value })
      }
      placeholder="INV-2025-001"
    />
  </div>
</div>

          </div>

          <DialogFooter>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setOpen(false);
                  resetForm();
                  setIsEditMode(false);
                  setEditingToolId(null);
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveTool}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isEditMode ? "Save Changes" : "Add Item"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Tools;
