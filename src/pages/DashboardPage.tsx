import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { StatsCard } from "../components/StatsCard";
import { Package, DollarSign, Users, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { StatusBadge } from "../components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { fetchDashboardData, getCustomers } from "../services/api";
import axios from "axios";

const API_URL = "http://localhost:8000/api";
const DashboardPage = () => {
  const [userName, setUserName] = useState("");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [customersCount, setCustomersCount] = useState(0);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Load username from local storage ---
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserName(parsed.name || parsed.email || "User");
      } catch {
        setUserName("User");
      }
    }
  }, []);

  // --- Load dashboard data, customers, and sales ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [dashboardRes, customersRes, salesRes] = await Promise.all([
          fetchDashboardData(), // ← fetches /dashboard/summary/
          getCustomers(),
          axios.get(`${API_URL}/sales/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
          }),
        ]);

        setDashboardData(dashboardRes);
        setCustomersCount(customersRes.length);
        setRecentSales(salesRes.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Currency formatting helper ---
  const formatCurrency = (amount: number) =>
    `₦${amount?.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64 text-gray-500">
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Hello, {userName} 👋
          </h2>
          <p className="text-gray-600">
            Welcome back! Here’s a quick overview of your activity.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Tools"
            value={dashboardData?.totalTools || 0}
            icon={Package}
          />
          <StatsCard
            title="Revenue (MTD)"
            value={formatCurrency(dashboardData?.mtdRevenue || 0)}
            icon={DollarSign}
          />
          <StatsCard
            title="Total Staff"
            value={dashboardData?.totalStaff || 0}
            icon={AlertCircle}
          />
          <StatsCard
            title="Active Customers"
            value={customersCount || 0}
            icon={Users}
          />
        </div>

        {/* Sales + Tools Overview */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tool</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.length > 0 ? (
                    recentSales.map((sale) => {
                      const safeStatus =
                        sale.status === "completed" ||
                        sale.status === "pending" ||
                        sale.status === "overdue" ||
                        sale.status === "active"
                          ? sale.status
                          : "completed";

                      return (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">
                            {sale.id}
                          </TableCell>
                          <TableCell>{sale.tool?.name || "—"}</TableCell>
                          <TableCell>{sale.customer?.name || "—"}</TableCell>
                          <TableCell>
                            <StatusBadge status={safeStatus} />
                          </TableCell>
                          <TableCell>
                            {formatCurrency(Number(sale.amount) || 0)}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-gray-500"
                      >
                        No recent sales
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

  {/* Tools Status Overview */}
<Card>
  <CardHeader>
    <CardTitle>Tools Status Overview</CardTitle>
  </CardHeader>
  <CardContent className="space-y-3">
    {Object.entries(dashboardData?.toolStatusCounts || {}).map(
      ([status, count]) => (
        <div
          key={status}
          className="flex items-center justify-between border-b pb-2 last:border-none"
        >
          <div className="flex items-center gap-2">
            <StatusBadge
              status={
                status as
                  | "available"
                  | "rented"
                  | "maintenance"
                  | "disabled"
                  | "active"
                  | "overdue"
                  | "pending"
              }
            />
            <span className="capitalize text-gray-700">{status}</span>
          </div>
          <span className="font-semibold text-gray-900">
            {count as React.ReactNode}
          </span>
        </div>
      )
    )}
  </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
