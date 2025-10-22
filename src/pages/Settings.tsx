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
  Settings as SettingsIcon, 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  Package,
  Building2,
  Tags,
  Shield
} from "lucide-react";
import { 
  getReceiverTypes, 
  createReceiverType, 
  updateReceiverType, 
  deleteReceiverType,
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "../services/api";
import { toast } from "sonner";

interface ReceiverType {
  id: string;
  name: string;
  default_cost: string;
  description?: string;
  created_at?: string;
}

interface Supplier {
  id: string;
  name: string;
  created_at?: string;
}

type DialogType = 'receiver' | 'supplier' | null;

const Settings: React.FC = () => {
  const [receiverTypes, setReceiverTypes] = useState<ReceiverType[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state for receiver types
  const [receiverForm, setReceiverForm] = useState({
    name: "",
    default_cost: "",
  });

  // Form state for suppliers
  const [supplierForm, setSupplierForm] = useState({
    name: "",
  });

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [receiverData, supplierData] = await Promise.all([
          getReceiverTypes(),
          getSuppliers()
        ]);
        
        // Transform API data to match our local types
        const transformedReceiverData = (receiverData || []).map((item: any) => ({
          ...item,
          default_cost: String(item.default_cost || ""),
          id: String(item.id)
        }));
        
        const transformedSupplierData = (supplierData || []).map((item: any) => ({
          ...item,
          id: String(item.id)
        }));
        
        setReceiverTypes(transformedReceiverData);
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

  const fetchReceiverTypes = async () => {
    try {
      const data = await getReceiverTypes();
      const transformedData = (data || []).map((item: any) => ({
        ...item,
        default_cost: String(item.default_cost || ""),
        id: String(item.id)
      }));
      setReceiverTypes(transformedData);
    } catch (err) {
      console.error("Error fetching receiver types:", err);
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
    setReceiverForm({ name: "", default_cost: "" });
    setSupplierForm({ name: "" });
    setIsEditMode(false);
    setEditingId(null);
  };

  // Receiver type dialogs
  const openAddReceiverDialog = () => {
    resetForms();
    setDialogType('receiver');
  };

  const openEditReceiverDialog = (type: ReceiverType) => {
    setReceiverForm({
      name: type.name || "",
      default_cost: type.default_cost || "",
    });
    setIsEditMode(true);
    setEditingId(type.id);
    setDialogType('receiver');
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

  const handleSaveReceiver = async () => {
  if (!receiverForm.name.trim()) {
    toast.error("Receiver type name is required");
    return;
  }
  if (!receiverForm.default_cost.trim() || isNaN(parseFloat(receiverForm.default_cost))) {
    toast.error("Valid default cost is required");
    return;
  }

  // Convert to string for the API
  const payload = {
    name: receiverForm.name.trim(),
    default_cost: receiverForm.default_cost, // Keep as string
  };

  try {
    let result: ReceiverType;
    if (isEditMode && editingId) {
      result = await updateReceiverType(editingId, payload);
      // Update local state
      setReceiverTypes(prev => prev.map(item => 
        item.id === editingId ? { ...result, default_cost: String(result.default_cost || "") } : item
      ));
      toast.success("Receiver type updated successfully");
    } else {
      result = await createReceiverType(payload);
      // Add to local state
      setReceiverTypes(prev => [...prev, { ...result, default_cost: String(result.default_cost || "") }]);
      toast.success("Receiver type created successfully");
    }
    setDialogType(null);
    resetForms();
  } catch (err) {
    console.error("Error saving receiver type:", err);
    toast.error("Failed to save receiver type");
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

  const handleDeleteReceiver = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this receiver type?")) return;
    try {
      await deleteReceiverType(id);
      toast.success("Receiver type deleted successfully");
      await fetchReceiverTypes();
    } catch (err) {
      console.error("Error deleting receiver type:", err);
      toast.error("Failed to delete receiver type");
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

        {/* Receiver Types Management - Darkest Blue */}
        <Card className="border-[#1e3a78]/80 bg-gradient-to-br from-[#0f1f3d] to-[#162a52]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Package className="h-5 w-5 text-blue-400" />
                  Receiver Types & Default Costs
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Define receiver types with default pricing for quick inventory entry
                </CardDescription>
              </div>
              <Button onClick={openAddReceiverDialog} className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg">
                <Plus className="h-4 w-4" />
                Add Receiver Type
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {receiverTypes.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-[#0a1628]/50 rounded-lg border border-[#1e3a78]/30">
                <div className="mx-auto w-16 h-16 bg-blue-950/50 rounded-full flex items-center justify-center">
                  <Package className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-gray-400 font-medium">No receiver types configured</p>
                <p className="text-sm text-gray-500">
                  Add receiver types to enable autofill when adding inventory items
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-[#1e3a78]/50 overflow-hidden bg-[#0a1628]/30">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#162a52]/40 hover:bg-[#162a52]/60 border-[#1e3a78]/50">
                      <TableHead className="text-blue-300 font-semibold">Receiver Type</TableHead>
                      <TableHead className="text-blue-300 font-semibold">Default Cost (USD)</TableHead>
                      <TableHead className="text-blue-300 font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receiverTypes.map((type) => (
                      <TableRow 
                        key={type.id} 
                        className="hover:bg-[#162a52]/30 transition-colors border-[#1e3a78]/30"
                      >
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
                              onClick={() => openEditReceiverDialog(type)}
                              className="h-8 w-8 text-blue-400 hover:bg-blue-950/50 hover:text-blue-300"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteReceiver(type.id)}
                              className="h-8 w-8 text-red-400 hover:bg-red-950/50 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
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
                    <span>Receiver types autofill item names and costs during inventory entry</span>
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

      {/* Receiver Type Dialog */}
      <Dialog open={dialogType === 'receiver'} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="max-w-2xl bg-[#0f1f3d] border-[#1e3a78]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {isEditMode ? (
                <>
                  <Edit2 className="h-5 w-5 text-blue-400" />
                  Edit Receiver Type
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-blue-400" />
                  Add New Receiver Type
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {isEditMode 
                ? "Update the receiver type details below"
                : "Configure a new receiver type with default pricing"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="receiver-name" className="text-sm font-medium text-gray-300">
                Receiver Type Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="receiver-name"
                value={receiverForm.name}
                onChange={(e) => setReceiverForm({ ...receiverForm, name: e.target.value })}
                placeholder="e.g. Base, Rover, RTK Base Station"
                className="bg-[#162a52] border-[#2a4375] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiver-cost" className="text-sm font-medium text-gray-300">
                Default Cost (USD) <span className="text-red-400">*</span>
              </Label>
              <Input
                id="receiver-cost"
                type="number"
                step="0.01"
                value={receiverForm.default_cost}
                onChange={(e) => setReceiverForm({ ...receiverForm, default_cost: e.target.value })}
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
                onClick={handleSaveReceiver}
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