import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { StatusBadge } from "../components/StatusBadge";
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
  updateToolStatus,
  deleteTool,
  updateTool, // <-- new: you'll add this to api.ts (PUT / PATCH tool)
} from "../services/api";

// --- TYPES ---
type ToolStatus = "available" | "rented" | "maintenance" | "disabled";

interface Tool {
  id: string;
  name: string;
  code: string;
  cost: string;
  stock: number;
  status: ToolStatus;
  description?: string;
  supplier?: string;
  category?: string; // e.g., "Receiver" | "Base" | "Rover" | ...
}

// --- CONSTANTS ---
const CATEGORY_OPTIONS = [
  "Receiver",
  "Base",
  "Rover",
  "Accessory",
  "Power Tool",
  "Measuring",
  "Safety Gear",
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

  // Form model (used for both add & edit)
  const [form, setForm] = useState({
    name: "",
    code: "",
    cost: "",
    stock: "1",
    description: "",
    supplier: "",
    status: "available" as ToolStatus,
    category: "",
  });

  // Fetch tools
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const data = await getTools();
        // Ensure quantities and categories exist for legacy records
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
      status: "available",
      category: "",
    });

  const openAddModal = () => {
    resetForm();
    setIsEditMode(false);
    setEditingToolId(null);
    setOpen(true);
  };

  const openEditModal = (tool: Tool) => {
    setForm({
      name: tool.name,
      code: tool.code,
      cost: tool.cost,
      stock: String(tool.stock || 0),
      description: tool.description || "",
      supplier: tool.supplier || "",
      status: tool.status,
      category: tool.category || "",
    });
    setIsEditMode(true);
    setEditingToolId(tool.id);
    setOpen(true);
  };

  // --- Add or Update tool logic ---
  /**
   * When adding a tool:
   * - If a tool with the same code already exists -> treat as "stock update"
   *   -> call updateTool to increment quantity (prevents duplicates)
   * - Else create new tool with provided quantity
   *
   * NOTE: updateTool API should accept partial update (PATCH) and return updated tool.
   */
  const handleSaveTool = async () => {
    // basic validation
    if (!form.name.trim() || !form.code.trim() || !form.cost.trim()) {
      alert("Please fill in required fields: Name, Code, Cost.");
      return;
    }

    const parsedStock = Math.max(0, Number(form.stock) || 0);
    const payloadForCreate = {
      name: form.name.trim(),
      code: form.code.trim(),
      cost: form.cost.trim(),
      stock: parsedStock,
      description: form.description.trim(),
      supplier: form.supplier.trim(),
      status: form.status,
      category: form.category,
    };

    // EDIT MODE: update the selected tool fully (PATCH)
    if (isEditMode && editingToolId) {
      try {
        const updated = await updateTool(editingToolId, payloadForCreate);
        setTools((prev) => prev.map((t) => (t.id === editingToolId ? updated : t)));
        setOpen(false);
        resetForm();
        setIsEditMode(false);
        setEditingToolId(null);
      } catch (err) {
        console.error("Error updating tool:", err);
        alert("Failed to update tool. Check console for details.");
      }
      return;
    }

    // ADD MODE:
    try {
      // check for existing tool by code (case-insensitive)
      const existing = tools.find(
        (t) => t.code.toLowerCase() === form.code.trim().toLowerCase()
      );

      if (existing) {
        // increase quantity instead of creating duplicate
        const newStock = (existing.stock || 0) + parsedStock;
        const updated = await updateTool(existing.id, { stock: newStock });
        setTools((prev) => prev.map((t) => (t.id === existing.id ? updated : t)));
        alert(
          `Tool with code "${existing.code}" already exists. Quantity increased by ${parsedStock}.`
        );
      } else {
        const created = await createTool(payloadForCreate);
        // normalize created object (ensure quantity)
        const normalizedCreated: Tool = {
          ...created,
          stock: typeof created.stock === "number" ? created.stock : Number(created.stock || parsedStock),
          category: created.category || form.category,
        };
        setTools((prev) => [normalizedCreated, ...prev]);
      }
      setOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Error saving tool:", error);
      if (error.response?.data) {
        // give backend validation messages if present
        alert(
          `Failed to save tool: ${JSON.stringify(error.response.data, null, 2)}`
        );
      } else {
        alert("Failed to save tool. Please try again.");
      }
    }
  };

  // Update status
  const handleStatusChange = async (id: string, status: ToolStatus) => {
    try {
      await updateToolStatus(id, status);
      setTools((prev) => prev.map((tool) => (tool.id === id ? { ...tool, status } : tool)));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
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
  const lowStock = tools.filter((t) => (t.stock || 0) <= 5).length; // threshold = 5

  if (loading) return <p className="p-6 text-gray-400">Loading tools...</p>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tools Inventory</h2>
            <p className="text-gray-500">Manage your equipment records and statuses</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={openAddModal}>
              <Plus className="h-4 w-4" /> Add Tool
            </Button>
          </div>
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

            <Button variant="outline" className="gap-2" onClick={() => { setSearchTerm(""); setCategoryFilter(""); }}>
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
              <CardContent className="p-6">
                <div className="space-y-3">
                  {/* Header with status + actions */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{tool.name}</h3>
                      <p className="text-sm text-gray-400">{tool.code} • {tool.category || "Uncategorized"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={tool.status} />
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

                  {/* Description & Price */}
                  <div className="pt-3 border-t border-slate-800">
                    <div className="flex justify-between items-center">
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
                        {/* Visual stock pill */}
                        <div className="mt-1 flex items-center gap-2">
                          <div
                            className={`px-2 py-1 rounded-full text-sm font-medium ${
                              tool.stock <= 5 ? "bg-amber-600/20 text-amber-300" : "bg-green-600/10 text-green-300"
                            }`}
                          >
                            {tool.stock}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                    <Label className="text-sm text-gray-400">Change Status</Label>
                    <Select
                      defaultValue={tool.status}
                      onValueChange={(value) => handleStatusChange(tool.id, value as ToolStatus)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
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
            <DialogTitle>{isEditMode ? "Edit Tool" : "Add New Tool"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Tool name"
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
                <Input
                  value={form.supplier}
                  onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                  placeholder="Supplier name"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description"
              />
            </div>

            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(val) => setForm({ ...form, status: val as ToolStatus })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <div className="flex gap-2">
              <Button onClick={() => { setOpen(false); resetForm(); setIsEditMode(false); setEditingToolId(null); }} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSaveTool} className="bg-blue-600 hover:bg-blue-700">
                {isEditMode ? "Save Changes" : "Add Tool"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Tools;