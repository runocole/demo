import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Search, Plus, Mail, Phone } from "lucide-react";

const CustomersPage = () => {
  const customers = [
    {
      id: "C001",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+234 801 234 5678",
      activeRentals: 1,
      totalRentals: 5,
      totalSpent: "$1,250",
    },
    {
      id: "C002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+234 802 345 6789",
      activeRentals: 1,
      totalRentals: 8,
      totalSpent: "$2,400",
    },
    {
      id: "C003",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      phone: "+234 803 456 7890",
      activeRentals: 0,
      totalRentals: 3,
      totalSpent: "$650",
    },
    {
      id: "C004",
      name: "Alice Williams",
      email: "alice.williams@example.com",
      phone: "+234 804 567 8901",
      activeRentals: 1,
      totalRentals: 2,
      totalSpent: "$400",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
            <p className="text-muted-foreground">
              Manage customer information and rental history
            </p>
          </div>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name, email, or phone..."
            className="pl-10"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Active Rentals</TableHead>
                  <TableHead>Total Rentals</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell className="font-semibold">{customer.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{customer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={customer.activeRentals > 0 ? "text-primary font-medium" : ""}>
                        {customer.activeRentals}
                      </span>
                    </TableCell>
                    <TableCell>{customer.totalRentals}</TableCell>
                    <TableCell className="font-semibold">{customer.totalSpent}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View Profile
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

export default CustomersPage
