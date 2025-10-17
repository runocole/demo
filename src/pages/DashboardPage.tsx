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
import { fetchDashboardData } from "../services/api";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const DashboardPage = () => {
  const [userName, setUserName] = useState("");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#A855F7"];

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

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const res = await fetchDashboardData();
        console.log("📊 Dashboard Data:", res); // 👈 helps confirm backend connection
        setDashboardData(res);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

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
            Here’s an overview of your company’s performance.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Tools" value={dashboardData?.totalTools || 0} icon={Package} />
          <StatsCard title="Revenue (MTD)" value={formatCurrency(dashboardData?.mtdRevenue || 0)} icon={DollarSign} />
          <StatsCard title="Total Staff" value={dashboardData?.totalStaff || 0} icon={AlertCircle} />
          <StatsCard title="Active Customers" value={dashboardData?.activeCustomers || 0} icon={Users} />
        </div>

        {/* Recent Sales + Low Stock Items */}
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
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Tool</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData?.recentSales?.length > 0 ? (
                    dashboardData.recentSales.map((sale: any) => (
                      <TableRow key={sale.invoice_number}>
                        <TableCell>{sale.invoice_number}</TableCell>
                        <TableCell>{sale.name}</TableCell>
                        <TableCell>{sale.equipment}</TableCell>
                        <TableCell>{formatCurrency(sale.cost_sold)}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={
                              sale.payment_status === "failed"
                                ? "disabled"
                                : (sale.payment_status as
                                    | "completed"
                                    | "pending"
                                    | "active")
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        No recent sales
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Low Stock Items */}
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData?.lowStockItems?.length > 0 ? (
                    dashboardData.lowStockItems.map((tool: any) => (
                      <TableRow key={tool.id}>
                        <TableCell>{tool.code}</TableCell>
                        <TableCell>{tool.name}</TableCell>
                        <TableCell>{tool.category}</TableCell>
                        <TableCell>{tool.stock}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={
                              tool.status as
                                | "available"
                                | "rented"
                                | "maintenance"
                                | "disabled"
                                | "sold"
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        No low stock items
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Breakdown + Top Selling Tools */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Inventory Breakdown */}
            {/* Inventory Breakdown */}
<Card>
  <CardHeader>
    <CardTitle>Inventory Breakdown</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex flex-col md:flex-row items-center justify-between">
      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={250} className="md:w-2/3">
        <PieChart>
             <Pie
  data={dashboardData?.inventoryBreakdown || []}
  dataKey="count"
  nameKey="category"
  outerRadius={90}
  label={true} 
>
  {(dashboardData?.inventoryBreakdown || []).map((_: any, i: number) => (
    <Cell key={i} fill={COLORS[i % COLORS.length]} />
  ))}
</Pie>

          <Tooltip
            formatter={(value: number, _name: string, props: any) => {
              const total = (dashboardData?.inventoryBreakdown || []).reduce(
                (sum: number, item: any) => sum + item.count,
                0
              );
              const percentage = ((value / total) * 100).toFixed(1);
              return [`${value} tools (${percentage}%)`, "Count"];
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 md:mt-0 md:ml-6 space-y-2 text-sm">
        {(dashboardData?.inventoryBreakdown || []).map((item: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            ></div>
            <span className="text-gray-300">
              {item.category}: <span className="font-semibold">{item.count}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  </CardContent>
          </Card>

          {/* Top Selling Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tool</TableHead>
                    <TableHead>Sales Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData?.topSellingTools?.length > 0 ? (
                    dashboardData.topSellingTools.map((tool: any) => (
                      <TableRow key={tool.tool__name}>
                        <TableCell>{tool.tool__name}</TableCell>
                        <TableCell>{tool.total_sold}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-gray-500">
                        No sales data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
