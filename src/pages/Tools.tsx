import React, { useEffect, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Search, Plus, Trash2, Edit2, RefreshCw, Download, CheckCircle, X } from "lucide-react"; // Added CheckCircle and X
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
  getEquipmentTypes,
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
  supplier_name?: string;
  category?: string;
  invoice_number?: string;
  date_added?: string;
  serials?: string[];
  equipment_type?: string | null;
  equipment_type_id?: number | string | null;
}

interface GroupedTool {
  id: string;
  name: string;
  category: string;
  equipment_type?: string;
  equipment_type_id?: string | number | null;
  tools: Tool[];
  totalStock: number;
  lastUpdated: string;
  cost: string;
  description?: string;
  supplier_name?: string;
  latestTool: Tool;
}

interface EquipmentType {
  id: number | string;
  name: string;
  default_cost?: string | number;
  category?: string;
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

// Toast Component
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg border border-green-400 animate-in slide-in-from-right-8 duration-300">
    <CheckCircle className="h-5 w-5" />
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="hover:bg-green-700 rounded p-1">
      <X className="h-4 w-4" />
    </button>
  </div>
);

/* ---------------- Component ---------------- */
const Tools: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal & form state
  const [open, setOpen] = useState(false);
  const [modalStep, setModalStep] = useState<
    "select-category" | "select-equipment-type" | "form"
  >("select-category");
  const [selectedCategoryCard, setSelectedCategoryCard] = useState<string | null>(null);
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingToolId, setEditingToolId] = useState<string | null>(null);

  // Search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // Equipment types
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  const [isLoadingEquipmentTypes, setIsLoadingEquipmentTypes] = useState(false);

  // Suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);

  // Exchange rate
  const [exchangeRate, setExchangeRate] = useState({
    rate: 1560.75,
    lastUpdated: new Date().toISOString(),
    isLoading: false,
  });

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

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
    serials: [],
    equipment_type_id: "",
    equipment_type: "",
  });

  /* ---------------- Grouping Logic ---------------- */
  const groupTools = (tools: Tool[]): GroupedTool[] => {
    const groups: { [key: string]: GroupedTool } = {};

    tools.forEach(tool => {
      if (tool.category === "Receiver" && tool.equipment_type) {
        const key = `receiver-${tool.equipment_type}`;
        
        if (!groups[key]) {
          groups[key] = {
            id: key,
            name: tool.equipment_type,
            category: tool.category || "Receiver",
            equipment_type: tool.equipment_type,
            equipment_type_id: tool.equipment_type_id,
            tools: [tool],
            totalStock: tool.stock || 0,
            lastUpdated: tool.date_added || new Date().toISOString(),
            cost: String(tool.cost),
            description: tool.description,
            supplier_name: tool.supplier_name,
            latestTool: tool,
          };
        } else {
          groups[key].tools.push(tool);
          groups[key].totalStock += tool.stock || 0;
          
          if (tool.date_added && tool.date_added > groups[key].lastUpdated) {
            groups[key].lastUpdated = tool.date_added;
            groups[key].latestTool = tool;
          }
        }
      } else {
        const key = `${tool.category || "Uncategorized"}-${tool.name}`;
        
        if (!groups[key]) {
          groups[key] = {
            id: key,
            name: tool.name,
            category: tool.category || "Uncategorized",
            tools: [tool],
            totalStock: tool.stock || 0,
            lastUpdated: tool.date_added || new Date().toISOString(),
            cost: String(tool.cost),
            description: tool.description,
            supplier_name: tool.supplier_name,
            latestTool: tool,
          };
        } else {
          groups[key].tools.push(tool);
          groups[key].totalStock += tool.stock || 0;
          if (tool.date_added && tool.date_added > groups[key].lastUpdated) {
            groups[key].lastUpdated = tool.date_added;
            groups[key].latestTool = tool;
          }
        }
      }
    });

    return Object.values(groups);
  };

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
            equipment_type: t.equipment_type ?? t.equipment_type_name ?? "",
            equipment_type_id: t.equipment_type_id ?? "",
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

  // Fetch equipment types
  const fetchEquipmentTypes = async () => {
    setIsLoadingEquipmentTypes(true);
    try {
      const data = await getEquipmentTypes();
      setEquipmentTypes(data || []);
    } catch (err) {
      console.warn("Could not fetch equipment types:", err);
      setEquipmentTypes([]);
    } finally {
      setIsLoadingEquipmentTypes(false);
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
    fetchEquipmentTypes();
    fetchSuppliers();
  }, []);

  // Toast auto-hide
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setRecentlyAddedId(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

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
      serials: [],
      equipment_type_id: "",
      equipment_type: "",
    });

  const openAddModal = () => {
    resetForm();
    setIsEditMode(false);
    setEditingToolId(null);
    setSelectedCategoryCard(null);
    setSelectedEquipmentType(null);
    setModalStep("select-category");
    setOpen(true);
  };

  const getAllowedExtraLabels = (boxType: string): string[] => {
    if (boxType === "Rover" || boxType === "Base") {
      return ["Data Logger"];
    }
    if (boxType === "Base and Rover") {
      return ["Receiver 2", "DataLogger", "External Radio"];
    }
    return [];
  };

  const openEditModal = (tool: Tool) => {
    const extras: string[] =
      Array.isArray(tool.serials) && tool.serials.length
        ? tool.serials.filter((s) => s !== tool.code)
        : [];

    setForm({
      name: tool.name || "",
      code: tool.code || "",
      cost: String(tool.cost ?? ""),
      stock: String(tool.stock ?? "1"),
      description: tool.description || "",
      supplier: tool.supplier || "",
      category: tool.category || "",
      invoice_number: tool.invoice_number || "",
      serials: extras.length ? extras : [],
      equipment_type_id: tool.equipment_type_id || "",
      equipment_type: tool.equipment_type || "",
    });

    setIsEditMode(true);
    setEditingToolId(tool.id ?? null);
    setSelectedCategoryCard(tool.category || null);

    if (tool.category === "Receiver") {
      fetchEquipmentTypes().then(() => {
        const etId = tool.equipment_type_id ? String(tool.equipment_type_id) : "";
        const found = equipmentTypes.find((e) => String(e.id) === String(etId) || e.name === tool.equipment_type);
        if (found) {
          setSelectedEquipmentType(String(found.id));
        } else {
          setSelectedEquipmentType(tool.equipment_type_id ? String(tool.equipment_type_id) : tool.equipment_type || null);
        }
      });
    }

    setModalStep("form");
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

  /* ---------------- Serial extras logic ---------------- */
  const effectiveCategory = selectedCategoryCard || form.category;
  const shouldShowBoxTypeAndExtras = effectiveCategory === "Receiver";
  const allowedExtraLabels = shouldShowBoxTypeAndExtras ? getAllowedExtraLabels(form.description) : [];

  const canAddExtra = () => {
    if (!allowedExtraLabels || allowedExtraLabels.length === 0) return false;
    return (form.serials || []).length < allowedExtraLabels.length;
  };

  const addExtraSerial = () => {
    if (!canAddExtra()) {
      alert(
        allowedExtraLabels.length > 0
          ? `Maximum of ${allowedExtraLabels.length} extra box(es) allowed for "${form.description}".`
          : "No extras allowed for this box type."
      );
      return;
    }
    setForm((prev: any) => ({ ...prev, serials: [...(prev.serials || []), ""] }));
  };

  const removeExtraSerial = (index: number) => {
    const updated = Array.isArray(form.serials) ? [...form.serials] : [];
    updated.splice(index, 1);
    setForm((prev: any) => ({ ...prev, serials: updated }));
  };

  const setExtraSerialValue = (index: number, value: string) => {
    const updated = Array.isArray(form.serials) ? [...form.serials] : [];
    updated[index] = value;
    setForm((prev: any) => ({ ...prev, serials: updated }));
  };

  /* ---------------- Equipment type selection ---------------- */
  const handleEquipmentTypeSelect = (val: string) => {
    const found = equipmentTypes.find((e) => String(e.id) === String(val) || e.name === val);
    if (found) {
      setSelectedEquipmentType(String(found.id));
      setForm((prev: any) => ({
        ...prev,
        equipment_type_id: found.id,
        equipment_type: found.name,
        name: found.name,
        cost: String(found.default_cost ?? prev.cost),
        category: selectedCategoryCard || prev.category,
      }));
    } else {
      setSelectedEquipmentType(val);
      setForm((prev: any) => ({ 
        ...prev, 
        equipment_type_id: "", 
        equipment_type: val,
        category: selectedCategoryCard || prev.category,
      }));
    }
    
    // AUTOMATICALLY proceed to form after selection
    setModalStep("form");
  };

  /* ---------------- Save / Update ---------------- */
  const handleSaveTool = async () => {
    if (!String(form.name || "").trim() || !String(form.code || "").trim() || !String(form.cost || "").trim()) {
      alert("Please fill in required fields: Name, Serial (Code), Cost.");
      return;
    }

    const parsedStock = Math.max(0, Number(form.stock) || 0);
    const finalCategory = selectedCategoryCard || form.category || "";
    let finalEquipmentTypeName = "";
    let finalEquipmentTypeId: any = form.equipment_type_id || "";

    if (selectedEquipmentType) {
      const found = equipmentTypes.find((e) => String(e.id) === String(selectedEquipmentType));
      if (found) {
        finalEquipmentTypeName = found.name;
        finalEquipmentTypeId = found.id;
      } else {
        finalEquipmentTypeName = selectedEquipmentType;
        finalEquipmentTypeId = selectedEquipmentType;
      }
    } else if (form.equipment_type) {
      finalEquipmentTypeName = form.equipment_type;
      finalEquipmentTypeId = form.equipment_type_id || "";
    }

    const payload: any = {
      name: String(form.name).trim(),
      code: String(form.code).trim(),
      cost: String(form.cost).trim(),
      stock: parsedStock,
      description: form.description || "",
      supplier: form.supplier || "",
      category: finalCategory,
      invoice_number: form.invoice_number || "",
      date_added: new Date().toISOString(),
    };

    const extrasArr = (Array.isArray(form.serials) ? form.serials : [])
      .map((s: any) => String(s || "").trim())
      .filter((s: string) => s !== "");

    if (finalCategory === "Receiver") {
      payload.serials = [String(form.code).trim(), ...extrasArr];
    } else {
      const allSerials = [String(form.code).trim(), ...extrasArr].filter(Boolean);
      if (allSerials.length > 0) payload.serials = allSerials;
    }

    if (finalEquipmentTypeName && String(finalEquipmentTypeName).trim() !== "") {
      payload.equipment_type = String(finalEquipmentTypeName).trim();
    }
    if (finalEquipmentTypeId) payload.equipment_type_id = finalEquipmentTypeId;

    if (isEditMode && editingToolId) {
      try {
        const updated = await updateTool(editingToolId, payload);
        const normalized: Tool = {
          ...updated,
          stock: typeof updated.stock === "number" ? updated.stock : Number(updated.stock || parsedStock),
          serials: Array.isArray(updated.serials) ? updated.serials : payload.serials || [],
          equipment_type: updated.equipment_type ?? payload.equipment_type ?? "",
          equipment_type_id: updated.equipment_type_id ?? payload.equipment_type_id ?? "",
        };
        setTools((prev) => prev.map((t) => (t.id === editingToolId ? normalized : t)));
        
        // Show success feedback
        setToastMessage("Tool updated successfully!");
        setShowToast(true);
        setRecentlyAddedId(editingToolId);
        
        setOpen(false);
        resetForm();
        setIsEditMode(false);
        setEditingToolId(null);
        setSelectedCategoryCard(null);
        setSelectedEquipmentType(null);
      } catch (err) {
        console.error("Error updating tool:", err);
        alert("Failed to update tool.");
      }
      return;
    }

    try {
      const existing = tools.find((t) => t.code && t.code.toLowerCase() === payload.code.toLowerCase());
      if (existing) {
        const newStock = (existing.stock || 0) + parsedStock;
        const updatePayload: any = { stock: newStock };
        if (payload.serials) updatePayload.serials = payload.serials;
        const updated = await updateTool(existing.id, updatePayload);
        const normalized = {
          ...updated,
          stock: typeof updated.stock === "number" ? updated.stock : Number(updated.stock || newStock),
          serials: Array.isArray(updated.serials) ? updated.serials : updatePayload.serials || [],
        };
        setTools((prev) => prev.map((t) => (t.id === existing.id ? normalized : t)));
        
        // Show success feedback
        setToastMessage(`Tool "${existing.code}" quantity increased by ${parsedStock}!`);
        setShowToast(true);
        setRecentlyAddedId(existing.id);
      } else {
        const created = await createTool(payload);
        const normalizedCreated: Tool = {
          ...created,
          stock: typeof created.stock === "number" ? created.stock : Number(created.stock || parsedStock),
          serials: Array.isArray(created.serials) ? created.serials : payload.serials || [],
          equipment_type: created.equipment_type ?? payload.equipment_type ?? "",
          equipment_type_id: created.equipment_type_id ?? payload.equipment_type_id ?? "",
        };
        setTools((prev) => [normalizedCreated, ...prev]);
        
        // Show success feedback
        setToastMessage("New tool added successfully!");
        setShowToast(true);
        setRecentlyAddedId(created.id);
      }
      setOpen(false);
      resetForm();
      setSelectedCategoryCard(null);
      setSelectedEquipmentType(null);
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

  /* ---------------- Filtering & summary ---------------- */
  const filteredTools = tools.filter((t) => {
    const matchesCategory =
      categoryFilter === "all" || !categoryFilter || (t.category || "").toLowerCase() === categoryFilter.toLowerCase();
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (t.name || "").toLowerCase().includes(q) ||
      (t.code || "").toLowerCase().includes(q) ||
      ((t.description || "") as string).toLowerCase().includes(q) ||
      (t.equipment_type || "").toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Group the filtered tools
  const groupedTools = groupTools(filteredTools);

  // Update summary calculations to use grouped tools
  const totalTools = groupedTools.length;
  const totalStock = groupedTools.reduce((acc, group) => acc + group.totalStock, 0);
  const lowStock = groupedTools.filter((group) => group.totalStock <= 5).length;

  /* ---------------- PDF Export ---------------- */
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Tools Inventory (Grouped)", 14, 20);

    const tableData = groupedTools.map((group) => [
      group.name,
      group.category,
      group.equipment_type || "—",
      group.tools.reduce((acc, t) => acc + (t.serials?.length || 0), 0) + " serials",
      `$${group.cost}`,
      group.totalStock.toString(),
      group.supplier_name || "—",
      group.tools.length + " items",
      group.lastUpdated ? new Date(group.lastUpdated).toLocaleDateString() : "—",
    ]);

    autoTable(doc, {
      head: [
        [
          "Name",
          "Category",
          "Equipment Type",
          "Serials",
          "Cost (USD)",
          "Total Stock",
          "Supplier",
          "Items",
          "Last Updated",
        ],
      ],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 54, 92] },
      theme: "grid",
    });

    doc.save(`tools-inventory-grouped-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  if (loading) return <p className="p-6 text-gray-400">Loading tools...</p>;

  /* ---------------- Render ---------------- */
  return (
    <DashboardLayout>
      {/* Toast Notification */}
      {showToast && (
        <Toast 
          message={toastMessage} 
          onClose={() => {
            setShowToast(false);
            setRecentlyAddedId(null);
          }} 
        />
      )}

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
              placeholder="Search tools by name, code, box type or equipment type..."
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
              <SelectContent className="bg-black text-white border-gray-700 rounded-lg">
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
              Clear
            </Button>
          </div>
        </div>

        {/* Stock Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border bg-blue-950">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400">Total Tool Types</p>
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
          {groupedTools.map((group) => {
            const isRecentlyAdded = group.tools.some(tool => tool.id === recentlyAddedId);
            
            return (
              <Card 
                key={group.id} 
                className={`
                  hover:shadow-lg transition-all duration-300 bg-blue-950
                  ${isRecentlyAdded ? 'ring-2 ring-green-500 shadow-lg scale-105' : ''}
                `}
              >
                <CardContent className="p-6 space-y-3">
                  {/* Recently Added Badge */}
                  {isRecentlyAdded && (
                    <div className="flex justify-between items-center">
                      <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Recently Added
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{group.name}</h3>
                      <p className="text-sm text-gray-400">
                        {group.category} {group.equipment_type ? `• ${group.equipment_type}` : ''}
                      </p>
                      <p className="text-xs text-gray-500">
                        Last Updated: {group.lastUpdated ? new Date(group.lastUpdated).toLocaleDateString() : "—"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {group.tools.length} individual item{group.tools.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (group.tools.length > 0) {
                            openEditModal(group.tools[0]);
                          }
                        }}
                        className="text-slate-400 hover:bg-slate-700"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (group.tools.length === 1) {
                            handleDeleteTool(group.tools[0].id);
                          } else {
                            if (window.confirm(`Delete all ${group.tools.length} ${group.name} items?`)) {
                              group.tools.forEach(tool => handleDeleteTool(tool.id));
                            }
                          }
                        }}
                        className="text-red-600 hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-start">
                    <div>
                      {/* Show only the latest tool's serial */}
                      {group.latestTool && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-400">Latest Serial</p>
                          <p className="text-sm font-mono text-gray-300">
                            {group.latestTool.code || "—"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400">Cost (USD)</p>
                      <p className="text-sm font-bold text-blue-400">${group.cost}</p>

                      <p className="text-xs text-gray-400 mt-1">Cost (NGN)</p>
                      <p className="text-sm font-bold text-green-400">
                        {calculateNairaEquivalent(String(group.cost))}
                      </p>

                      <p className="text-xs text-gray-400 mt-3">Total Stock</p>
                      <div
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          group.totalStock <= 5 ? "bg-amber-600/20 text-amber-300" : "bg-green-600/10 text-green-300"
                        }`}
                      >
                        {group.totalStock}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ---------------- Add/Edit Modal ---------------- */}
      <Dialog
        open={open}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(false);
            resetForm();
            setIsEditMode(false);
            setEditingToolId(null);
            setSelectedCategoryCard(null);
            setSelectedEquipmentType(null);
            setModalStep("select-category");
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Tool" : "Add New Item"}</DialogTitle>
            <DialogDescription>
              {modalStep === "select-category"
                ? "Choose a category to start"
                : modalStep === "select-equipment-type"
                ? "Select the equipment type"
                : `Fill in the fields below to ${isEditMode ? "update" : "create"} a tool.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* STEP 1: Category selection */}
            {modalStep === "select-category" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {CATEGORY_OPTIONS.map((cat) => (
                  <Card
                    key={cat}
                    className={`p-4 cursor-pointer hover:scale-105 transform ${selectedCategoryCard === cat ? "ring-2 ring-blue-500" : ""}`}
                    onClick={async () => {
                      setSelectedCategoryCard(cat);
                      
                      // Always fetch equipment types first
                      await fetchEquipmentTypes();
                      
                      // Check if there are equipment types for this category
                      const categoryEquipmentTypes = equipmentTypes.filter(item => item.category === cat);
                      
                      if (categoryEquipmentTypes.length > 0) {
                        // If there are equipment types for this category, show selection
                        setModalStep("select-equipment-type");
                      } else {
                        // If no equipment types, go directly to form
                        setForm((prev: any) => ({ 
                          ...prev, 
                          category: cat,
                          name: "",
                          cost: ""
                        }));
                        setModalStep("form");
                      }
                    }}
                  >
                    <CardContent>
                      <div className="text-lg font-semibold">{cat}</div>
                      <div className="text-xs text-gray-400 mt-1">Add {cat} items</div>
                      <div className="text-xs text-blue-400 mt-1">
                        {equipmentTypes.filter(item => item.category === cat).length} types available
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* STEP 2: Equipment type selection */}
            {modalStep === "select-equipment-type" && (
              <div>
                <Label>Equipment Type for {selectedCategoryCard}</Label>
                <Select
                  value={selectedEquipmentType ?? ""}
                  onValueChange={(val) => {
                    handleEquipmentTypeSelect(val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingEquipmentTypes ? "Loading..." : `Select ${selectedCategoryCard} type`} />
                  </SelectTrigger>
                  <SelectContent className="bg-black text-white border-gray-700 rounded-lg">
                    {isLoadingEquipmentTypes ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : equipmentTypes.filter((item) => item.category === selectedCategoryCard).length === 0 ? (
                      <SelectItem value="manual">No {selectedCategoryCard} types found</SelectItem>
                    ) : (
                      equipmentTypes
                        .filter((item) => item.category === selectedCategoryCard)
                        .map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name} {item.default_cost ? `— $${item.default_cost}` : ""}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                
                {/* Show message and option to proceed without selection */}
                {!isLoadingEquipmentTypes && equipmentTypes.filter((item) => item.category === selectedCategoryCard).length === 0 && (
                  <div className="mt-4 p-3 bg-amber-900/20 border border-amber-700/30 rounded-lg">
                    <p className="text-amber-400 text-sm mb-2">
                      No {selectedCategoryCard} types configured in admin settings.
                    </p>
                    <Button
                      onClick={() => {
                        setForm((prev: any) => ({ 
                          ...prev, 
                          category: selectedCategoryCard,
                          name: "",
                          cost: ""
                        }));
                        setModalStep("form");
                      }}
                      variant="outline"
                      className="w-full bg-amber-900/40 border-amber-700 text-amber-300 hover:bg-amber-800/40"
                    >
                      Continue with Manual Entry
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Form */}
            {modalStep === "form" && (
              <>
                <div>
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Item name"
                    className="bg-[#162a52] border-[#2a4375] text-white text-lg font-medium"
                  />
                </div>

                {/* Box Type only when Receiver */}
                {shouldShowBoxTypeAndExtras && (
                  <div className="mt-4">
                    <Label>Box Type</Label>
                    <Select
                      value={form.description}
                      onValueChange={(val) =>
                        setForm((prev: any) => ({
                          ...prev,
                          description: val,
                          serials: prev.serials && prev.serials.length ? prev.serials : [],
                        }))
                      }
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Serial </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                        placeholder="e.g. TL-001"
                        className="flex-1"
                        required
                      />
                      {shouldShowBoxTypeAndExtras && allowedExtraLabels.length > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addExtraSerial}
                          className="flex items-center gap-2"
                          disabled={!canAddExtra()}
                        >
                          <Plus className="h-4 w-4" /> Add
                        </Button>
                      )}
                    </div>

                    {/* Extras */}
                    {shouldShowBoxTypeAndExtras && form.serials && form.serials.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {form.serials.map((serial: string, idx: number) => {
                          const label = allowedExtraLabels[idx] ?? `Extra ${idx + 1}`;
                          return (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="min-w-[110px] text-xs text-slate-300 bg-slate-800 rounded-md px-2 py-2">
                                {label}
                              </div>
                              <Input
                                value={serial}
                                onChange={(e) => setExtraSerialValue(idx, e.target.value)}
                                placeholder={`${label} serial number`}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeExtraSerial(idx)}
                                className="text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {!selectedCategoryCard && (
                    <div>
                      <Label>Category</Label>
                      <Select
                        value={form.category}
                        onValueChange={(val) => {
                          setForm((prev: any) => ({
                            ...prev,
                            category: val,
                            ...(val !== "Receiver" ? { description: "", serials: [], equipment_type_id: "", equipment_type: "" } : {}),
                          }));
                          if (val === "Receiver") {
                            fetchEquipmentTypes();
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
                  )}
                </div>

                {!selectedCategoryCard && form.category === "Receiver" && (
                  <div>
                    <Label>Equipment Type (autofill name & cost)</Label>
                    <Select
                      value={form.equipment_type_id || form.equipment_type}
                      onValueChange={(val) => {
                        handleEquipmentTypeSelect(val);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingEquipmentTypes ? "Loading..." : "Select equipment type"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" disabled>
                          -- Select type --
                        </SelectItem>

                        {equipmentTypes.length === 0 && !isLoadingEquipmentTypes && (
                          <SelectItem value="manual">Manual / No types</SelectItem>
                        )}

                        {equipmentTypes
                          .filter((item) => item.category === form.category)
                          .map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.name} {item.default_cost ? `— $${item.default_cost}` : ""}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-400 mt-1">Cost is autofilled from admin settings but remains editable.</p>
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
                    <Label>Supplier</Label>
                    <Select
                      value={String(form.supplier || "")}
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
                            <SelectItem key={s.id} value={s.id.toString()} className="text-white">
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
              </>
            )}
          </div>

          <DialogFooter>
            <div className="flex gap-2">
              {modalStep !== "select-category" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (modalStep === "form") {
                      if ((selectedCategoryCard === "Receiver" || form.category === "Receiver") && selectedCategoryCard) {
                        setModalStep(selectedCategoryCard === "Receiver" ? "select-equipment-type" : "select-category");
                      } else {
                        setModalStep("select-category");
                        setSelectedCategoryCard(null);
                      }
                    } else if (modalStep === "select-equipment-type") {
                      setModalStep("select-category");
                      setSelectedEquipmentType(null);
                    }
                  }}
                >
                  ← Back
                </Button>
              )}

              {/* Only show Save/Add button on form step */}
              {modalStep === "form" && (
                <Button
                  onClick={handleSaveTool}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isEditMode ? "Save Changes" : "Add Item"}
                </Button>
              )}

              <Button
                onClick={() => {
                  setOpen(false);
                  resetForm();
                  setIsEditMode(false);
                  setEditingToolId(null);
                  setSelectedCategoryCard(null);
                  setSelectedEquipmentType(null);
                  setModalStep("select-category");
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Tools;