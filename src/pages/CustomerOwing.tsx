import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { StatsCard } from "../components/StatsCard";
import { DollarSign, TrendingUp, Clock, AlertCircle, Users, Send, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { fetchCustomerOwingData } from "../services/api";

interface CustomerOwingData {
  summary: {
    totalSellingPrice: number;
    totalAmountReceived: number;
    totalAmountLeft: number;
    upcomingReceivables: number;
    overdueCustomers: number;
    totalCustomers: number;
  };
  customers: Customer[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSellingPrice: number;
  amountPaid: number;
  amountLeft: number;
  dateLastPaid: string;
  dateNextInstallment: string;
  status: "on-track" | "due-soon" | "overdue" | "fully-paid";
  progress: number;
}

const CustomerOwingPage = () => {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<CustomerOwingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        setLoading(true);
        const res = await fetchCustomerOwingData();
        console.log("📊 Customer Owing Data:", res);
        setCustomerData(res);
      } catch (err) {
        console.error("Error fetching customer data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCustomerData();
  }, []);

  const formatCurrency = (amount: number) =>
    `₦${amount?.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "-") return "-";
    return new Date(dateString).toLocaleDateString("en-NG");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fully-paid":
        return "bg-green-500";
      case "on-track":
        return "bg-blue-500";
      case "due-soon":
        return "bg-yellow-500";
      case "overdue":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "fully-paid":
        return "Fully Paid";
      case "on-track":
        return "On Track";
      case "due-soon":
        return "Due Soon";
      case "overdue":
        return "Overdue";
      default:
        return status;
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const filteredCustomers = customerData?.customers?.filter((customer) => {
    if (filter === "all") return true;
    if (filter === "overdue") return customer.status === "overdue";
    if (filter === "due-soon") return customer.status === "due-soon";
    if (filter === "on-track") return customer.status === "on-track";
    if (filter === "fully-paid") return customer.status === "fully-paid";
    return true;
  });

  const handleSendReminder = (customerId: string) => {
    console.log("Sending reminder to customer:", customerId);
  };

  const handleRecordPayment = (customerId: string) => {
    console.log("Recording payment for customer:", customerId);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64 text-gray-500">
          Loading customer data...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Back Button on Right */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-5xl font-bold tracking-tight text-blue-100 font-serif">
              Customer Installment Tracking
            </h3>
            <p className="text-gray-400 mt-2">
              Monitor customer payments, track installments, and manage receivables.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleBack}
            className="bg-blue-900 border-blue-700 text-white hover:bg-blue-800 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Selling Price" 
            value={formatCurrency(customerData?.summary?.totalSellingPrice || 0)} 
            icon={DollarSign} 
          />
          <StatsCard 
            title="Total Received" 
            value={formatCurrency(customerData?.summary?.totalAmountReceived || 0)} 
            icon={TrendingUp} 
          />
          <StatsCard 
            title="Total Amount Left" 
            value={formatCurrency(customerData?.summary?.totalAmountLeft || 0)} 
            icon={AlertCircle} 
          />
          <StatsCard 
            title="Upcoming (Next 7 Days)"
            value={formatCurrency(customerData?.summary?.upcomingReceivables || 0)} 
            icon={Clock}
          />
        </div>

        {/* Customer Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border bg-blue-950">
            <CardHeader>
              <CardTitle>Customer Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-900 rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                  <div className="text-2xl font-bold text-white">{customerData?.summary?.totalCustomers || 0}</div>
                  <div className="text-sm text-gray-400">Total Customers</div>
                </div>
                <div className="text-center p-4 bg-red-900 rounded-lg">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-300" />
                  <div className="text-2xl font-bold text-white">{customerData?.summary?.overdueCustomers || 0}</div>
                  <div className="text-sm text-gray-400">Overdue</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border bg-blue-950">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send Bulk Reminders
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Record Bulk Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Installments Table */}
        <Card className="border-border bg-blue-950">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Customer Installments</CardTitle>
              <div className="flex gap-2">
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-blue-900 border border-blue-700 rounded-md px-3 py-2 text-white"
                >
                  <option value="all">All Status</option>
                  <option value="on-track">On Track</option>
                  <option value="due-soon">Due Soon</option>
                  <option value="overdue">Overdue</option>
                  <option value="fully-paid">Fully Paid</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Search customers..."
                  className="bg-blue-900 border border-blue-700 rounded-md px-3 py-2 text-white placeholder-gray-400"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total Selling</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Amount Left</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Last Paid</TableHead>
                  <TableHead>Next Installment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers && filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{customer.name}</div>
                          <div className="text-sm text-gray-400">{customer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        {formatCurrency(customer.totalSellingPrice)}
                      </TableCell>
                      <TableCell className="text-green-400">
                        {formatCurrency(customer.amountPaid)}
                      </TableCell>
                      <TableCell className="text-red-400 font-semibold">
                        {formatCurrency(customer.amountLeft)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${customer.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-300">{customer.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatDate(customer.dateLastPaid)}
                      </TableCell>
                      <TableCell className={
                        customer.status === 'overdue' ? 'text-red-400 font-semibold' : 
                        customer.status === 'due-soon' ? 'text-yellow-400' : 'text-gray-300'
                      }>
                        {formatDate(customer.dateNextInstallment)}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)} text-white`}>
                          {getStatusText(customer.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleSendReminder(customer.id)}
                            className="bg-yellow-600 hover:bg-yellow-700 border-yellow-600"
                          >
                            <Send className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRecordPayment(customer.id)}
                            className="bg-green-600 hover:bg-green-700 border-green-600"
                          >
                            <DollarSign className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                      No customers found matching the current filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Status Legend */}
        <Card className="border-border bg-blue-950">
          <CardHeader>
            <CardTitle className="text-lg">Status Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-300">Fully Paid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-300">On Track</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-300">Due Soon</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-300">Overdue</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CustomerOwingPage;