import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
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
import { Plus, Download } from "lucide-react";

const Rentals = () => {
  const rentals = [
    {
      id: "R001",
      toolName: "Total Station Leica TS06",
      toolCode: "TS-LEI-001",
      customer: "John Doe",
      startDate: "2025-10-01",
      endDate: "2025-10-05",
      amountDue: "$250.00",
      amountPaid: "$250.00",
      status: "active" as const,
    },
    {
      id: "R002",
      toolName: "GPS Receiver Trimble R10",
      toolCode: "GPS-TRI-001",
      customer: "Jane Smith",
      startDate: "2025-09-28",
      endDate: "2025-10-02",
      amountDue: "$300.00",
      amountPaid: "$150.00",
      status: "overdue" as const,
    },
    {
      id: "R003",
      toolName: "Digital Theodolite",
      toolCode: "TH-DIG-001",
      customer: "Bob Johnson",
      startDate: "2025-09-25",
      endDate: "2025-09-30",
      amountDue: "$200.00",
      amountPaid: "$200.00",
      status: "completed" as const,
    },
    {
      id: "R004",
      toolName: "Laser Level Bosch",
      toolCode: "LL-BOS-001",
      customer: "Alice Williams",
      startDate: "2025-10-01",
      endDate: "2025-10-03",
      amountDue: "$90.00",
      amountPaid: "$0.00",
      status: "pending" as const,
    },
  ];

  // Function to determine amount paid color
  const getAmountPaidColor = (amountPaid: string, amountDue: string) => {
    const paid = parseFloat(amountPaid.replace('$', ''));
    const due = parseFloat(amountDue.replace('$', ''));
    
    if (paid === 0) return "text-red-600 font-medium";
    if (paid < due) return "text-amber-600 font-medium";
    if (paid === due) return "text-green-600 font-medium";
    return "text-gray-600";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Rental Management</h2>
            <p className="text-muted-foreground">
              Track and manage all tool rentals
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4" />
              New Rental
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rental ID</TableHead>
                  <TableHead>Tool</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Amount Due</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell className="font-medium">{rental.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{rental.toolName}</div>
                        <div className="text-xs text-muted-foreground">{rental.toolCode}</div>
                      </div>
                    </TableCell>
                    <TableCell>{rental.customer}</TableCell>
                    <TableCell>{rental.startDate}</TableCell>
                    <TableCell>{rental.endDate}</TableCell>
                    <TableCell>{rental.amountDue}</TableCell>
                    <TableCell className={getAmountPaidColor(rental.amountPaid, rental.amountDue)}>
                      {rental.amountPaid}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={rental.status} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
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

export default Rentals;