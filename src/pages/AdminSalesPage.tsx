import React, { useEffect, useState } from "react";
import { getSales } from "../services/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Download } from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Sale {
  id: number;
  customer_name: string;
  tool_name: string;
  cost_sold: number;
  payment_plan: string;
  payment_status: string;
  date_sold: string | null;
  staff_name: string; 
}

const AdminSalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Sale>("date_sold");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);

  // --- Fetch Sales ---
  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const data = await getSales();
        setSales(data);
        setFilteredSales(data);
      } catch (error) {
        console.error("Failed to load sales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

// --- Search ---
  useEffect(() => {
    const filtered = sales.filter(
      (s) =>
        s.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.tool_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.staff_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSales(filtered);
  }, [searchTerm, sales]);

  // --- Sorting ---
  const handleSort = (field: keyof Sale) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sorted = [...filteredSales].sort((a, b) => {
      if (a[field]! < b[field]!) return order === "asc" ? -1 : 1;
      if (a[field]! > b[field]!) return order === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredSales(sorted);
  };

  // --- Export PDF ---
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report (Admin)", 14, 10);

    const tableColumn = [
      "Customer",
      "Tool",
      "Amount",
      "Payment Plan",
      "Status",
      "Date Sold",
      "Sold By",
    ];
    const tableRows = filteredSales.map((s) => [
      s.customer_name,
      s.tool_name,
      `₦${s.cost_sold.toLocaleString()}`,
      s.payment_plan,
      s.payment_status,
      s.date_sold ? new Date(s.date_sold).toLocaleDateString() : "-",
      s.staff_name,
    ]);

    // @ts-ignore
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("sales_report_admin.pdf");
  };

  return (
    <DashboardLayout>
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            All Sales (Admin)
          </CardTitle>
          <div className="flex items-center gap-2 mt-3 md:mt-0">
            <Input
              type="text"
              placeholder="Search by customer, tool, or staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Button onClick={exportPDF} className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export PDF
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-gray-500">Loading sales...</p>
          ) : filteredSales.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No sales records found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th
                      className="p-2 cursor-pointer"
                      onClick={() => handleSort("customer_name")}
                    >
                      Customer
                    </th>
                    <th
                      className="p-2 cursor-pointer"
                      onClick={() => handleSort("tool_name")}
                    >
                      Tool
                    </th>
                    <th
                      className="p-2 cursor-pointer"
                      onClick={() => handleSort("cost_sold")}
                    >
                      Amount
                    </th>
                    <th
                      className="p-2 cursor-pointer"
                      onClick={() => handleSort("payment_plan")}
                    >
                      Payment Plan
                    </th>
                    <th
                      className="p-2 cursor-pointer"
                      onClick={() => handleSort("payment_status")}
                    >
                      Status
                    </th>
                    <th
                      className="p-2 cursor-pointer"
                      onClick={() => handleSort("date_sold")}
                    >
                      Date Sold
                    </th>
                    <th
                      className="p-2 cursor-pointer"
                      onClick={() => handleSort("staff_name")}
                    >
                      Sold By
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">{s.customer_name}</td>
                      <td className="p-2">{s.tool_name}</td>
                      <td className="p-2">₦{s.cost_sold.toLocaleString()}</td>
                      <td className="p-2">{s.payment_plan}</td>
                      <td className="p-2 capitalize">{s.payment_status}</td>
                      <td className="p-2">
                        {s.date_sold
                          ? new Date(s.date_sold).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-2">{s.staff_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
};

export default AdminSalesPage;