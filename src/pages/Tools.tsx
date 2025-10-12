import { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { StatusBadge } from "../components/StatusBadge";
import { Search, Plus, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../components/ui/select";

// Tool status type
type ToolStatus = "available" | "rented" | "out-of-stock" | "maintenance";

// Tool interface
interface Tool {
  id: string;
  name: string;
  code: string;
  cost: string;
  category: string;
  status: ToolStatus;
}

// Component
const Tools = () => {
  const [tools, setTools] = useState<Tool[]>([
    {
      id: "T001",
      name: "Total Station Leica TS06",
      code: "TS-LEI-001",
      cost: "$1200.00",
      status: "available",
      category: "Surveying Equipment",
    },
    {
      id: "T002",
      name: "GPS Receiver Trimble R10",
      code: "GPS-TRI-001",
      cost: "$1850.00",
      status: "rented",
      category: "GPS Equipment",
    },
    {
      id: "T003",
      name: "Digital Theodolite",
      code: "TH-DIG-001",
      cost: "$980.00",
      status: "maintenance",
      category: "Surveying Equipment",
    },
  ]);

  const [newTool, setNewTool] = useState<Omit<Tool, "id">>({
    name: "",
    code: "",
    cost: "",
    category: "",
    status: "available",
  });

  
  const [open, setOpen] = useState(false);

  // Add new tool
  const handleAddTool = () => {
    if (!newTool.name || !newTool.code || !newTool.cost) return;

    const newToolEntry: Tool = {
      id: `T${(tools.length + 1).toString().padStart(3, "0")}`,
      ...newTool,
    };

    setTools([...tools, newToolEntry]);
    setOpen(false);
    setNewTool({ name: "", code: "", cost: "", category: "", status: "available" });
  };

  // Update status
  const handleStatusChange = (id: string, status: ToolStatus) => {
    setTools((prev) =>
      prev.map((tool) => (tool.id === id ? { ...tool, status } : tool))
    );
  };

  // Map status for StatusBadge
  const mapBadgeStatus = (status: ToolStatus) => {
    return status === "out-of-stock" ? "disabled" : status;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tools Inventory</h2>
            <p className="text-gray-600">Manage your equipment records and statuses</p>
          </div>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Tool
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input placeholder="Search tools by name or code..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{tool.name}</h3>
                      <p className="text-sm text-gray-600">{tool.code}</p>
                    </div>
                    <StatusBadge status={mapBadgeStatus(tool.status)} />
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-600">Category</p>
                        <p className="text-sm font-medium">{tool.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Cost</p>
                        <p className="text-sm font-bold text-blue-600">{tool.cost}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Select
                      defaultValue={tool.status}
                      onValueChange={(value) => handleStatusChange(tool.id, value as ToolStatus)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Tool Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tool</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Name</Label>
              <Input
                value={newTool.name}
                onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                placeholder="Tool name"
              />
            </div>
            <div>
              <Label>Code</Label>
              <Input
                value={newTool.code}
                onChange={(e) => setNewTool({ ...newTool, code: e.target.value })}
                placeholder="e.g. TL-001"
              />
            </div>
            <div>
              <Label>Cost</Label>
              <Input
                value={newTool.cost}
                onChange={(e) => setNewTool({ ...newTool, cost: e.target.value })}
                placeholder="$1000.00"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={newTool.category}
                onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
                placeholder="Surveying Equipment"
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={newTool.status}
                onValueChange={(val) => setNewTool({ ...newTool, status: val as ToolStatus })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddTool} className="bg-blue-600 hover:bg-blue-700">
              Add Tool
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Tools;
