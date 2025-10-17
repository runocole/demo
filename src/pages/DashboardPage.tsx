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
import { fetchDashboardData, getCustomers, getTools } from "../services/api";
import axios from "axios";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const API_URL = "http://localhost:8000/api";

const DashboardPage = () => {
  const [userName, setUserName] = useState("");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [customersCount, setCustomersCount] = useState(0);
  const [recentTools, setRecentTools] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [salesTrend, setSalesTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Load username ---
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

  // --- Load all dashboard data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [dashboardRes, customersRes, toolsRes, salesRes] =
          await Promise.all([
            fetchDashboardData(),
            getCustomers(),
            getTools(),
            axios.get(`${API_URL}/sales/`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
            }),
          ]);

        // Tools & Category breakdown
        const categoryCount = Object.values(
          toolsRes.reduce((acc: any, tool: any) => {
            acc[tool.category] = acc[tool.category] || { name: tool.category, value: 0 };
            acc[tool.category].value += 1;
            return acc;
          }, {})
        );

        // Fake monthly sales trend (replace with real data when ready)
        const monthly = salesRes.data.reduce((acc: any, sale: any) => {
          const month = new Date(sale.created_at).toLocaleString("default", { month: "short" });
          acc[month] = (acc[month] || 0) + Number(sale.amount);
          return acc;
        }, {});
        const trend = Object.entries(monthly).map(([month, amount]) => ({
          month,
          amount,
        }));

        setDashboardData(dashboardRes);
        setCustomersCount(customersRes.length);
        setRecentTools(toolsRes.slice(0, 5));
        setCategoryBreakdown(categoryCount);
        setSalesTrend(trend);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#A855F7"];

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
      <h3 className="text-5xl font-bold tracking-tight text-blue-100 font-serif">
        Welcome Back,
        <span className="ml-2 text-3xl italic text-blue-200 font-medium">
          {userName}
        </span>
      </h3>
      <p className="text-gray-400 mt-2">
        Here’s an overview of your company’s tools and sales.
      </p>
    </div>
        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Tools"
            value={dashboardData?.totalTools || 0}
            icon={Package}
            trend={{ value: "+5 this month", isPositive: true }}
          />
          <StatsCard
            title="Revenue (MTD)"
            value={formatCurrency(dashboardData?.mtdRevenue || 0)}
            icon={DollarSign}
            trend={{ value: "+8% from last month", isPositive: true }}
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
            trend={{ value: "+3 new", isPositive: true }}
          />
        </div>

        {/* Recent Tools + Inventory Breakdown */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTools.length > 0 ? (
                    recentTools.map((tool) => (
                      <TableRow key={tool.id}>
                        <TableCell>{tool.code}</TableCell>
                        <TableCell>{tool.name}</TableCell>
                        <TableCell>{tool.category}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={
                              tool.status as
                                | "available"
                                | "rented"
                                | "maintenance"
                                | "disabled"
                            }
                          />
                        </TableCell>
                        <TableCell>{tool.stock}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        No tools found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {categoryBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Sales Trend + Tool Status Overview */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Sales Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tool Status Overview */}
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
