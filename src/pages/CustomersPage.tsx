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
import { toast } from "../components/ui/use-toast";

// ------------------------------
// INTERFACE
// ------------------------------
interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  state: string;
  is_activated: boolean;
}

// ------------------------------
// COMPONENT
// ------------------------------
const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);

  // Add Customer Fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
  });

  // ------------------------------
  // Fetch Customers
  // ------------------------------
  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast({ title: "Error", description: "Could not fetch customers." });
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ------------------------------
  // Add Customer
  // ------------------------------
  const handleAddCustomer = async () => {
    const { name, email, phone, state } = formData;

    if (!email || !name) {
      toast({ title: "Missing Info", description: "Name and Email are required." });
      return;
    }

    try {
      setLoading(true);
      const response = await registerCustomer(name, email, phone, state);
      
      // Store the newly created customer for the sales page
      const createdCustomer: Customer = {
        id: response.id || String(customers.length + 1),
        name: name,
        email: email,
        phone: phone,
        state: state,
        is_activated: false
      };
      
      setNewCustomer(createdCustomer);
      toast({ 
        title: "Success", 
        description: "Customer added successfully! Email with password has been sent." 
      });
      setFormData({ name: "", email: "", phone: "", state: "" });
      setShowAddModal(false);
      setShowSuccessModal(true);
      fetchCustomers();
    } catch (error: any) {
      console.error("Add customer failed:", error);
      
      // Check if the error is about email sending but customer was created
      if (error.response?.status === 500 && error.response?.data?.detail?.includes('email')) {
        // Customer might have been created but email failed
        const createdCustomer: Customer = {
          id: error.response.data.id || String(customers.length + 1),
          name: name,
          email: email,
          phone: phone,
          state: state,
          is_activated: false
        };
        
        setNewCustomer(createdCustomer);
        toast({ 
          title: "Customer Created", 
          description: "Customer was created but email failed to send. You can still add a sale.",
          variant: "destructive"
        });
        setFormData({ name: "", email: "", phone: "", state: "" });
        setShowAddModal(false);
        setShowSuccessModal(true);
        fetchCustomers();
      } else {
        toast({ 
          title: "Error", 
          description: error.response?.data?.detail || "Failed to add customer." 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // Navigate to Sales Page
  // ------------------------------
  const handleAddSale = () => {
    if (newCustomer) {
      // Store customer data for the sales page
      localStorage.setItem('selectedCustomer', JSON.stringify({
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        state: newCustomer.state
      }));
      
      // Navigate to sales page
      window.location.href = '/sales'; // or use your router if using React Router
    }
  };

  // ------------------------------
  // Activate Customer
  // ------------------------------
  const handleActivateCustomer = async (id: number) => {
    try {
      await activateCustomer(id);
      toast({ title: "Activated", description: "Customer account activated." });
      fetchCustomers();
    } catch (error) {
      toast({ title: "Error", description: "Activation failed." });
    }
  };

  // ------------------------------
  // Filter Customers (Search)
  // ------------------------------
  const filteredCustomers = customers.filter((customer) => {
    const term = searchTerm.toLowerCase();

    const name = customer.name?.toLowerCase() || "";
    const email = customer.email?.toLowerCase() || "";
    const phone = customer.phone?.toLowerCase() || "";

    return (
      name.includes(term) ||
      email.includes(term) ||
      phone.includes(term)
    );
  });

  // ------------------------------
  // RENDER
  // ------------------------------
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
            <p className="text-muted-foreground">
              Manage customer information and account status
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

            <div className="space-y-3">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Customer name"
                required
              />

              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="customer@example.com"
                required
              />

              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 08012345678"
              />

              <Label>State</Label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g. Lagos"
              />
            </div>

            <DialogFooter>
              <Button onClick={handleAddCustomer} disabled={loading}>
                {loading ? "Adding..." : "Add Customer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="bg-white text-gray-900">
            <DialogHeader>
              <DialogTitle className="text-green-600">Success!</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-lg text-gray-900">
                Successfully added a customer, kindly proceed to add sale
              </p>
              {newCustomer && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md text-gray-900">
                  <p className="text-gray-900"><strong>Name:</strong> {newCustomer.name}</p>
                  <p className="text-gray-900"><strong>Email:</strong> {newCustomer.email}</p>
                  <p className="text-gray-900"><strong>Phone:</strong> {newCustomer.phone}</p>
                  <p className="text-gray-900"><strong>State:</strong> {newCustomer.state}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleAddSale} className="bg-blue-600 hover:bg-blue-700 text-white">
                Add Sale
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name, email, or phone..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                  <TableHead>State</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium text-sm">
                        {String(customer.id).slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell className="font-semibold">{customer.name}</TableCell>

                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{customer.email ?? "No email"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>{customer.state || "—"}</TableCell>

                      <TableCell>
                        {customer.is_activated ? (
                          <span className="text-green-600 font-medium">Active</span>
                        ) : (
                          <span className="text-yellow-600 font-medium">Inactive</span>
                        )}
                      </TableCell>

                      <TableCell className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleActivateCustomer(Number(customer.id))}
                          disabled={customer.is_activated}
                        >
                          {customer.is_activated ? "Activated" : "Inactive"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No customers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CustomersPage;