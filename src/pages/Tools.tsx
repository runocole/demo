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
supplier?: string; // UUID
supplier_name?: string; // from serializer
category?: string;
invoice_number?: string;
date_added?: string;
serials?: string[]; // extras or full list
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
// modalStep now includes a dedicated "select-receiver-type" step
const [open, setOpen] = useState(false);
const [modalStep, setModalStep] = useState<
"select-category" | "select-receiver-type" | "form"
>("select-category");
const [selectedCategoryCard, setSelectedCategoryCard] = useState<string | null>(null);
const [selectedReceiverType, setSelectedReceiverType] = useState<string | null>(null); // stores id or name
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
code: "", // required main serial
cost: "",
stock: "1",
description: "", // box type (Base / Rover / Base and Rover)
supplier: "", // supplier id
category: "", // will be set from selection but hidden in final form
invoice_number: "",
serials: [], // extras (does NOT include main code)
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

// Fetch receiver types (used on demand)
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
fetchReceiverTypes(); // initial load (optional) — keep this if you want them available early
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
serials: [],
receiver_type_id: "",
receiver_type: "",
});

const openAddModal = () => {
resetForm();
setIsEditMode(false);
setEditingToolId(null);
setSelectedCategoryCard(null);
setSelectedReceiverType(null);
setModalStep("select-category");
setOpen(true);
};

const getAllowedExtraLabels = (boxType: string): string[] => {
if (boxType === "Rover" || boxType === "Base") {
return ["Data Logger"]; // maximum 1
}
if (boxType === "Base and Rover") {
return ["Receiver 2", "DataLogger", "External Radio"]; // maximum 3
}
return [];
};

const openEditModal = (tool: Tool) => {
// If tool.serials includes the main code, exclude it when populating extras
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
receiver_type_id: tool.receiver_type_id || "",
receiver_type: tool.receiver_type || "",
});

setIsEditMode(true);
setEditingToolId(tool.id ?? null);
setSelectedCategoryCard(tool.category || null);

// If the tool is a Receiver, preselect its receiver type
if (tool.category === "Receiver") {
// ensure receiver types are loaded
fetchReceiverTypes().then(() => {
// prefer id if available, otherwise name
const rtId = tool.receiver_type_id ? String(tool.receiver_type_id) : "";
const found = receiverTypes.find((r) => String(r.id) === String(rtId) || r.name === tool.receiver_type);
if (found) {
setSelectedReceiverType(String(found.id));
} else {
// fallback to the raw value
setSelectedReceiverType(tool.receiver_type_id ? String(tool.receiver_type_id) : tool.receiver_type || null);
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

/* ---------------- Serial extras logic (top area) ---------------- */
// show box type/extras only when final form step and category is Receiver (either selectedCategoryCard or form.category)
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

/* ---------------- Save / Update ---------------- */
const handleSaveTool = async () => {
// basic validation
if (!String(form.name || "").trim() || !String(form.code || "").trim() || !String(form.cost || "").trim()) {
alert("Please fill in required fields: Name, Serial (Code), Cost.");
return;
}

const parsedStock = Math.max(0, Number(form.stock) || 0);

// determine final category & receiver type from selected states first
const finalCategory = selectedCategoryCard || form.category || "";
let finalReceiverTypeName = "";
let finalReceiverTypeId: any = form.receiver_type_id || "";

if (selectedReceiverType) {
// If selectedReceiverType is an id -> find its name
const found = receiverTypes.find((r) => String(r.id) === String(selectedReceiverType));
if (found) {
finalReceiverTypeName = found.name;
finalReceiverTypeId = found.id;
} else {
// fallback to raw string
finalReceiverTypeName = selectedReceiverType;
finalReceiverTypeId = selectedReceiverType;
}
} else if (form.receiver_type) {
finalReceiverTypeName = form.receiver_type;
finalReceiverTypeId = form.receiver_type_id || "";
}

// prepare payload according to your requested schema
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

// serials: main serial + extras (if any)
const extrasArr = (Array.isArray(form.serials) ? form.serials : [])
.map((s: any) => String(s || "").trim())
.filter((s: string) => s !== "");

if (finalCategory === "Receiver") {
// ensure main code is included first
payload.serials = [String(form.code).trim(), ...extrasArr];
} else {
// non-receiver: if extras present, include them after main as well
const allSerials = [String(form.code).trim(), ...extrasArr].filter(Boolean);
if (allSerials.length > 0) payload.serials = allSerials;
}

if (finalReceiverTypeName && String(finalReceiverTypeName).trim() !== "") {
payload.receiver_type = String(finalReceiverTypeName).trim();
}
if (finalReceiverTypeId) payload.receiver_type_id = finalReceiverTypeId;

// Create or update
if (isEditMode && editingToolId) {
try {
const updated = await updateTool(editingToolId, payload);
const normalized: Tool = {
...updated,
stock: typeof updated.stock === "number" ? updated.stock : Number(updated.stock || parsedStock),
serials: Array.isArray(updated.serials) ? updated.serials : payload.serials || [],
receiver_type: updated.receiver_type ?? payload.receiver_type ?? "",
receiver_type_id: updated.receiver_type_id ?? payload.receiver_type_id ?? "",
};
setTools((prev) => prev.map((t) => (t.id === editingToolId ? normalized : t)));
setOpen(false);
resetForm();
setIsEditMode(false);
setEditingToolId(null);
setSelectedCategoryCard(null);
setSelectedReceiverType(null);
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
alert(`Tool "${existing.code}" already exists. Quantity increased by ${parsedStock}.`);
} else {
const created = await createTool(payload);
const normalizedCreated: Tool = {
...created,
stock: typeof created.stock === "number" ? created.stock : Number(created.stock || parsedStock),
serials: Array.isArray(created.serials) ? created.serials : payload.serials || [],
receiver_type: created.receiver_type ?? payload.receiver_type ?? "",
receiver_type_id: created.receiver_type_id ?? payload.receiver_type_id ?? "",
};
setTools((prev) => [normalizedCreated, ...prev]);
}
setOpen(false);
resetForm();
setSelectedCategoryCard(null);
setSelectedReceiverType(null);
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
const found = receiverTypes.find((r) => String(r.id) === String(val) || r.name === val);
if (found) {
setSelectedReceiverType(String(found.id));
// populate form name & cost if blank
setForm((prev: any) => ({
...prev,
receiver_type_id: found.id,
receiver_type: found.name,
name: prev.name || found.name,
cost: prev.cost || String(found.default_cost ?? prev.cost),
}));
} else {
// manual
setSelectedReceiverType(val);
setForm((prev: any) => ({ ...prev, receiver_type_id: "", receiver_type: val }));
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
t.supplier_name || t.supplier || "—",
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
<p className="text-xs text-gray-500">Added: {tool.date_added ? new Date(tool.date_added).toLocaleDateString() : "—"}</p>
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
<p className="text-sm">{tool.supplier_name || "—"}</p>

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
setSelectedReceiverType(null);
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
: modalStep === "select-receiver-type"
? "Select the receiver type for this Receiver"
: `Fill in the fields below to ${isEditMode ? "update" : "create"} a tool.`}
</DialogDescription>
</DialogHeader>

<div className="space-y-4 py-2">
{/* ---- STEP 1: Category selection (cards) ---- */}
{modalStep === "select-category" && (
<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
{CATEGORY_OPTIONS.map((cat) => (
<Card
key={cat}
className={`p-4 cursor-pointer hover:scale-105 transform ${selectedCategoryCard === cat ? "ring-2 ring-blue-500" : ""}`}
onClick={() => {
setSelectedCategoryCard(cat);
}}
>
<CardContent>
<div className="text-lg font-semibold">{cat}</div>
<div className="text-xs text-gray-400 mt-1">Add {cat} items</div>
</CardContent>
</Card>
))}
</div>
)}

{/* ---- STEP 2: Receiver type selection (only if Receiver chosen) ---- */}
{modalStep === "select-receiver-type" && (
<div>
<Label>Receiver Type</Label>
<Select
value={selectedReceiverType ?? ""}
onValueChange={(val) => {
handleReceiverTypeSelect(val);
}}
>
<SelectTrigger>
<SelectValue placeholder={isLoadingReceiverTypes ? "Loading..." : "Select receiver type"} />
</SelectTrigger>
<SelectContent>
{isLoadingReceiverTypes ? (
  <SelectItem value="loading" disabled>
    Loading...
  </SelectItem>
) : receiverTypes.length === 0 ? (
  <SelectItem value="manual">No receiver types found — enter manual</SelectItem>
) : (
  receiverTypes.map((r) => (
    <SelectItem key={r.id} value={String(r.id)}>
      {r.name} {r.default_cost ? `— $${r.default_cost}` : ""}
    </SelectItem>
  ))
)}

</SelectContent>
</Select>
</div>
)}

{/* ---- STEP 3: Form ---- */}
{modalStep === "form" && (
<>
<div>
<Label>Name</Label>
{/* name is editable and may have been prefilled when receiver type selected */}
<Input
value={form.name}
onChange={(e) => setForm({ ...form, name: e.target.value })}
placeholder="Item name"
/>
</div>

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

{/* Extras (vertical list) */}
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

{/* Only show Category selector in final form if the user DID NOT pick it earlier */}
{!selectedCategoryCard && (
<div>
<Label>Category</Label>
<Select
value={form.category}
onValueChange={(val) => {
setForm((prev: any) => ({
...prev,
category: val,
...(val !== "Receiver" ? { description: "", serials: [], receiver_type_id: "", receiver_type: "" } : {}),
}));
if (val === "Receiver") {
fetchReceiverTypes();
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

{/* If neither selectedCategoryCard nor selectedReceiverType was provided, the final form still shows the Receiver type select.
But because we want it removed when preselected, we DON'T render receiver-type here when a selection was pre-made.
*/}
{!selectedCategoryCard && form.category === "Receiver" && (
<div>
<Label>Receiver Type (autofill name & cost)</Label>
<Select
value={form.receiver_type_id || form.receiver_type}
onValueChange={(val) => {
handleReceiverTypeSelect(val);
}}
>
<SelectTrigger>
<SelectValue placeholder={isLoadingReceiverTypes ? "Loading..." : "Select receiver type"} />
</SelectTrigger>
<SelectContent>
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
<Label>Stock</Label>
<Input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="1" />
</div>

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
</>
)}
</div>

<DialogFooter>
<div className="flex gap-2">
{modalStep !== "select-category" && (
<Button
variant="outline"
onClick={() => {
// step back
if (modalStep === "form") {
// if we were in form, go back to receiver-type selection if category is Receiver and was selected via modal step
if ((selectedCategoryCard === "Receiver" || form.category === "Receiver") && selectedCategoryCard) {
// if category was selected via cards and it is Receiver, go back to select-receiver-type
setModalStep(selectedCategoryCard === "Receiver" ? "select-receiver-type" : "select-category");
} else {
setModalStep("select-category");
setSelectedCategoryCard(null);
}
} else if (modalStep === "select-receiver-type") {
setModalStep("select-category");
setSelectedReceiverType(null);
}
}}
>
← Back
</Button>
)}

<Button
onClick={() => {
if (modalStep === "select-category") {
// if category chosen jump to either receiver-type or form
if (!selectedCategoryCard) {
alert("Choose a category first.");
return;
}
// If receiver chosen, go to receiver-type step, else go to form
if (selectedCategoryCard === "Receiver") {
// ensure receiver types are fresh
fetchReceiverTypes();
setModalStep("select-receiver-type");
} else {
// set category on form and proceed to form
setForm((prev: any) => ({ ...prev, category: selectedCategoryCard }));
setModalStep("form");
}
} else if (modalStep === "select-receiver-type") {
// ensure a receiver type was chosen (or allow manual)
if (!selectedReceiverType && !form.receiver_type) {
alert("Choose a receiver type first.");
return;
}
// ensure category is set on form
setForm((prev: any) => ({ ...prev, category: selectedCategoryCard || "Receiver" }));
// modal->form. Hide category & receiver fields in the form because they are preselected
setModalStep("form");
} else {
// final step: save
handleSaveTool();
}
}}
className="bg-blue-600 hover:bg-blue-700"
>
{modalStep === "select-category"
? "Next"
: modalStep === "select-receiver-type"
? "Next"
: (isEditMode ? "Save Changes" : "Add Item")}
</Button>

<Button
onClick={() => {
setOpen(false);
resetForm();
setIsEditMode(false);
setEditingToolId(null);
setSelectedCategoryCard(null);
setSelectedReceiverType(null);
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
