import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { registerCustomer, getCustomers } from "../services/api";
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  // Receiver sale fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [equipment, setEquipment] = useState("");
  const [costSold, setCostSold] = useState("");
  const [dateSold, setDateSold] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [paymentPlan, setPaymentPlan] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.warn("Using static data (no backend connected).");
      setCustomers([
        {
          id: "C001",
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+234 801 234 5678",
          activeRentals: 1,
          totalRentals: 5,
          totalSpent: "$1,250",
        },
      ]);
    }
  };

const handleAddCustomer = async () => {
  if (!email) {
    alert("Email is required");
    return;
  }

  try {
    setLoading(true);
    
    // 1. First register the customer
    const newCustomer = await registerCustomer(email, role);
    
    // 2. If receiver sale fields are filled, create receiver sale
    if (name || phone || equipment) {
      await handleSubmitReceiverSale(newCustomer.id); // Pass the new customer ID
    }
    
    alert("Customer added successfully! An email with login credentials has been sent.");
    setShowAddModal(false);
    
    // Reset all form fields
    setEmail("");
    setRole("customer");
    setName("");
    setPhone("");
    setState("");
    setEquipment("");
    setCostSold("");
    setDateSold("");
    setInvoiceNumber("");
    setPaymentPlan("");
    setExpiryDate("");
    
    fetchCustomers();
  } catch (err: any) {
    alert("Failed to add customer. Check console.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleSubmitReceiverSale = async (customerId?: string) => {
  // Use the newly created customer ID or fallback to existing logic
  const payload = {
    customer: customerId, // Use the new customer ID
    phone,
    state,
    equipment_type: equipment,
    cost_sold: parseFloat(costSold) || 0,
    date_sold: dateSold || new Date().toISOString().split('T')[0],
    invoice_number: invoiceNumber,
    payment_plan: paymentPlan,
    receiver_expiry_date: expiryDate,
  };

  try {
    const token = localStorage.getItem("access");
    const response = await fetch("http://localhost:8000/api/receiver-sales/", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to record sale");

    alert("Receiver sale recorded successfully!");
    return true;
  } catch (err) {
    console.error(err);
    alert("Failed to record sale.");
    return false;
  }
};

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
            <p className="text-muted-foreground">Manage customer information and rental history</p>
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
            <Label>State</Label>
            <Input value={state} onChange={(e) => setState(e.target.value)} />
            <Label>Equipment</Label>
            <select value={equipment} onChange={(e) => setEquipment(e.target.value)} className="border rounded p-2 w-full">
              <option value="Rover">Rover</option>
              <option value="Base">Base</option>
              <option value="Base and Rover">Base and Rover</option>
              <option value="Base and Rover with External Radio">Base and Rover with External Radio</option>
            </select>
            <Label>Cost Sold</Label>
            <Input type="number" value={costSold} onChange={(e) => setCostSold(e.target.value)} />
            <Label>Date Sold</Label>
            <Input type="date" value={dateSold} onChange={(e) => setDateSold(e.target.value)} />
            <Label>Invoice/Receipt/Waybill No.</Label>
            <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
            <Label>Payment Plan/History</Label>
            <Input value={paymentPlan} onChange={(e) => setPaymentPlan(e.target.value)} />
            <Label>Receiver Expiry Date</Label>
            <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />

            <DialogFooter>
              <Button onClick={handleAddCustomer} disabled={loading}>
                {loading ? "Adding..." : "Add Customer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search customers by name, email, or phone..." className="pl-10" />
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
                      <span className={customer.activeRentals > 0 ? "text-primary font-medium" : ""}>
                        {customer.activeRentals}
                      </span>
                    </TableCell>
                    <TableCell>{customer.totalRentals}</TableCell>
                    <TableCell className="font-semibold">{customer.totalSpent}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View Profile</Button>
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
