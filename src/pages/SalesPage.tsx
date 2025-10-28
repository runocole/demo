import { useEffect, useState } from "react";
import { Plus, FileText, Search, X, Trash2, Edit } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import { DashboardLayout } from "../components/DashboardLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

// New interfaces for multi-item sales
interface SaleItem {
  tool_id: string;
  equipment: string;
  cost: string;
  category?: string;
}

interface Sale {
  id: number;
  customer_id?: number;
  name: string;
  phone: string;
  state: string;
  items: SaleItem[];
  total_cost: string;
  date_sold: string;
  invoice_number?: string;
  payment_plan?: string;
  expiry_date?: string;
  payment_status?: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  state: string;
  user?: number;
}

interface Tool {
  id: string;
  name: string;
  code: string;
  category: string;
  cost: string | number;
  stock: number;
  description?: string;
  supplier?: string;
  supplier_name?: string;
  invoice_number?: string;
  expiry_date?: string;
  date_added?: string;
  serials?: string[];
  equipment_type?: string | null;
  equipment_type_id?: string | null;
}

const API_URL = "http://localhost:8000/api";

const TOOL_CATEGORIES = [
  "Receiver",
  "Accessory",
  "Total Station",
  "Level",
  "Drones",
  "EcoSounder",
  "Laser Scanner",
  "Other",
];

// Payment status options
const PAYMENT_STATUSES = [
  "pending",
  "completed",
  "installment",
  "failed",
  "cancelled"
];

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Multi-item state
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [currentItem, setCurrentItem] = useState<{
    selectedCategory: string;
    selectedTool: Tool | null;
    cost: string;
  }>({
    selectedCategory: "",
    selectedTool: null,
    cost: ""
  });

  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [saleDetails, setSaleDetails] = useState({
    payment_plan: "",
    expiry_date: ""
  });

  // Edit status state
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editStatusOpen, setEditStatusOpen] = useState(false);
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const token = localStorage.getItem("access");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [salesRes, custRes, toolsRes] = await Promise.all([
          axios.get(`${API_URL}/sales/`, axiosConfig),
          axios.get(`${API_URL}/customers/`, axiosConfig),
          axios.get(`${API_URL}/tools/`, axiosConfig),
        ]);
        setSales(salesRes.data);
        setCustomers(custRes.data);
        setTools(toolsRes.data);
        
        const storedCustomer = localStorage.getItem('selectedCustomer');
        if (storedCustomer) {
          const customerData = JSON.parse(storedCustomer);
          setSelectedCustomer(customerData);
          setOpen(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (currentItem.selectedCategory) {
      const filtered = tools.filter(tool => 
        tool.category?.toLowerCase() === currentItem.selectedCategory.toLowerCase()
      );
      setFilteredTools(filtered);
    } else {
      setFilteredTools([]);
    }
  }, [currentItem.selectedCategory, tools]);

  // Calculate total cost
  const totalCost = saleItems.reduce((sum, item) => sum + parseFloat(item.cost || "0"), 0);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(query.toLowerCase()) ||
      customer.phone.includes(query) ||
      customer.email.toLowerCase().includes(query.toLowerCase()) ||
      customer.state.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filtered);
    setShowSearchResults(true);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSearchQuery("");
    setShowSearchResults(false);
    setOpen(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleCategorySelect = (category: string) => {
    setCurrentItem(prev => ({
      ...prev,
      selectedCategory: category,
      selectedTool: null,
      cost: ""
    }));
  };

  const handleToolSelect = (toolId: string) => {
    const selected = tools.find(tool => tool.id === toolId);
    
    if (selected) {
      setCurrentItem(prev => ({
        ...prev,
        selectedTool: selected,
        cost: prev.cost || String(selected.cost || "") // Pre-fill with tool cost as suggestion
      }));
    }
  };

  const addItemToSale = () => {
    if (!currentItem.selectedTool || !currentItem.cost) {
      alert("Please select equipment and enter a cost.");
      return;
    }

    const newItem: SaleItem = {
      tool_id: currentItem.selectedTool.id,
      equipment: currentItem.selectedTool.name,
      cost: currentItem.cost,
      category: currentItem.selectedCategory
    };

    setSaleItems(prev => [...prev, newItem]);
    
    // Reset current item form
    setCurrentItem({
      selectedCategory: "",
      selectedTool: null,
      cost: ""
    });
    setFilteredTools([]);
  };

  const removeItemFromSale = (index: number) => {
    setSaleItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearCurrentSelection = () => {
    setCurrentItem({
      selectedCategory: "",
      selectedTool: null,
      cost: ""
    });
    setFilteredTools([]);
  };

  const resetForm = () => {
    setSaleItems([]);
    setCurrentItem({
      selectedCategory: "",
      selectedTool: null,
      cost: ""
    });
    setSaleDetails({
      payment_plan: "",
      expiry_date: ""
    });
    setSelectedCustomer(null);
    setOpen(false);
    setIsSubmitting(false);
  };

  const sendEmail = async (email: string, name: string, items: SaleItem[], total: number, invoiceNumber?: string) => {
    try {
      const itemList = items.map(item => `• ${item.equipment} - ₦${parseFloat(item.cost).toLocaleString()}`).join('\n');
      
      await axios.post(`${API_URL}/send-sale-email/`, {
        to_email: email,
        subject: `Your Invoice ${invoiceNumber ? `- ${invoiceNumber}` : ''}`,
        message: `Hello ${name},\n\nThank you for your purchase! Here's your invoice:\n\n${itemList}\n\nTotal: ₦${total.toLocaleString()}\n\nPayment link: [Paystack Link Here]\n\nBest regards,\nYour Company`,
      });
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleAction = async (action: "cancel" | "draft" | "send") => {
    if (action === "cancel") return resetForm();

    if (!selectedCustomer) {
      alert("Please select a customer first.");
      return;
    }

    if (saleItems.length === 0) {
      alert("Please add at least one item to the sale.");
      return;
    }

    if (action === "draft" || action === "send") {
      setIsSubmitting(true);
      try {
        const payload = {
          name: selectedCustomer.name,
          phone: selectedCustomer.phone,
          state: selectedCustomer.state,
          items: saleItems,
          total_cost: totalCost.toString(),
          payment_plan: saleDetails.payment_plan || "",
          expiry_date: saleDetails.expiry_date || null,
          date_sold: new Date().toISOString().split('T')[0],
        };

        console.log("Sending payload:", payload);

        const res = await axios.post(`${API_URL}/sales/`, payload, axiosConfig);
        setSales((prev) => [res.data, ...prev]);

        if (action === "send" && selectedCustomer?.email) {
          await sendEmail(
            selectedCustomer.email, 
            selectedCustomer.name, 
            saleItems, 
            totalCost,
            res.data.invoice_number
          );
        }

        resetForm();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error adding sale:", error);
          console.error("Error response:", error.response?.data);
          alert(error.response?.data?.message || "Failed to save sale. Please check all fields.");
        } else if (error instanceof Error) {
          console.error("Unexpected error:", error.message);
          alert("Unexpected error occurred.");
        } else {
          console.error("Unknown error:", error);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Edit status functions
  const openEditStatus = (sale: Sale) => {
    setEditingSale(sale);
    setNewPaymentStatus(sale.payment_status || "pending");
    setEditStatusOpen(true);
  };

  const closeEditStatus = () => {
    setEditingSale(null);
    setNewPaymentStatus("");
    setEditStatusOpen(false);
  };

  const updatePaymentStatus = async () => {
    if (!editingSale || !newPaymentStatus) return;

    setIsUpdatingStatus(true);
    try {
      const payload = {
        payment_status: newPaymentStatus
      };

      const res = await axios.patch(`${API_URL}/sales/${editingSale.id}/`, payload, axiosConfig);
      
      // Update the sale in local state
      setSales(prev => prev.map(sale => 
        sale.id === editingSale.id ? { ...sale, payment_status: newPaymentStatus } : sale
      ));

      closeEditStatus();
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("My Sales Records", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [
        [
          "Client",
          "Phone", 
          "State",
          "Equipment",
          "Cost",
          "Date Sold",
          "Invoice",
          "Payment Plan",
          "Expiry",
          "Status",
        ],
      ],
      body: sales.map((s) => [
        s.name,
        s.phone,
        s.state,
        s.items.map(item => item.equipment).join(', '),
        `₦${s.total_cost}`,
        s.date_sold,
        s.invoice_number || "-",
        s.payment_plan || "-",
        s.expiry_date || "-",
        s.payment_status || "-",
      ]),
      styles: { fontSize: 8 },
    });
    doc.save("my_sales_records.pdf");
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Customer Search Section */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Find Customer for New Sale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search customers by name, phone, email, or state..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-10 text-white bg-slate-800 border-slate-600 focus:border-blue-500 placeholder-gray-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Button
                  onClick={() => setOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sale Manually
                </Button>
              </div>

              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-md shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                  {searchResults.map((customer) => (
                    <div
                      key={customer.id}
                      className="p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-600 last:border-b-0 transition-colors"
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white">{customer.name}</p>
                          <p className="text-sm text-gray-300">{customer.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-300">{customer.email}</p>
                          <p className="text-sm text-gray-300">{customer.state}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showSearchResults && searchQuery && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-md shadow-lg z-10 mt-1 p-4">
                  <p className="text-gray-300 text-center">No customers found matching your search.</p>
                </div>
              )}
            </div>

            {selectedCustomer && (
              <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-blue-300">Selected Customer</h3>
                    <p className="text-sm text-gray-300">
                      {selectedCustomer.name} • {selectedCustomer.phone} • {selectedCustomer.email} • {selectedCustomer.state}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomer(null);
                      resetForm();
                    }}
                    className="text-red-400 border-red-600 hover:bg-red-900/30 hover:text-red-300"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={exportPDF}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
          
        {/* Updated Sale Dialog with Multi-Item Support */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Sale</DialogTitle>
            </DialogHeader>

            {selectedCustomer ? (
              <div className="bg-blue-900/20 p-4 rounded-md mb-4 border border-blue-700">
                <h3 className="font-semibold text-blue-300 mb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                  <div>
                    <span className="font-medium text-blue-300">Name:</span> {selectedCustomer.name}
                  </div>
                  <div>
                    <span className="font-medium text-blue-300">Email:</span> {selectedCustomer.email}
                  </div>
                  <div>
                    <span className="font-medium text-blue-300">Phone:</span> {selectedCustomer.phone}
                  </div>
                  <div>
                    <span className="font-medium text-blue-300">State:</span> {selectedCustomer.state}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-900/20 p-4 rounded-md mb-4 border border-yellow-700">
                <h3 className="font-semibold text-yellow-300 mb-2">No Customer Selected</h3>
                <p className="text-sm text-yellow-300">
                  Please search and select a customer above.
                </p>
              </div>
            )}

            <div className="space-y-6 py-3">
              {/* Current Item Selection */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div className="md:col-span-4">
                  <Label className="text-white">Equipment Category</Label>
                  <Select
                    value={currentItem.selectedCategory}
                    onValueChange={handleCategorySelect}
                  >
                    <SelectTrigger className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white border-slate-600">
                      {TOOL_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category} className="hover:bg-slate-700">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-4">
                  <Label className="text-white">Select Equipment</Label>
                  <Select
                    value={currentItem.selectedTool?.id || ""}
                    onValueChange={handleToolSelect}
                    disabled={!currentItem.selectedCategory}
                  >
                    <SelectTrigger className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                      <SelectValue placeholder={currentItem.selectedCategory ? `Select ${currentItem.selectedCategory}` : "Select category first"} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white border-slate-600">
                      {filteredTools.map((tool) => (
                        <SelectItem key={tool.id} value={tool.id} className="hover:bg-slate-700">
                          {tool.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-3">
                  <Label className="text-white">Cost (₦)</Label>
                  <Input
                    type="number"
                    value={currentItem.cost}
                    onChange={(e) => setCurrentItem(prev => ({ ...prev, cost: e.target.value }))}
                    className="bg-slate-700 text-white border-slate-600 placeholder-gray-400"
                    placeholder="Enter cost"
                    disabled={!currentItem.selectedTool}
                  />
                </div>

                <div className="md:col-span-1">
                  <Button
                    onClick={addItemToSale}
                    disabled={!currentItem.selectedTool || !currentItem.cost}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Sale Items Summary */}
              {saleItems.length > 0 && (
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-white font-semibold">Items in this Sale ({saleItems.length})</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">
                        Total: ₦{totalCost.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {saleItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded border border-slate-600">
                        <div className="flex-1">
                          <div className="text-white font-medium">{item.equipment}</div>
                          <div className="text-sm text-gray-300">{item.category}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-lg font-bold text-white">
                            ₦{parseFloat(item.cost).toLocaleString()}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItemFromSale(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sale Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Payment Plan</Label>
                  <Input
                    value={saleDetails.payment_plan}
                    onChange={(e) => setSaleDetails(prev => ({ ...prev, payment_plan: e.target.value }))}
                    className="bg-slate-700 text-white border-slate-600 placeholder-gray-400"
                    placeholder="e.g., Full Payment, 3-month Installment"
                  />
                </div>
                <div>
                  <Label className="text-white">Expiry Date</Label>
                  <Input
                    type="date"
                    value={saleDetails.expiry_date}
                    onChange={(e) => setSaleDetails(prev => ({ ...prev, expiry_date: e.target.value }))}
                    className="bg-slate-700 text-white border-slate-600"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => handleAction("cancel")}
                disabled={isSubmitting}
                className="text-gray-300 border-slate-600 hover:bg-slate-700 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleAction("draft")}
                disabled={isSubmitting || saleItems.length === 0}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                {isSubmitting ? "Saving..." : "Save to Draft"}
              </Button>
              <Button
                onClick={() => handleAction("send")}
                disabled={isSubmitting || saleItems.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Saving..." : "Save & Send Bill"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Status Dialog */}
        <Dialog open={editStatusOpen} onOpenChange={setEditStatusOpen}>
          <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Payment Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-3">
              {editingSale && (
                <div className="bg-blue-900/20 p-3 rounded-md border border-blue-700">
                  <h4 className="font-semibold text-blue-300 mb-2">Sale Information</h4>
                  <p className="text-sm text-gray-300">
                    <strong className="text-blue-300">Customer:</strong> {editingSale.name}
                  </p>
                  <p className="text-sm text-gray-300">
                    <strong className="text-blue-300">Invoice:</strong> {editingSale.invoice_number || "N/A"}
                  </p>
                  <p className="text-sm text-gray-300">
                    <strong className="text-blue-300">Total:</strong> ₦{parseFloat(editingSale.total_cost).toLocaleString()}
                  </p>
                </div>
              )}
              
              <div>
                <Label className="text-white">Payment Status</Label>
                <Select
                  value={newPaymentStatus}
                  onValueChange={setNewPaymentStatus}
                >
                  <SelectTrigger className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-slate-600">
                    {PAYMENT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status} className="hover:bg-slate-700">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={closeEditStatus}
                disabled={isUpdatingStatus}
                className="text-gray-300 border-slate-600 hover:bg-slate-700 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={updatePaymentStatus}
                disabled={isUpdatingStatus || !newPaymentStatus}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUpdatingStatus ? "Updating..." : "Update Status"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Sales Table - Updated with better UI */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-400 text-center py-4">Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-left border-b border-slate-700 bg-slate-800">
                      {[
                        "Client",
                        "Phone",
                        "State", 
                        "Items",
                        "Total Cost",
                        "Date Sold",
                        "Invoice",
                        "Payment Plan",
                        "Expiry",
                        "Status",
                        "Actions",
                      ].map((col) => (
                        <th key={col} className="p-3 text-white font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sales.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="text-center p-4 text-gray-400">
                          No records yet. Add a sale to begin.
                        </td>
                      </tr>
                    ) : (
                      sales.map((sale) => (
                        <tr 
                          key={sale.id} 
                          className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors text-gray-300"
                        >
                          <td className="p-3 text-white">{sale.name}</td>
                          <td className="p-3">{sale.phone}</td>
                          <td className="p-3">{sale.state}</td>
                          <td className="p-3">
                            <div className="max-w-xs">
                              {sale.items?.map((item, index) => (
                                <div key={index} className="text-xs mb-1 text-gray-300">
                                  • {item.equipment}
                                </div>
                              )) || "No items"}
                            </div>
                          </td>
                          <td className="p-3 font-semibold text-white">₦{parseFloat(sale.total_cost).toLocaleString()}</td>
                          <td className="p-3">{sale.date_sold}</td>
                          <td className="p-3 text-blue-300">{sale.invoice_number || "-"}</td>
                          <td className="p-3">{sale.payment_plan || "-"}</td>
                          <td className="p-3">{sale.expiry_date || "-"}</td>
                          <td className="p-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                sale.payment_status === "completed"
                                  ? "bg-green-900/50 text-green-300 border border-green-700"
                                  : sale.payment_status === "installment"
                                  ? "bg-blue-900/50 text-blue-300 border border-blue-700"
                                  : sale.payment_status === "failed"
                                  ? "bg-red-900/50 text-red-300 border border-red-700"
                                  : "bg-gray-900/50 text-gray-300 border border-gray-700"
                              }`}
                            >
                              {sale.payment_status || "pending"}
                            </span>
                          </td>
                          <td className="p-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditStatus(sale)}
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                              title="Edit payment status"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}