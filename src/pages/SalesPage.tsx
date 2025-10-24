import { useEffect, useState } from "react";
import { Plus, FileText } from "lucide-react";
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
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { DashboardLayout } from "../components/DashboardLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

interface Sale {
  id: number;
  customer_id?: number;
  tool_id?: number;
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
}

interface Tool {
  id: number;
  name: string;
  category: string;
}

const API_URL = "http://localhost:8000/api";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [newSale, setNewSale] = useState<Partial<Sale>>({});
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ✅ Fetch sales, customers & tools
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
        
        // Check if we have a customer from the customers page
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
          // Clear the stored customer data
          localStorage.removeItem('selectedCustomer');
          // Auto-open the add sale modal
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
    setOpen(false);
    setIsSubmitting(false);
  };

  // ✅ Email sending
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

  // ✅ Handle Sale actions
  const handleAction = async (action: "cancel" | "draft" | "send") => {
    if (action === "cancel") return resetForm();

    if (!selectedCustomer) {
      alert("Please select a customer first.");
      return;
    }

    if (!newSale.tool_id) {
      alert("Please select a tool.");
      return;
    }

    if (action === "draft" || action === "send") {
      setIsSubmitting(true);
      try {
        const payload = {
          customer_id: selectedCustomer.id,
          tool_id: newSale.tool_id,
          name: newSale.name || selectedCustomer.name,
          phone: newSale.phone || selectedCustomer.phone,
          state: newSale.state || selectedCustomer.state,
          equipment: newSale.equipment || "",
          cost_sold: newSale.cost_sold,
          payment_plan: newSale.payment_plan || "",
          expiry_date: newSale.expiry_date || null,
        };

        const res = await axios.post(`${API_URL}/sales/`, payload, axiosConfig);
        setSales((prev) => [res.data, ...prev]);

        if (action === "send") {
          await sendEmail(selectedCustomer.email, selectedCustomer.name);
        }

        resetForm();
      } catch (error) {
        console.error("Error adding sale:", error);
        alert("Failed to save sale. Check if tool/customer exists.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // ✅ Export to PDF
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            My Sales Records
          </h1>
          <div className="flex gap-3">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={exportPDF}
            >
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sale
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl bg-white text-gray-900">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Add New Sale</DialogTitle>
                </DialogHeader>

                {/* Customer Information (Auto-filled from customer page) */}
                {selectedCustomer && (
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
                )}

                {/* Tool Selection */}
                <div className="grid grid-cols-2 gap-4 py-3">
                  <div className="col-span-2">
                    <Label className="text-gray-700">Select Tool</Label>
                    <select
                      className="border rounded-md p-2 w-full bg-white text-gray-900 border-gray-300"
                      value={newSale.tool_id || ""}
                      onChange={(e) =>
                        setNewSale((prev) => ({
                          ...prev,
                          tool_id: Number(e.target.value),
                        }))
                      }
                    >
                      <option value="">-- Select Tool --</option>
                      {tools.map((tool) => (
                        <option key={tool.id} value={tool.id}>
                          {tool.name} ({tool.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Auto-filled fields */}
                  <div>
                    <Label className="text-gray-700">Client Name</Label>
                    <Input 
                      value={newSale.name || ""} 
                      readOnly 
                      className="bg-gray-100 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Phone</Label>
                    <Input 
                      value={newSale.phone || ""} 
                      readOnly 
                      className="bg-gray-100 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">State</Label>
                    <Input 
                      value={newSale.state || ""} 
                      readOnly 
                      className="bg-gray-100 text-gray-900"
                    />
                  </div>

                  {/* Editable fields */}
                  {[
                    ["equipment", "Equipment", "text"],
                    ["cost_sold", "Cost Sold", "number"],
                    ["payment_plan", "Payment Plan", "text"],
                    ["expiry_date", "Expiry Date", "date"],
                  ].map(([key, label, type]) => (
                    <div key={key}>
                      <Label htmlFor={key} className="text-gray-700">{label}</Label>
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
                        className="text-gray-900 bg-white"
                      />
                    </div>
                  ))}

                  {/* Status */}
                  <div>
                    <Label className="text-gray-700">Status</Label>
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
          </div>
        </div>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500 text-center py-4">Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-left border-b bg-gray-50">
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
                        <th key={col} className="p-2 text-gray-700 font-medium">
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