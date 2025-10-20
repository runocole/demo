import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { registerStaff, getStaff} from "../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Search, Plus, Mail, Phone } from "lucide-react";

// Define proper type for a Staff
interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_activated: boolean; 
}


const StaffPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [Staff, setStaff] = useState<Staff[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); 

  useEffect(() => {
    void fetchStaff();
  }, []);

  

 const fetchStaff = async () => {
  try {
    const data = await getStaff();
    setStaff(data);
  } catch (error) {
    console.error("Failed to fetch Staff:", error);
    setStaff([]);
  }
};

 const handleAddStaff = async () => {
  if (!email) {
    alert("Email is required");
    return;
  }

  try {
    setLoading(true);
    const newStaff = await registerStaff(name, email, phone);

    if (!newStaff?.id) {
      throw new Error("Staff ID missing from response");
    }

    setShowAddModal(false);

    // Reset all form fields
    setEmail("");
    setName("");
    setPhone("");

    await fetchStaff();
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert(`Failed to add Staff: ${err.message}`);
      console.error("Staff addition failed:", err.message);
    } else {
      alert("An unknown error occurred while adding the Staff.");
      console.error("Unknown error:", err);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight"> Staff</h2>
            <p className="text-muted-foreground">
              Manage Staff information
            </p>
          </div>
          <Button className="gap-2" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" /> Add Staff
          </Button>
        </div>

        {/* Add Staff Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Staff</DialogTitle>
            </DialogHeader>

            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Staff@example.com"
              required
            />
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <Label>Phone No.</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />

           <DialogFooter className="flex flex-col gap-2">
  <Button onClick={handleAddStaff} disabled={loading}>
    {loading ? "Adding..." : "Add Staff"}
  </Button>
</DialogFooter>

          </DialogContent>
        </Dialog>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Staff by name, email, or phone..."
            className="pl-10"
          />
        </div>

        {/* Staff Table */}
        <Card className="border-border bg-blue-950">
          <CardHeader>
            <CardTitle>All Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Staff.map((Staff) => (
                  <TableRow key={Staff.id}>
                    <TableCell className="font-medium">{Staff.id}</TableCell>
                    <TableCell className="font-semibold">{Staff.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{Staff.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{Staff.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="flex gap-2">
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

export default StaffPage;