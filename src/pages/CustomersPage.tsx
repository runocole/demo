import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { registerCustomer, getCustomers, activateCustomer } from "../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Search, Plus, Mail, Phone } from "lucide-react";

// Define proper type for a customer
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  activeRentals: number;
  totalRentals: number;
  totalSpent: string;
  is_activated: boolean; 
}


const CustomersPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 

  useEffect(() => {
    void fetchCustomers();
  }, []);

  

 const fetchCustomers = async () => {
  try {
    const data = await getCustomers();
    setCustomers(data);
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    setCustomers([]);
  }
};

 const handleAddCustomer = async () => {
  if (!email) {
    alert("Email is required");
    return;
  }

  try {
    setLoading(true);
    const newCustomer = await registerCustomer(name, email, phone);

    if (!newCustomer?.id) {
      throw new Error("Customer ID missing from response");
    }

    const saleRecorded = await handleSubmitReceiverSale(newCustomer.id);

    setSuccessMessage(
      saleRecorded
        ? `✅ Customer added and sale recorded successfully! Login credentials have been sent to ${email}`
        : `⚠️ Customer added successfully, but sale record failed.`
    );

    setShowAddModal(false);

    // Reset all form fields
    setEmail("");
    setRole("customer");
    setName("");
    setPhone("");

    await fetchCustomers();
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert(`Failed to add customer: ${err.message}`);
      console.error("Customer addition failed:", err.message);
    } else {
      alert("An unknown error occurred while adding the customer.");
      console.error("Unknown error:", err);
    }
  } finally {
    setLoading(false);
  }
};



 const handleSubmitReceiverSale = async (customerId?: string) => {
  if (!customerId) {
    console.error("Customer ID is missing");
    return false;
  }

  const payload = {
    customer: customerId,
    phone,
  };

  try {
    const token = localStorage.getItem("access");
    const response = await fetch("http://localhost:8000/api/receiver-sales/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Failed to record sale");
    }

    console.log("Sale recorded successfully");
    return true;
  } catch (error) {
    console.error("Sale recording failed:", error);
    return false;
  }
};

const handleActivateCustomer = async (customerId: number) => {
  try {
    const data = await activateCustomer(customerId);
    alert(data.detail || "Customer account activated successfully!");
    await fetchCustomers(); // Refresh list
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert(`Activation failed: ${err.message}`);
    } else {
      alert("Activation failed due to an unknown error.");
    }
  }
};



  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
            <p className="text-muted-foreground">
              Manage customer information and rental history
            </p>
          </div>
          <Button className="gap-2" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        </div>

        {/* Add Customer Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>

            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              required
            />

            <Label>Role</Label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
            </select>

            {/* Receiver Sale Info */}
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <Label>Phone No.</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />

           <DialogFooter className="flex flex-col gap-2">
  <Button onClick={handleAddCustomer} disabled={loading}>
    {loading ? "Adding..." : "Add Customer"}
  </Button>

  {successMessage && (
    <p className="text-green-600 text-sm font-medium">
      {successMessage}
    </p>
  )}
</DialogFooter>

          </DialogContent>
        </Dialog>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name, email, or phone..."
            className="pl-10"
          />
        </div>

        {/* Customer Table */}
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
                      <span
                        className={
                          customer.activeRentals > 0
                            ? "text-primary font-medium"
                            : ""
                        }
                      >
                        {customer.activeRentals}
                      </span>
                    </TableCell>
                    <TableCell>{customer.totalRentals}</TableCell>
                    <TableCell className="font-semibold">
                      {customer.totalSpent}
                    </TableCell>
                    <TableCell className="flex gap-2">
  <Button variant="ghost" size="sm">
    View Profile
  </Button>

  <Button
    variant="outline"
    size="sm"
    onClick={() => handleActivateCustomer(Number(customer.id))}
    disabled={customer.is_activated}
  >
    {customer.is_activated ? "Activated" : "Activate Account"}
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

export default CustomersPage;
