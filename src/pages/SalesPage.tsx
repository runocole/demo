import { useEffect, useState } from "react";
import { Plus, FileText, Search, X } from "lucide-react";
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

interface Sale {
  id: number;
  customer_id?: number;
  tool_id?: string;
  name: string;
  phone: string;
  state: string;
  equipment: string;
  cost_sold: string;
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
  user?: number; // User ID
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

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [newSale, setNewSale] = useState<Partial<Sale>>({});
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

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
          setNewSale(prev => ({
            ...prev,
            name: customerData.name,
            phone: customerData.phone,
            state: customerData.state
          }));
          localStorage.removeItem('selectedCustomer');
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
    if (selectedCategory) {
      const filtered = tools.filter(tool => 
        tool.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredTools(filtered);
    } else {
      setFilteredTools([]);
    }
  }, [selectedCategory, tools]);

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
    setNewSale(prev => ({
      ...prev,
      name: customer.name,
      phone: customer.phone,
      state: customer.state
    }));
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
    setSelectedCategory(category);
    setSelectedTool(null);
    setNewSale(prev => ({
      ...prev,
      tool_id: undefined,
      equipment: "",
      cost_sold: ""
    }));
  };

  const handleToolSelect = (toolId: string) => {
    const selected = tools.find(tool => tool.id === toolId);
    
    if (selected) {
      setSelectedTool(selected);
      setNewSale(prev => ({
        ...prev,
        tool_id: selected.id,
        equipment: selected.name,
      }));
    }
  };

  const clearToolSelection = () => {
    setSelectedCategory("");
    setFilteredTools([]);
    setSelectedTool(null);
    setNewSale(prev => ({
      ...prev,
      tool_id: undefined,
      equipment: "",
      cost_sold: ""
    }));
  };

  const calculateStatus = (sale: Partial<Sale>): string => {
    if (!sale.date_sold) return "Pending";
    const today = new Date();
    if (sale.expiry_date) {
      const expiryDate = new Date(sale.expiry_date);
      if (expiryDate < today) return "Expired";
    }
    if (sale.payment_plan && sale.payment_plan !== "Full Payment") {
      return "Installment";
    }
    return "Completed";
  };

  const resetForm = () => {
    setNewSale({});
    setSelectedCustomer(null);
    setSelectedCategory("");
    setFilteredTools([]);
    setSelectedTool(null);
    setOpen(false);
    setIsSubmitting(false);
  };

  const sendEmail = async (email: string, name: string) => {
    try {
      await axios.post(`${API_URL}/send-sale-email/`, {
        to_email: email,
        subject: "Your Payment Link",
        message: `Hello ${name}, your payment link will be available soon.`,
      });
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
 const handleAction = async (action: "cancel" | "draft" | "send") => {
  if (action === "cancel") return resetForm();

  if (!selectedCustomer && (!newSale.name || !newSale.phone || !newSale.state)) {
    alert("Please select a customer or fill in all customer details first.");
    return;
  }

  if (!newSale.tool_id) {
    alert("Please select a tool.");
    return;
  }

  if (!newSale.equipment) {
    alert("Please ensure equipment field is filled.");
    return;
  }

  if (action === "draft" || action === "send") {
    setIsSubmitting(true);
    try {
      const payload = {
        // Don't send any customer fields since they're read-only in serializer
        tool_id: newSale.tool_id,
        name: newSale.name || selectedCustomer?.name,
        phone: newSale.phone || selectedCustomer?.phone,
        state: newSale.state || selectedCustomer?.state,
        equipment: newSale.equipment || "",
        cost_sold: newSale.cost_sold || "0",
        payment_plan: newSale.payment_plan || "",
        expiry_date: newSale.expiry_date || null,
        date_sold: new Date().toISOString().split('T')[0],
      };

      console.log("Sending payload:", payload);

      const res = await axios.post(`${API_URL}/sales/`, payload, axiosConfig);
      setSales((prev) => [res.data, ...prev]);

      if (action === "send" && selectedCustomer?.email) {
        await sendEmail(selectedCustomer.email, selectedCustomer.name);
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
        s.equipment,
        s.cost_sold,
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
        <Card>
          <CardHeader>
            <CardTitle className="text-white dark:text-white">
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
                    className="pl-10 pr-10 text-white bg-slate-900 border-gray-300 focus:border-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                <div className="absolute top-full left-0 right-0 bg-slate-900 border border-gray-200 rounded-md shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                  {searchResults.map((customer) => (
                    <div
                      key={customer.id}
                      className="p-3 hover:bg-blue-950 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white">{customer.name}</p>
                          <p className="text-sm text-white">{customer.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white">{customer.email}</p>
                          <p className="text-sm text-white">{customer.state}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showSearchResults && searchQuery && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 bg-slate-900 border border-gray-200 rounded-md shadow-lg z-10 mt-1 p-4">
                  <p className="text-white text-center">No customers found matching your search.</p>
                </div>
              )}
            </div>

            {selectedCustomer && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-blue-800">Selected Customer</h3>
                    <p className="text-sm text-gray-700">
                      {selectedCustomer.name} • {selectedCustomer.phone} • {selectedCustomer.email} • {selectedCustomer.state}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomer(null);
                      setNewSale(prev => ({
                        ...prev,
                        name: "",
                        phone: "",
                        state: ""
                      }));
                    }}
                    className="text-red-600 border-red-200 hover:bg-red-50"
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
          
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl bg-blue-950 text-gray-900">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Sale</DialogTitle>
            </DialogHeader>

            {selectedCustomer ? (
              <div className="bg-blue-50 p-4 rounded-md mb-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Name:</span> {selectedCustomer.name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {selectedCustomer.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {selectedCustomer.phone}
                  </div>
                  <div>
                    <span className="font-medium">State:</span> {selectedCustomer.state}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-md mb-4 border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">No Customer Selected</h3>
                <p className="text-sm text-yellow-700">
                  Please search and select a customer above, or fill in the details manually below.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 py-3">
              <div className="col-span-2">
                <Label className="text-white">Select Equipment Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={handleCategorySelect}
                >
                  <SelectTrigger className="bg-blue-950 text-white border-gray-300">
                    <SelectValue placeholder="-- Select Category --" />
                  </SelectTrigger>
                  <SelectContent className="bg-black text-white border-gray-700">
                    {TOOL_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory && (
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-white">Select {selectedCategory}</Label>
                    {filteredTools.length === 0 && (
                      <span className="text-sm text-yellow-400">
                        No equipment found in this category
                      </span>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearToolSelection}
                      className="text-red-400 border-red-400 hover:bg-red-950 hover:text-white"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Change Category
                    </Button>
                  </div>
                  <Select
                    value={selectedTool?.id || ""}
                    onValueChange={handleToolSelect}
                  >
                    <SelectTrigger className="bg-blue-950 text-white border-gray-300">
                      <SelectValue placeholder={`-- Select ${selectedCategory} --`} />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white border-gray-700">
                      {filteredTools.map((tool) => (
                        <SelectItem key={tool.id} value={tool.id}>
                          {tool.name} {tool.cost ? `- $${tool.cost}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {!selectedCustomer && (
                <>
                  <div>
                    <Label className="text-white">Client Name</Label>
                    <Input 
                      value={newSale.name || ""} 
                      onChange={(e) => setNewSale(prev => ({ ...prev, name: e.target.value }))}
                      className="text-white bg-blue-950 border-gray-300"
                      placeholder="Enter client name"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Phone</Label>
                    <Input 
                      value={newSale.phone || ""} 
                      onChange={(e) => setNewSale(prev => ({ ...prev, phone: e.target.value }))}
                      className="text-white bg-blue-950 border-gray-300"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label className="text-white">State</Label>
                    <Input 
                      value={newSale.state || ""} 
                      onChange={(e) => setNewSale(prev => ({ ...prev, state: e.target.value }))}
                      className="text-white bg-blue-950 border-gray-300"
                      placeholder="Enter state"
                    />
                  </div>
                </>
              )}

              {selectedCustomer && (
                <>
                  <div>
                    <Label className="text-white">Client Name</Label>
                    <Input 
                      value={newSale.name || ""} 
                      readOnly 
                      className="text-white bg-blue-950 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Phone</Label>
                    <Input 
                      value={newSale.phone || ""} 
                      readOnly 
                      className="text-white bg-blue-950 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-white">State</Label>
                    <Input 
                      value={newSale.state || ""} 
                      readOnly 
                      className="text-white bg-blue-950 border-gray-300"
                    />
                  </div>
                </>
              )}

              <div className="col-span-2">
                <Label className="text-white">Equipment</Label>
                <Input
                  value={newSale.equipment || ""}
                  onChange={(e) => setNewSale(prev => ({ ...prev, equipment: e.target.value }))}
                  className="text-white bg-blue-950 border-gray-300"
                  placeholder={selectedCategory ? `Select a ${selectedCategory.toLowerCase()} from the dropdown above` : "Select a category first"}
                  readOnly={!!selectedTool}
                />
                {selectedTool && (
                  <p className="text-sm text-green-400 mt-1">
                    Equipment auto-filled from selection.
                  </p>
                )}
              </div>

              <div>
                <Label className="text-white">Cost Sold</Label>
                <Input
                  type="number"
                  value={newSale.cost_sold || ""}
                  onChange={(e) => setNewSale(prev => ({ ...prev, cost_sold: e.target.value }))}
                  className="text-white bg-blue-950 border-gray-300"
                  placeholder="Enter cost"
                />
              </div>

              {[
                ["payment_plan", "Payment Plan", "text"],
                ["expiry_date", "Expiry Date", "date"],
              ].map(([key, label, type]) => (
                <div key={key}>
                  <Label htmlFor={key} className="text-white">{label}</Label>
                  <Input
                    id={key}
                    type={type}
                    value={(newSale[key as keyof Sale] as string) || ""}
                    onChange={(e) =>
                      setNewSale((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="text-white bg-blue-950 border-gray-300"
                  />
                </div>
              ))}

              <div>
                <Label className="text-white">Status</Label>
                <Input
                  readOnly
                  value={calculateStatus(newSale)}
                  className="bg-gray-100 text-gray-900"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => handleAction("cancel")}
                disabled={isSubmitting}
                className="text-gray-700"
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleAction("draft")}
                disabled={isSubmitting}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                {isSubmitting ? "Saving..." : "Save to Draft"}
              </Button>
              <Button
                onClick={() => handleAction("send")}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Saving..." : "Save & Send"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <CardTitle className="text-white dark:text-white">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500 text-center py-4">Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-left border-b bg-slate-900">
                      {[
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
                      ].map((col) => (
                        <th key={col} className="p-2 text-white font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sales.length === 0 ? (
                      <tr>
                        <td
                          colSpan={10}
                          className="text-center p-4 text-gray-500"
                        >
                          No records yet. Add a sale to begin.
                        </td>
                      </tr>
                    ) : (
                      sales.map((sale) => (
                        <tr
                          key={sale.id}
                          className="border-b hover:bg-gray-50 text-gray-700"
                        >
                          <td className="p-2">{sale.name}</td>
                          <td className="p-2">{sale.phone}</td>
                          <td className="p-2">{sale.state}</td>
                          <td className="p-2 capitalize">{sale.equipment}</td>
                          <td className="p-2">₦{sale.cost_sold}</td>
                          <td className="p-2">{sale.date_sold}</td>
                          <td className="p-2">{sale.invoice_number || "-"}</td>
                          <td className="p-2">{sale.payment_plan || "-"}</td>
                          <td className="p-2">{sale.expiry_date || "-"}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                sale.payment_status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : sale.payment_status === "installment"
                                  ? "bg-blue-100 text-blue-800"
                                  : sale.payment_status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {sale.payment_status || "pending"}
                            </span>
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