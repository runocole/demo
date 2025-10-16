import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, FileText, Loader2 } from "lucide-react";
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
import { toast } from "../components/ui/use-toast";

const API_URL = "http://localhost:8000/api/sales/";

interface Sale {
  id: number;
  client_name: string;
  phone: string;
  state: string;
  equipment: string;
  cost_sold: string;
  date_sold: string;
  invoice_no: string;
  payment_plan?: string;
  expiry_date?: string;
  status?: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [newSale, setNewSale] = useState<Partial<Sale>>({});
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const token = localStorage.getItem("access");

  // Fetch all sales
  const fetchSales = async () => {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSales(res.data);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Add a new sale + mock payment
  const handleAddSale = async () => {
    try {
      setIsProcessing(true);
      const res = await axios.post(API_URL, newSale, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const createdSale = res.data;
      toast({ title: "Sale created", description: "Processing payment..." });

      // Simulate payment confirmation after 3s
      setTimeout(async () => {
        await axios.post(
          `${API_URL}${createdSale.id}/confirm_payment/`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast({
          title: "Payment Successful (Test Mode)",
          description: `Sale for ${createdSale.client_name} marked as completed.`,
        });

        setIsProcessing(false);
        setOpen(false);
        setNewSale({});
        fetchSales();
      }, 3000);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to create sale." });
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
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

            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Sale</DialogTitle>
              </DialogHeader>

              <div className="grid gap-3 py-3">
                {[
                  ["client_name", "Client Name"],
                  ["phone", "Phone Number"],
                  ["state", "State"],
                  ["equipment", "Equipment"],
                  ["cost_sold", "Cost Sold"],
                  ["date_sold", "Date Sold"],
                  ["invoice_no", "Invoice No / Waybill"],
                  ["payment_plan", "Payment Plan"],
                  ["expiry_date", "Expiry Date"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <Input
                      type={
                        key.includes("date")
                          ? "date"
                          : key === "cost_sold"
                          ? "number"
                          : "text"
                      }
                      value={newSale[key as keyof Sale] || ""}
                      onChange={(e) =>
                        setNewSale({ ...newSale, [key]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button
                  onClick={handleAddSale}
                  className="bg-blue-600"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Processing...
                    </>
                  ) : (
                    "Save & Process"
                  )}
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
                  "Invoice",
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
              {sales.map((sale) => (
                <tr key={sale.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{sale.client_name}</td>
                  <td className="p-2">{sale.phone}</td>
                  <td className="p-2">{sale.state}</td>
                  <td className="p-2 capitalize">{sale.equipment}</td>
                  <td className="p-2">₦{sale.cost_sold}</td>
                  <td className="p-2">{sale.date_sold}</td>
                  <td className="p-2">{sale.invoice_no}</td>
                  <td className="p-2">{sale.payment_plan}</td>
                  <td className="p-2">{sale.expiry_date || "-"}</td>
                  <td
                    className={`p-2 font-medium ${
                      sale.status === "completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {sale.status || "pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
