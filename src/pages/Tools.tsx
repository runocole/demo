import React, { useEffect, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Search, Plus, Filter, Trash2, Edit2, RefreshCw, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
  getReceiverTypes,
  getSuppliers,
} from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ---------------- Types ---------------- */
interface Tool {
  id: string;
  name: string;
  code: string;
  cost: string | number;
  stock: number;
  description?: string;
  supplier?: string;
  category?: string;
  invoice_number?: string;
  date_added?: string;
  serials?: string[];
  receiver_type?: string | null;
  receiver_type_id?: number | string | null;
}

interface ReceiverType {
  id: number | string;
  name: string;
  default_cost?: string | number;
}

interface Supplier {
  id: number | string;
  name: string;
}

/* ---------------- Constants ---------------- */
const CATEGORY_OPTIONS = [
  "Receiver",
  "Accessory",
  "Total Station",
  "Level",
  "Drones",
  "EcoSounder",
  "Laser Scanner",
  "Other",
];

/* ---------------- Component ---------------- */
const Tools: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal & form state
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingToolId, setEditingToolId] = useState<string | null>(null);

  // Search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // Receiver types
  const [receiverTypes, setReceiverTypes] = useState<ReceiverType[]>([]);
  const [isLoadingReceiverTypes, setIsLoadingReceiverTypes] = useState(false);

  // Suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);

  // Exchange rate
  const [exchangeRate, setExchangeRate] = useState({
    rate: 1560.75,
    lastUpdated: new Date().toISOString(),
    isLoading: false,
  });

  // Form model
  const [form, setForm] = useState<any>({
    name: "",
    code: "",
    cost: "",
    stock: "1",
    description: "",
    supplier: "",
    category: "",
    invoice_number: "",
    serials: [""],
    receiver_type_id: "",
    receiver_type: "",
  });

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const data = await getTools();
        const normalized: Tool[] = (data || []).map((t: any) => {
          let serialsArr: string[] = [];
          if (Array.isArray(t.serials)) {
            serialsArr = t.serials;
          } else if (t.serials && typeof t.serials === "object") {
            serialsArr = Object.keys(t.serials)
              .sort()
              .map((k) => t.serials[k])
              .filter(Boolean);
          }

          return {
            ...t,
            stock: typeof t.stock === "number" ? t.stock : Number(t.stock || 0),
            category: t.category || "",
            serials: serialsArr,
            receiver_type: t.receiver_type ?? t.receiver_type_name ?? "",
            receiver_type_id: t.receiver_type_id ?? "",
          };
        });
        setTools(normalized);
      } catch (error) {
        console.error("Error fetching tools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  // Fetch exchange rate
  const fetchExchangeRate = async () => {
    setExchangeRate((p) => ({ ...p, isLoading: true }));
    try {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      const payload = await res.json();
      const ngn = payload?.rates?.NGN;
      if (ngn) {
        setExchangeRate({ rate: ngn, lastUpdated: new Date().toISOString(), isLoading: false });
      } else {
        setExchangeRate((p) => ({ ...p, isLoading: false }));
      }
    } catch (err) {
      console.error("Failed to fetch exchange rate:", err);
      setExchangeRate((p) => ({ ...p, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  // Fetch receiver types
  const fetchReceiverTypes = async () => {
    setIsLoadingReceiverTypes(true);
    try {
      const data = await getReceiverTypes();
      setReceiverTypes(data || []);
    } catch (err) {
      console.warn("Could not fetch receiver types:", err);
      setReceiverTypes([]);
    } finally {
      setIsLoadingReceiverTypes(false);
    }
  };

  // Fetch suppliers
  const fetchSuppliers = async () => {
    setIsLoadingSuppliers(true);
    try {
      const data = await getSuppliers();
      setSuppliers(data || []);
    } catch (err) {
      console.warn("Could not fetch suppliers:", err);
      setSuppliers([]);
    } finally {
      setIsLoadingSuppliers(false);
    }
  };

  useEffect(() => {
    fetchReceiverTypes();
    fetchSuppliers();
  }, []);

  /* ---------------- Helpers ---------------- */

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
      serials: [""],
      receiver_type_id: "",
      receiver_type: "",
    });

  const openAddModal = () => {
    resetForm();
    setIsEditMode(false);
    setEditingToolId(null);
    setOpen(true);
  };

  const openEditModal = (tool: Tool) => {
    const serials = Array.isArray(tool.serials) && tool.serials.length ? tool.serials : [""];
    setForm({
      name: tool.name || "",
      code: tool.code || "",
      cost: String(tool.cost ?? ""),
      stock: String(tool.stock ?? "1"),
      description: tool.description || "",
      supplier: tool.supplier || "",
      category: tool.category || "",
      invoice_number: tool.invoice_number || "",
      serials,
      receiver_type_id: tool.receiver_type_id || "",
      receiver_type: tool.receiver_type || "",
    });
    setIsEditMode(true);
    setEditingToolId(tool.id ?? null);

    if (tool.category === "Receiver") {
      fetchReceiverTypes();
    }

    setOpen(true);
  };

  const calculateNairaEquivalent = (usdAmount: string): string => {
    if (!usdAmount || isNaN(parseFloat(usdAmount))) return "₦0.00";
    const usd = parseFloat(usdAmount);
    const naira = usd * exchangeRate.rate;
    return `₦${naira.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getTimeAgo = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch {
      return "—";
    }
  };

  /* ---------------- Save / Update ---------------- */

  const handleSaveTool = async () => {
    // basic validation
    if (!form.name.toString().trim() || !form.code.toString().trim() || !form.cost.toString().trim()) {
      alert("Please fill in required fields: Name, Code, Cost.");
      return;
    }

    const parsedStock = Math.max(0, Number(form.stock) || 0);

    // prepare payload according to your requested schema
    const payload: any = {
      name: form.name.toString().trim(),
      code: form.code.toString().trim(),
      cost: form.cost.toString().trim(),
      stock: parsedStock,
      description: form.description || "",
      supplier: form.supplier || "",
      category: form.category || "",
      invoice_number: form.invoice_number || "",
      date_added: new Date().toISOString(),
    };

    // serials: send as array of non-empty trimmed strings
    const serialsArray = (Array.isArray(form.serials) ? form.serials : [])
      .map((s: any) => String(s || "").trim())
      .filter((s: string) => s !== "");

    if (serialsArray.length > 0) {
      payload.serials = serialsArray;
    }

    // include receiver_type as string if present (per your requested format)
    if (form.receiver_type && String(form.receiver_type).trim() !== "") {
      payload.receiver_type = String(form.receiver_type).trim();
    }

    // also include receiver_type_id for robustness (optional)
    if (form.receiver_type_id) payload.receiver_type_id = form.receiver_type_id;

    // Create or update
    if (isEditMode && editingToolId) {
      try {
        const updated = await updateTool(editingToolId, payload);
        // normalize returned tool
        const normalized: Tool = {
          ...updated,
          stock: typeof updated.stock === "number" ? updated.stock : Number(updated.stock || parsedStock),
          serials: Array.isArray(updated.serials) ? updated.serials : serialsArray,
          receiver_type: updated.receiver_type ?? payload.receiver_type ?? "",
          receiver_type_id: updated.receiver_type_id ?? payload.receiver_type_id ?? "",
        };
        setTools((prev) => prev.map((t) => (t.id === editingToolId ? normalized : t)));
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

    // If creating new or merging with existing code
    try {
      const existing = tools.find((t) => t.code && t.code.toLowerCase() === payload.code.toLowerCase());
      if (existing) {
        // simply increase stock and optionally append serials
        const newStock = (existing.stock || 0) + parsedStock;
        const updatePayload: any = { stock: newStock };
        if (serialsArray.length > 0) updatePayload.serials = serialsArray;
        const updated = await updateTool(existing.id, updatePayload);
        const normalized = {
          ...updated,
          stock: typeof updated.stock === "number" ? updated.stock : Number(updated.stock || newStock),
          serials: Array.isArray(updated.serials) ? updated.serials : serialsArray,
        };
        setTools((prev) => prev.map((t) => (t.id === existing.id ? normalized : t)));
        alert(`Tool "${existing.code}" already exists. Quantity increased by ${parsedStock}.`);
      } else {
        const created = await createTool(payload);
        const normalizedCreated: Tool = {
          ...created,
          stock: typeof created.stock === "number" ? created.stock : Number(created.stock || parsedStock),
          serials: Array.isArray(created.serials) ? created.serials : serialsArray,
          receiver_type: created.receiver_type ?? payload.receiver_type ?? "",
          receiver_type_id: created.receiver_type_id ?? payload.receiver_type_id ?? "",
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

  /* ---------------- Delete ---------------- */
  const handleDeleteTool = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this tool?")) return;
    try {
      await deleteTool(id);
      setTools((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete tool");
    }
  };

  /* ---------------- Receiver type selection (autofill) ---------------- */
  const handleReceiverTypeSelect = (val: string) => {
    // val could be id (string) or name; since getReceiverTypes returns objects,
    // we detect whether val matches an id in list, otherwise treat as name.
    const found = receiverTypes.find((r) => String(r.id) === String(val) || r.name === val);
    if (found) {
      setForm((prev: any) => ({
        ...prev,
        receiver_type_id: found.id,
        receiver_type: found.name,
        name: prev.name || found.name, // do not override if user typed a name
        cost: prev.cost || String(found.default_cost ?? prev.cost),
      }));
    } else {
      // if val is empty or not found, set as manual value
      setForm((prev: any) => ({ ...prev, receiver_type_id: "", receiver_type: val }));
    }
  };

  /* ---------------- Filtering & summary ---------------- */
  const filteredTools = tools.filter((t) => {
    const matchesCategory =
      categoryFilter === "all" ||
      !categoryFilter ||
      (t.category || "").toLowerCase() === categoryFilter.toLowerCase();
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (t.name || "").toLowerCase().includes(q) ||
      (t.code || "").toLowerCase().includes(q) ||
      ((t.description || "") as string).toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const totalTools = tools.length;
  const totalStock = tools.reduce((acc, t) => acc + (t.stock || 0), 0);
  const lowStock = tools.filter((t) => (t.stock || 0) <= 5).length;

  /* ---------------- PDF Export ---------------- */
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Tools Inventory", 14, 20);

    const tableData = filteredTools.map((t) => [
      t.name,
      t.code,
      t.category || "—",
      `${t.serials && t.serials.length ? t.serials.join(", ") : "—"}`,
      `$${t.cost}`,
      t.stock?.toString() || "0",
      t.supplier || "—",
      t.invoice_number || "—",
      t.date_added ? new Date(t.date_added).toLocaleDateString() : "—",
    ]);

    autoTable(doc, {
      head: [
        [
          "Name",
          "Code",
          "Category",
          "Serials",
          "Cost (USD)",
          "Stock",
          "Supplier",
          "Invoice",
          "Added",
        ],
      ],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 54, 92] },
      theme: "grid",
    });

    doc.save(`tools-inventory-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  if (loading) return <p className="p-6 text-gray-400">Loading tools...</p>;

  /* ---------------- Render ---------------- */
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
            <p className="text-gray-500">Manage your equipment records and details</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={openAddModal}>
              <Plus className="h-4 w-4" /> Add Item
            </Button>
            <Button variant="outline" onClick={exportToPDF} className="gap-2">
              <Download className="h-4 w-4" /> Export PDF
            </Button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search tools by name, code or box type..."
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
          <Card className="border-border bg-blue-950">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Total Tools</p>
              <h3 className="text-2xl font-bold">{totalTools}</h3>
            </CardContent>
          </Card>
          <Card className="border-border bg-blue-950">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Items in Stock</p>
              <h3 className="text-2xl font-bold">{totalStock}</h3>
            </CardContent>
          </Card>
          <Card className="border-border bg-blue-950">
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
                    <p className="text-xs text-gray-500">Invoice: {tool.invoice_number || "—"}</p>
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
                    <p className="text-xs text-gray-400">Box Type</p>
                    <p className="text-sm font-medium">{tool.description || "—"}</p>
                    <p className="text-xs text-gray-400 mt-2">Supplier</p>
                    <p className="text-sm">{tool.supplier || "—"}</p>

                    {/* show serials if available */}
                    {tool.serials && Array.isArray(tool.serials) && tool.serials.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400">Serials</p>
                        <ul className="text-sm list-disc list-inside">
                          {tool.serials.map((s, i) => (s ? <li key={i}>{s}</li> : null))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400">Cost (USD)</p>
                    <p className="text-sm font-bold text-blue-400">${tool.cost}</p>

                    <p className="text-xs text-gray-400 mt-1">Cost (NGN)</p>
                    <p className="text-sm font-bold text-green-400">{calculateNairaEquivalent(String(tool.cost))}</p>

                    <p className="text-xs text-gray-400 mt-3">Stock</p>
                    <div
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        tool.stock <= 5 ? "bg-amber-600/20 text-amber-300" : "bg-green-600/10 text-green-300"
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

      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>{isEditMode ? "Edit Tool" : "Add New Item"}</DialogTitle>
      <DialogDescription>
        Fill in the fields below to {isEditMode ? "update" : "create"} a tool.
      </DialogDescription>
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
                <Label>Serial  Number</Label>
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
                  onValueChange={(val) => {
                    setForm((prev: any) => ({
                      ...prev,
                      category: val,
                      // ensure at least one serial input exists always
                      serials: prev.serials && prev.serials.length ? prev.serials : [""],
                    }));
                    if (val === "Receiver") fetchReceiverTypes();
                    if (val !== "Receiver") {
                      // clear receiver-specific fields if switching away
                      setForm((prev: any) => ({ ...prev, receiver_type_id: "", receiver_type: "", description: "" }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-black text-white">
                    {CATEGORY_OPTIONS.map((c) => (
                      <SelectItem key={c} value={c} className="text-white">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

           {/* Receiver type (only when Receiver) */}
{form.category === "Receiver" && (
  <div>
    <Label>Receiver Type (autofill name & cost)</Label>
    <Select
      value={form.receiver_type_id || form.receiver_type}
      onValueChange={(val) => {
        // if val matches an id from receiverTypes we'll autofill; otherwise treat as manual name
        handleReceiverTypeSelect(val);
      }}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={isLoadingReceiverTypes ? "Loading..." : "Select receiver type"}
        />
      </SelectTrigger>
      <SelectContent>
        {/* Disabled placeholder instead of empty value */}
        <SelectItem value="none" disabled>
          -- Select type --
        </SelectItem>

        {receiverTypes.length === 0 && !isLoadingReceiverTypes && (
          <SelectItem value="manual">Manual / No types</SelectItem>
        )}

        {receiverTypes.map((r) => (
          <SelectItem key={r.id} value={String(r.id)}>
            {r.name} {r.default_cost ? `— $${r.default_cost}` : ""}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <p className="text-xs text-gray-400 mt-1">
      Cost is autofilled from admin settings but remains editable.
    </p>
  </div>
)}


            {/* Foreign Exchange */}
            <div className="space-y-4 p-4 bg-[#0f1f3d] rounded-lg border border-[#1b2d55]">
              <div className="space-y-2">
                <Label htmlFor="cost-usd" className="text-blue-200 flex items-center gap-2">
                  <span>Cost in USD</span>
                  <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">$</span>
                </Label>
                <Input
                  id="cost-usd"
                  type="number"
                  step="0.01"
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: e.target.value })}
                  placeholder="100.00"
                  className="bg-[#162a52] border-[#2a4375] text-white text-lg font-medium"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#1e3a78] rounded-lg border border-[#2a4375]">
                <div className="text-blue-200 text-sm">💱 Exchange Rate</div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">
                    1 USD = ₦{exchangeRate.rate.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-blue-300 text-xs flex items-center gap-2">
                    <span>Updated {getTimeAgo(exchangeRate.lastUpdated)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={fetchExchangeRate}
                      disabled={exchangeRate.isLoading}
                      className="h-6 w-6 p-0 hover:bg-blue-600"
                    >
                      <RefreshCw className={`h-3 w-3 ${exchangeRate.isLoading ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost-naira" className="text-blue-200 flex items-center gap-2">
                  <span>Equivalent in Naira</span>
                  <span className="text-xs text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded">₦</span>
                </Label>
                <Input
                  id="cost-naira"
                  type="text"
                  value={calculateNairaEquivalent(form.cost)}
                  readOnly
                  className="bg-[#1e3a78] border-[#2a4375] text-yellow-400 font-bold text-lg cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label>Stock</Label>
                <Input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="1" />
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
    <SelectContent className="bg-black text-white max-h-60 overflow-y-auto">
      {isLoadingSuppliers ? (
        <SelectItem value="" disabled>Loading suppliers...</SelectItem>
      ) : suppliers.length > 0 ? (
        suppliers.map((s) => (
          <SelectItem key={s.id} value={s.name} className="text-white">
            {s.name}
          </SelectItem>
        ))
      ) : (
        <SelectItem value="" disabled>No suppliers found</SelectItem>
      )}
    </SelectContent>
  </Select>
              </div>
              <div>
                <Label>Invoice Number</Label>
                <Input value={form.invoice_number} onChange={(e) => setForm({ ...form, invoice_number: e.target.value })} placeholder="INV-2025-001" />
              </div>
            </div>

            {/* Box Type only when Receiver */}
            {form.category === "Receiver" && (
              <div>
                <Label>Box Type</Label>
                <Select
                  value={form.description}
                  onValueChange={(val) => setForm((prev: any) => ({ ...prev, description: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select box type" />
                  </SelectTrigger>
                  <SelectContent className="bg-black text-white border-gray-700 rounded-lg">
                    <SelectItem value="Base" className="text-white">Base</SelectItem>
                    <SelectItem value="Rover" className="text-white">Rover</SelectItem>
                    <SelectItem value="Base and Rover" className="text-white">Base and Rover</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Compact serial numbers UI */}
            <div className="p-3 bg-[#07122a] rounded-md border border-[#12305a]">
              <p className="text-sm text-gray-300 mb-2 font-medium">Serial Numbers</p>

              <div className="grid gap-3">
                {Array.isArray(form.serials) &&
                  form.serials.map((serial: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={serial}
                        onChange={(e) => {
                          const updated = Array.isArray(form.serials) ? [...form.serials] : [""];
                          updated[idx] = e.target.value;
                          setForm({ ...form, serials: updated });
                        }}
                        placeholder={`Serial number ${idx + 1}`}
                      />
                      {form.serials.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updated = [...form.serials];
                            updated.splice(idx, 1);
                            setForm({ ...form, serials: updated.length ? updated : [""] });
                          }}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updated = Array.isArray(form.serials) ? [...form.serials, ""] : [""];
                      setForm({ ...form, serials: updated });
                    }}
                  >
                    + Add Serial
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">Add additional serials when necessary. For non-Receiver categories only one serial is required.</p>
                </div>
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
              <Button onClick={handleSaveTool} className="bg-blue-600 hover:bg-blue-700">
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
