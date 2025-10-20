import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Download } from "lucide-react";

const Payments = () => {
  const payments = [
    {
      id: "PAY001",
      rentalId: "R001",
      customer: "John Doe",
      amount: "$250.00",
      date: "2025-10-01",
      reference: "PSK-123456789",
      method: "Paystack",
      status: "Completed",
    },
    {
      id: "PAY002",
      rentalId: "R002",
      customer: "Jane Smith",
      amount: "$150.00",
      date: "2025-09-28",
      reference: "PSK-987654321",
      method: "Paystack",
      status: "Completed",
    },
    {
      id: "PAY003",
      rentalId: "R003",
      customer: "Bob Johnson",
      amount: "$200.00",
      date: "2025-09-25",
      reference: "FLW-456789123",
      method: "Flutterwave",
      status: "Completed",
    },
    {
      id: "PAY004",
      rentalId: "R004",
      customer: "Alice Williams",
      amount: "$0.00",
      date: "-",
      reference: "-",
      method: "-",
      status: "Pending",
    },
  ];

  // Function to determine status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Pending":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Overdue":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Payment Tracking</h2>
            <p className="text-muted-foreground">
              Monitor all rental payments and transactions
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-blue-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-green-600 mt-1 font-medium">+18% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-blue-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$450</div>
              <p className="text-xs text-muted-foreground mt-1">3 rentals</p>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-blue-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overdue Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">$150</div>
              <p className="text-xs text-muted-foreground mt-1">1 rental</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-blue-950">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Rental ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.rentalId}</TableCell>
                    <TableCell>{payment.customer}</TableCell>
                    <TableCell className="font-semibold">{payment.amount}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell className="font-mono text-xs">{payment.reference}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                      >
                        {payment.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Payments;