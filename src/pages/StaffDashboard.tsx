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
import { useEffect, useState } from "react";

const StaffDashboard = () => {
  const [userName, setUserName] = useState("");

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

  const recentRentals = [
    { id: "R001", tool: "Total Station", customer: "John Doe", startDate: "2025-10-01", status: "active" as const, amount: "$150.00" },
    { id: "R002", tool: "GPS Receiver", customer: "Jane Smith", startDate: "2025-09-28", status: "overdue" as const, amount: "$200.00" },
    { id: "R003", tool: "Theodolite", customer: "Bob Johnson", startDate: "2025-09-25", status: "completed" as const, amount: "$120.00" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Personalized Header */}
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
            value="48"
            icon={Package}
            trend={{ value: "+3 this month", isPositive: true }}
          />
          <StatsCard
            title="Active Rentals"
            value="12"
            icon={AlertCircle}
            trend={{ value: "+2 from last week", isPositive: true }}
          />
          <StatsCard
            title="Revenue (MTD)"
            value="$12,450"
            icon={DollarSign}
            trend={{ value: "+18% from last month", isPositive: true }}
          />
          <StatsCard
            title="Active Customers"
            value="34"
            icon={Users}
            trend={{ value: "+5 new customers", isPositive: true }}
          />
        </div>

        {/* Rentals and Tools Overview */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Rentals</CardTitle>
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
                  {recentRentals.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell className="font-medium">{rental.id}</TableCell>
                      <TableCell>{rental.tool}</TableCell>
                      <TableCell>{rental.customer}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rental.status === "active"
                              ? "bg-green-100 text-green-800"
                              : rental.status === "overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{rental.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tools Status Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge status="available" />
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <span className="font-semibold">28</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge status="rented" />
                  <span className="text-sm text-gray-600">Rented</span>
                </div>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge status="maintenance" />
                  <span className="text-sm text-gray-600">Maintenance</span>
                </div>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge status="disabled" />
                  <span className="text-sm text-gray-600">Disabled</span>
                </div>
                <span className="font-semibold">3</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
