import React, { useEffect, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { 
  Settings as SettingsIcon, 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  Package,
  Building2,
  Tags,
  Shield,
  Satellite,
  Navigation,
  Ruler,
  Drone,
  Waves,
  Scan,
  Box
} from "lucide-react";
import { 
  getEquipmentTypes, 
  createEquipmentType, 
  updateEquipmentType, 
  deleteEquipmentType,
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "../services/api";
import { toast } from "sonner";

// Update interface name from ReceiverType to EquipmentType
interface EquipmentType {
  id: string;
  name: string;
  default_cost: string;
  description?: string;
  created_at?: string;
  category: string;
}

interface Supplier {
  id: string;
  name: string;
  created_at?: string;
}

type DialogType = 'equipment' | 'supplier' | null; // Changed from 'receiver' to 'equipment'

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

const CATEGORY_ICONS = {
  "Receiver": Satellite,
  "Accessory": Drone,
  "Total Station": Navigation,
  "Level": Ruler,
  "Drones": Drone,
  "EcoSounder": Waves,
  "Laser Scanner": Scan,
  "Other": Box
};

const Settings: React.FC = () => {
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]); // Changed from receiverTypes
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Form state for equipment types
  const [equipmentForm, setEquipmentForm] = useState({ // Changed from receiverForm
    name: "",
    default_cost: "",
    category: "Receiver",
  });

  // Form state for suppliers
  const [supplierForm, setSupplierForm] = useState({
    name: "",
  });

  // Filter equipment types by category
  const filteredEquipmentTypes = categoryFilter === "all" 
    ? equipmentTypes 
    : equipmentTypes.filter(type => type.category === categoryFilter);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [equipmentData, supplierData] = await Promise.all([
          getEquipmentTypes(), // Changed from getReceiverTypes
          getSuppliers()
        ]);
        
        // Transform API data to match our local types
        const transformedEquipmentData = (equipmentData || []).map((item: any) => ({
          ...item,
          default_cost: String(item.default_cost || ""),
          id: String(item.id),
          category: item.category || "Receiver"
        }));
        
        const transformedSupplierData = (supplierData || []).map((item: any) => ({
          ...item,
          id: String(item.id)
        }));
        
        setEquipmentTypes(transformedEquipmentData); // Changed from setReceiverTypes
        setSuppliers(transformedSupplierData);
      } catch (err) {
        console.error("Error fetching settings data:", err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchEquipmentTypes = async () => { // Changed from fetchReceiverTypes
    try {
      const data = await getEquipmentTypes(); // Changed from getReceiverTypes
      const transformedData = (data || []).map((item: any) => ({
        ...item,
        default_cost: String(item.default_cost || ""),
        id: String(item.id),
        category: item.category || "Receiver"
      }));
      setEquipmentTypes(transformedData); // Changed from setReceiverTypes
    } catch (err) {
      console.error("Error fetching equipment types:", err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const data = await getSuppliers();
      const transformedData = (data || []).map((item: any) => ({
        ...item,
        id: String(item.id)
      }));
      setSuppliers(transformedData);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const resetForms = () => {
    setEquipmentForm({ name: "", default_cost: "", category: "Receiver" }); // Changed from receiverForm
    setSupplierForm({ name: "" });
    setIsEditMode(false);
    setEditingId(null);
  };

  // Equipment type dialogs
  const openAddEquipmentDialog = () => { // Changed from openAddReceiverDialog
    resetForms();
    setDialogType('equipment'); // Changed from 'receiver'
  };

  const openEditEquipmentDialog = (type: EquipmentType) => { // Changed from openEditReceiverDialog
    setEquipmentForm({
      name: type.name || "",
      default_cost: type.default_cost || "",
      category: type.category || "Receiver",
    });
    setIsEditMode(true);
    setEditingId(type.id);
    setDialogType('equipment'); // Changed from 'receiver'
  };

  // Supplier dialogs
  const openAddSupplierDialog = () => {
    resetForms();
    setDialogType('supplier');
  };

  const openEditSupplierDialog = (supplier: Supplier) => {
    setSupplierForm({
      name: supplier.name || "",
    });
    setIsEditMode(true);
    setEditingId(supplier.id);
    setDialogType('supplier');
  };

  const handleSaveEquipment = async () => { // Changed from handleSaveReceiver
    if (!equipmentForm.name.trim()) {
      toast.error("Equipment name is required");
      return;
    }
    if (!equipmentForm.default_cost.trim() || isNaN(parseFloat(equipmentForm.default_cost))) {
      toast.error("Valid default cost is required");
      return;
    }
    if (!equipmentForm.category) {
      toast.error("Category is required");
      return;
    }

    // Convert to string for the API
    const payload = {
      name: equipmentForm.name.trim(),
      default_cost: equipmentForm.default_cost,
      category: equipmentForm.category,
    };

    try {
      let result: EquipmentType;
      if (isEditMode && editingId) {
        result = await updateEquipmentType(editingId, payload); // Changed from updateReceiverType
        // Update local state
        setEquipmentTypes(prev => prev.map(item => 
          item.id === editingId ? { ...result, default_cost: String(result.default_cost || "") } : item
        ));
        toast.success("Equipment type updated successfully");
      } else {
        result = await createEquipmentType(payload); // Changed from createReceiverType
        // Add to local state
        setEquipmentTypes(prev => [...prev, { ...result, default_cost: String(result.default_cost || "") }]);
        toast.success("Equipment type created successfully");
      }
      setDialogType(null);
      resetForms();
    } catch (err) {
      console.error("Error saving equipment type:", err);
      toast.error("Failed to save equipment type");
    }
  };

  const handleSaveSupplier = async () => {
    if (!supplierForm.name.trim()) {
      toast.error("Supplier name is required");
      return;
    }

    const payload = {
      name: supplierForm.name.trim(),
    };

    try {
      let result: Supplier;
      if (isEditMode && editingId) {
        result = await updateSupplier(editingId, payload);
        // Update local state
        setSuppliers(prev => prev.map(item => 
          item.id === editingId ? result : item
        ));
        toast.success("Supplier updated successfully");
      } else {
        result = await createSupplier(payload);
        // Add to local state
        setSuppliers(prev => [...prev, result]);
        toast.success("Supplier created successfully");
      }
      setDialogType(null);
      resetForms();
    } catch (err) {
      console.error("Error saving supplier:", err);
      toast.error("Failed to save supplier");
    }
  };

  const handleDeleteEquipment = async (id: string) => { // Changed from handleDeleteReceiver
    if (!window.confirm("Are you sure you want to delete this equipment type?")) return;
    try {
      await deleteEquipmentType(id); // Changed from deleteReceiverType
      toast.success("Equipment type deleted successfully");
      await fetchEquipmentTypes(); // Changed from fetchReceiverTypes
    } catch (err) {
      console.error("Error deleting equipment type:", err);
      toast.error("Failed to delete equipment type");
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await deleteSupplier(id);
      toast.success("Supplier deleted successfully");
      await fetchSuppliers();
    } catch (err) {
      console.error("Error deleting supplier:", err);
      toast.error("Failed to delete supplier");
    }
  };

  // Get category counts for the cards
  const getCategoryCounts = () => {
    const counts: { [key: string]: number } = {};
    CATEGORY_OPTIONS.forEach(category => {
      counts[category] = equipmentTypes.filter(type => type.category === category).length; // Changed from receiverTypes
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <Package className="h-8 w-8 animate-spin mx-auto text-blue-500" />
            <p className="text-gray-400">Loading settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                <SettingsIcon className="h-7 w-7 text-blue-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Admin Settings</h2>
                <p className="text-gray-400">
                  Configure system defaults, manage suppliers, and customize inventory options
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Categories Grid */}
        <Card className="border-[#1e3a78]/80 bg-gradient-to-br from-[#0f1f3d] to-[#162a52]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Package className="h-5 w-5 text-blue-400" />
                  Equipment Categories
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage equipment types across different categories with default pricing
                </CardDescription>
              </div>
              <Button onClick={openAddEquipmentDialog} className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg">
                <Plus className="h-4 w-4" />
                Add Equipment Type
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              {CATEGORY_OPTIONS.map((category) => {
                const IconComponent = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
                const count = categoryCounts[category];
                return (
                  <Card 
                    key={category} 
                    className={`bg-[#0a1628]/40 border-[#1e3a78]/40 hover:border-[#1e3a78]/70 transition-all hover:shadow-lg cursor-pointer ${
                      categoryFilter === category ? 'ring-2 ring-blue-500 border-blue-500' : ''
                    }`}
                    onClick={() => setCategoryFilter(categoryFilter === category ? 'all' : category)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-600/20 rounded-lg">
                            <IconComponent className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm">{category}</h3>
                            <p className="text-xs text-gray-400">{count} items</p>
                          </div>
                        </div>
                        {categoryFilter === category && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Equipment Types Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {categoryFilter === 'all' ? 'All Equipment Types' : `${categoryFilter} Equipment Types`}
                </h3>
                <div className="flex gap-2 items-center">
                  <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val)}>
                    <SelectTrigger className="w-44 bg-[#0a1628] border-[#1e3a78] text-white">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f1f3d] text-white border-[#1e3a78] rounded-lg">
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORY_OPTIONS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredEquipmentTypes.length === 0 ? (
                <div className="text-center py-12 space-y-3 bg-[#0a1628]/50 rounded-lg border border-[#1e3a78]/30">
                  <div className="mx-auto w-16 h-16 bg-blue-950/50 rounded-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-blue-400" />
                  </div>
                  <p className="text-gray-400 font-medium">No equipment types configured</p>
                  <p className="text-sm text-gray-500">
                    {categoryFilter === 'all' 
                      ? "Add equipment types to enable autofill when adding inventory items"
                      : `No ${categoryFilter.toLowerCase()} equipment types found`}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-[#1e3a78]/50 overflow-hidden bg-[#0a1628]/30">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#162a52]/40 hover:bg-[#162a52]/60 border-[#1e3a78]/50">
                        <TableHead className="text-blue-300 font-semibold">Category</TableHead>
                        <TableHead className="text-blue-300 font-semibold">Equipment Type</TableHead>
                        <TableHead className="text-blue-300 font-semibold">Default Cost (USD)</TableHead>
                        <TableHead className="text-blue-300 font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEquipmentTypes.map((type) => {
                        const CategoryIcon = CATEGORY_ICONS[type.category as keyof typeof CATEGORY_ICONS] || Box;
                        return (
                          <TableRow 
                            key={type.id} 
                            className="hover:bg-[#162a52]/30 transition-colors border-[#1e3a78]/30"
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CategoryIcon className="h-4 w-4 text-blue-400" />
                                <span className="text-white">{type.category}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-white">{type.name}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-950/40 text-green-400 rounded-md font-semibold border border-green-800/30">
                                ${type.default_cost}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditEquipmentDialog(type)}
                                  className="h-8 w-8 text-blue-400 hover:bg-blue-950/50 hover:text-blue-300"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteEquipment(type.id)}
                                  className="h-8 w-8 text-red-400 hover:bg-red-950/50 hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Supplier Management - Medium Blue */}
        <Card className="border-[#2a4375]/80 bg-gradient-to-br from-[#162a52] to-[#1e3a78]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Building2 className="h-5 w-5 text-blue-400" />
                  Supplier Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your equipment suppliers
                </CardDescription>
              </div>
              <Button onClick={openAddSupplierDialog} className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg">
                <Plus className="h-4 w-4" />
                Add Supplier
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {suppliers.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-[#0f1f3d]/50 rounded-lg border border-[#2a4375]/30">
                <div className="mx-auto w-16 h-16 bg-blue-950/50 rounded-full flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-gray-400 font-medium">No suppliers configured</p>
                <p className="text-sm text-gray-500">
                  Add suppliers to track equipment sources
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {suppliers.map((supplier) => (
                  <Card key={supplier.id} className="bg-[#0f1f3d]/40 border-[#2a4375]/40 hover:border-[#2a4375]/70 transition-all hover:shadow-lg">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <h3 className="font-semibold text-lg text-white">{supplier.name}</h3>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditSupplierDialog(supplier)}
                            className="h-8 w-8 text-blue-400 hover:bg-blue-950/50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSupplier(supplier.id)}
                            className="h-8 w-8 text-red-400 hover:bg-red-950/50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Info Card - Lightest Blue */}
        <Card className="border-[#3d5a9e]/60 bg-gradient-to-br from-[#1e3a78] to-[#2a4375]">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="text-lg font-semibold text-blue-300">System Configuration</h3>
                <div className="grid gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Tags className="h-4 w-4 text-blue-400" />
                    <span>Equipment types autofill item names and costs during inventory entry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-400" />
                    <span>Supplier list appears in dropdown when adding new inventory items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-400" />
                    <span>All costs are stored in USD with real-time NGN conversion</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Type Dialog */}
      <Dialog open={dialogType === 'equipment'} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="max-w-2xl bg-[#0f1f3d] border-[#1e3a78]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {isEditMode ? (
                <>
                  <Edit2 className="h-5 w-5 text-blue-400" />
                  Edit Equipment Type
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-blue-400" />
                  Add New Equipment Type
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {isEditMode 
                ? "Update the equipment type details below"
                : "Configure a new equipment type with default pricing"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="equipment-category" className="text-sm font-medium text-gray-300">
                Category <span className="text-red-400">*</span>
              </Label>
              <Select 
                value={equipmentForm.category} 
                onValueChange={(value) => setEquipmentForm({ ...equipmentForm, category: value })}
              >
                <SelectTrigger className="bg-[#162a52] border-[#2a4375] text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1f3d] text-white border-[#1e3a78]">
                  {CATEGORY_OPTIONS.map((category) => {
                    const IconComponent = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
                    return (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {category}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment-name" className="text-sm font-medium text-gray-300">
                Equipment Type Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="equipment-name"
                value={equipmentForm.name}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                placeholder="e.g. GNSS Receiver, Tripod, RTK Base Station"
                className="bg-[#162a52] border-[#2a4375] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment-cost" className="text-sm font-medium text-gray-300">
                Default Cost (USD) <span className="text-red-400">*</span>
              </Label>
              <Input
                id="equipment-cost"
                type="number"
                step="0.01"
                value={equipmentForm.default_cost}
                onChange={(e) => setEquipmentForm({ ...equipmentForm, default_cost: e.target.value })}
                placeholder="0.00"
                className="bg-[#162a52] border-[#2a4375] text-white text-lg font-medium"
              />
              <p className="text-xs text-gray-400">
                This cost will autofill when creating inventory items
              </p>
            </div>
          </div>

          <DialogFooter>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setDialogType(null)}
                className="flex-1 sm:flex-none border-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEquipment}
                className="flex-1 sm:flex-none gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                {isEditMode ? "Save Changes" : "Create Type"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Supplier Dialog */}
      <Dialog open={dialogType === 'supplier'} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="max-w-2xl bg-[#0f1f3d] border-[#1e3a78]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {isEditMode ? (
                <>
                  <Edit2 className="h-5 w-5 text-blue-400" />
                  Edit Supplier
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-blue-400" />
                  Add New Supplier
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {isEditMode 
                ? "Update the supplier details below"
                : "Add a new supplier to your inventory system"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="supplier-name" className="text-sm font-medium text-gray-300">
                Supplier Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="supplier-name"
                value={supplierForm.name}
                onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                placeholder="e.g. COMNAV TECHNOLOGY, GINTEC"
                className="bg-[#162a52] border-[#2a4375] text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setDialogType(null)}
                className="flex-1 sm:flex-none border-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveSupplier}
                className="flex-1 sm:flex-none gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                {isEditMode ? "Save Changes" : "Add Supplier"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Settings;