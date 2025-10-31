import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Search, Eye, Edit } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { DashboardLayout } from "../components/DashboardLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

interface Sale {
  id: number;
  customer_id?: number;
  name: string;
  phone: string;
  state: string;
  items: any[];
  total_cost: string;
  date_sold: string;
  invoice_number?: string;
  payment_plan?: string;
  expiry_date?: string;
  payment_status?: string;
  staff_id?: string;
}

const API_URL = "http://localhost:8000/api";

export default function StaffSalesPage() {
  const { staffId } = useParams<{ staffId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [staffName, setStaffName] = useState("");

  const token = localStorage.getItem("access");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchStaffSales = async () => {
      try {
        // Get staff name from navigation state or fetch from API
        if (location.state?.staffName) {
          setStaffName(location.state.staffName);
        } else if (staffId) {
          // Fetch staff details from API
          const staffRes = await axios.get(`${API_URL}/staff/${staffId}`, axiosConfig);
          setStaffName(staffRes.data.name);
        }

        // Fetch sales for this staff member
        const salesRes = await axios.get(`${API_URL}/sales/?staff_id=${staffId}`, axiosConfig);
        setSales(salesRes.data);
      } catch (error) {
        console.error("Error fetching staff sales:", error);
      } finally {
        setLoading(false);
      }
    };

    if (staffId) {
      fetchStaffSales();
    }
  }, [staffId, location.state]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Sales Records - ${staffName}`, 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [
        [
          "Client",
          "Phone", 
          "State",
          "Items",
          "Price",
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
    doc.save(`${staffName}_sales_records.pdf`);
  };

  const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total_cost), 0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {staffName}'s Sales
            </h1>
            <p className="text-muted-foreground">
              Sales records and performance overview
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ₦{totalSales.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Number of Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {sales.length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Average Sale Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ₦{sales.length > 0 ? (totalSales / sales.length).toLocaleString(undefined, { maximumFractionDigits: 2 }) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={exportPDF}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Sales Table */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Sales Records</CardTitle>
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
                        <td colSpan={10} className="text-center p-4 text-gray-400">
                          No sales records found for this staff member.
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
                          <td className="p-3 font-semibold text-white">
                            ₦{parseFloat(sale.total_cost).toLocaleString()}
                          </td>
                          <td className="p-3">
                            {sale.date_sold ? sale.date_sold.split('T')[0] : "-"}
                          </td>
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