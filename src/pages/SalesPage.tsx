import { useEffect, useState } from "react";
import axios from "axios";
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

const API_URL = "http://localhost:8000/api/sales/";

interface Sale {
  id: number;
  client_name: string;
  phone: string;
  state: string;
  equipment: string;
  cost_sold: string;
  date_sold: string;
  import_invoice_no: string;
  customer_invoice_no: string;
  payment_plan?: string;
  expiry_date?: string;
  status: string;
  draft?: boolean;
}

type ActionType = "cancel" | "draft" | "send";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [newSale, setNewSale] = useState<Partial<Sale>>({});
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all sales
  const fetchSales = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales(res.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
      alert("Failed to load sales data.");
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Calculate status based on sales conditions
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

  // Update status when relevant fields change
  useEffect(() => {
    if (newSale.date_sold || newSale.expiry_date || newSale.payment_plan) {
      const status = calculateStatus(newSale);
      setNewSale(prev => ({ ...prev, status }));
    }
  }, [newSale.date_sold, newSale.expiry_date, newSale.payment_plan]);

  // Reset form
  const resetForm = () => {
    setNewSale({});
    setOpen(false);
    setIsSubmitting(false);
  };

  // Unified action handler
  const handleAction = async (action: ActionType) => {
    switch (action) {
      case "cancel":
        if (Object.keys(newSale).length > 0 && 
            !window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
          return;
        }
        resetForm();
        break;

      case "draft":
        setIsSubmitting(true);
        try {
          const token = localStorage.getItem("access");
          const draftSale = {
            ...newSale,
            status: "Draft",
            draft: true
          };
          
          await axios.post(API_URL, draftSale, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          resetForm();
          fetchSales();
        } catch (error) {
          console.error("Error saving draft:", error);
          alert("Failed to save draft. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
        break;

      case "send":
        // Validate required fields
        const requiredFields = ['client_name', 'phone', 'equipment', 'cost_sold', 'date_sold'];
        const missingFields = requiredFields.filter(field => !newSale[field as keyof Sale]);
        
        if (missingFields.length > 0) {
          alert(`Please fill in all required fields: ${missingFields.map(field => 
            field.replace('_', ' ')
          ).join(', ')}`);
          return;
        }

        setIsSubmitting(true);
        try {
          const token = localStorage.getItem("access");
          const finalSale = {
            ...newSale,
            status: calculateStatus(newSale),
            draft: false
          };
          
          await axios.post(API_URL, finalSale, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          resetForm();
          fetchSales();
        } catch (error: any) {
          console.error("Error saving sale:", error);
          const errorMessage = error.response?.data?.message || "Failed to save sale. Please try again.";
          alert(errorMessage);
        } finally {
          setIsSubmitting(false);
        }
        break;

      default:
        console.warn("Unknown action:", action);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case "Completed":
        return `${baseClass} bg-green-100 text-green-800`;
      case "Installment":
        return `${baseClass} bg-blue-100 text-blue-800`;
      case "Expired":
        return `${baseClass} bg-red-100 text-red-800`;
      case "Draft":
        return `${baseClass} bg-gray-100 text-gray-800`;
      case "Pending":
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  const formFields = [
    ["client_name", "Client Name", "text"],
    ["phone", "Phone Number", "text"],
    ["state", "State", "text"],
    ["equipment", "Equipment", "text"],
    ["cost_sold", "Cost Sold", "number"],
    ["date_sold", "Date Sold", "date"],
    ["import_invoice_no", "Import Invoice No", "text"],
    ["customer_invoice_no", "Customer Invoice No", "text"],
    ["payment_plan", "Payment Plan", "text"],
    ["expiry_date", "Expiry Date", "date"],
  ] as const;

  const tableHeaders = [
    "Client", "Phone", "State", "Equipment", "Cost", "Date Sold", 
    "Import Invoice No", "Customer Invoice No", "Payment Plan", "Expiry", "Status"
  ];

  // Handle input change safely
  const handleInputChange = (key: keyof Sale, value: string) => {
    setNewSale(prev => ({ ...prev, [key]: value }));
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Sales Records</h1>
          <div className="flex gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sale
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Sale</DialogTitle>
                </DialogHeader>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4 py-3">
                  {formFields.map(([key, label, type]) => (
                    <div key={key}>
                      <Label htmlFor={key}>{label}</Label>
                      <Input
                        id={key}
                        type={type}
                        value={newSale[key as keyof Sale] as string || ""}
                        onChange={(e) =>
                          handleInputChange(key as keyof Sale, e.target.value)
                        }
                      />
                    </div>
                  ))}
                  
                  {/* Status Display */}
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Input
                      id="status"
                      type="text"
                      value={calculateStatus(newSale)}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <DialogFooter className="gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleAction("cancel")}
                    disabled={isSubmitting}
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
                    className="bg-blue-600 hover:bg-blue-700"
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
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b">
                    {tableHeaders.map((col) => (
                      <th key={col} className="p-2 text-gray-600 font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{sale.client_name}</td>
                      <td className="p-2">{sale.phone}</td>
                      <td className="p-2">{sale.state}</td>
                      <td className="p-2 capitalize">{sale.equipment}</td>
                      <td className="p-2">₦{sale.cost_sold}</td>
                      <td className="p-2">{sale.date_sold}</td>
                      <td className="p-2">{sale.import_invoice_no}</td>
                      <td className="p-2">{sale.customer_invoice_no}</td>
                      <td className="p-2">{sale.payment_plan || "-"}</td>
                      <td className="p-2">{sale.expiry_date || "-"}</td>
                      <td className="p-2">
                        <span className={getStatusBadgeClass(sale.status)}>
                          {sale.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}