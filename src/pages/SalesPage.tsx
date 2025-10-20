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
}

const API_URL = "http://localhost:8000/api";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [newSale, setNewSale] = useState<Partial<Sale>>({});
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ✅ Fetch staff-specific sales
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get(`${API_URL}/sales/`, axiosConfig);
        setSales(res.data);
      } catch (error) {
        console.error("Error fetching sales:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
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
    setOpen(false);
    setIsSubmitting(false);
  };

  const handleAction = async (action: "cancel" | "draft" | "send") => {
    if (action === "cancel") return resetForm();

    if (action === "draft" || action === "send") {
      setIsSubmitting(true);
      try {
        const status =
          action === "draft" ? "Draft" : calculateStatus(newSale);

        const payload = {
          ...newSale,
          status,
        };

        const res = await axios.post(`${API_URL}/sales/`, payload, axiosConfig);
        setSales((prev) => [res.data, ...prev]);
        resetForm();
      } catch (error) {
        console.error("Error adding sale:", error);
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
          "Import Invoice",
          "Customer Invoice",
          "Plan",
          "Expiry",
          "Status",
        ],
      ],
      body: sales.map((s) => [
        s.client_name,
        s.phone,
        s.state,
        s.equipment,
        s.cost_sold,
        s.date_sold,
        s.import_invoice_no,
        s.customer_invoice_no,
        s.payment_plan || "-",
        s.expiry_date || "-",
        s.status,
      ]),
      styles: { fontSize: 8 },
    });
    doc.save("my_sales_records.pdf");
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">
            My Sales Records
          </h1>
          <div className="flex gap-3">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={exportPDF}
            >
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
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

                <div className="grid grid-cols-2 gap-4 py-3">
                  {[
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
                  ].map(([key, label, type]) => (
                    <div key={key}>
                      <Label htmlFor={key}>{label}</Label>
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
                      />
                    </div>
                  ))}
                  <div>
                    <Label>Status</Label>
                    <Input
                      readOnly
                      value={calculateStatus(newSale)}
                      className="bg-gray-100"
                    />
                  </div>
                </div>

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

        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-500 text-center py-4">Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-left border-b">
                      {[
                        "Client",
                        "Phone",
                        "State",
                        "Equipment",
                        "Cost",
                        "Date Sold",
                        "Import Invoice",
                        "Customer Invoice",
                        "Payment Plan",
                        "Expiry",
                        "Status",
                      ].map((col) => (
                        <th key={col} className="p-2 text-gray-600 font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sales.length === 0 ? (
                      <tr>
                        <td
                          colSpan={11}
                          className="text-center p-4 text-gray-400"
                        >
                          No records yet. Add a sale to begin.
                        </td>
                      </tr>
                    ) : (
                      sales.map((sale) => (
                        <tr
                          key={sale.id}
                          className="border-b hover:bg-gray-50"
                        >
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
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                sale.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : sale.status === "Installment"
                                  ? "bg-blue-100 text-blue-800"
                                  : sale.status === "Expired"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {sale.status}
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
