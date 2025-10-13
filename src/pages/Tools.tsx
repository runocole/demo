import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { StatusBadge } from "../components/StatusBadge";
import { Search, Plus, Filter, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import { getTools, createTool, updateToolStatus, deleteTool } from "../services/api";

// --- TYPES ---
type ToolStatus = "available" | "rented" | "maintenance" | "disabled";

interface Tool {
  id: string;
  name: string;
  code: string;
  cost: string;
  status: ToolStatus;
  description?: string;
  category?: string;
}

// --- Helper to map badge colors ---
const mapBadgeStatus = (status: string) => {
  switch (status) {
    case "available":
      return "success";
    case "rented":
      return "warning";
    case "maintenance":
      return "info";
    case "disabled":
      return "error";
    default:
      return "neutral";
  }
};

// --- COMPONENT ---
const Tools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newTool, setNewTool] = useState({
    name: "",
    code: "",
    cost: "",
    description: "",
    status: "available" as ToolStatus,
  });

  // Fetch tools
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const data = await getTools();
        setTools(data);
      } catch (error) {
        console.error("Error fetching tools:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  // Add new tool
  const handleAddTool = async () => {
    if (!newTool.name || !newTool.code || !newTool.cost) return;

    try {
      const created = await createTool(newTool);
      setTools((prev) => [...prev, created]);
      setOpen(false);
      setNewTool({
        name: "",
        code: "",
        cost: "",
        description: "",
        status: "available",
      });
    } catch (error) {
      console.error("Error adding tool:", error);
      alert("Failed to add tool. Make sure you're logged in as admin/staff.");
    }
  };

  // Update status
  const handleStatusChange = async (id: string, status: ToolStatus) => {
    try {
      await updateToolStatus(id, status);
      setTools((prev) =>
        prev.map((tool) => (tool.id === id ? { ...tool, status } : tool))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // Delete tool
  const handleDeleteTool = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this tool?")) return;
    try {
      await deleteTool(id);
      setTools((prev) => prev.filter((tool) => tool.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete tool");
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading tools...</p>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tools Inventory</h2>
            <p className="text-gray-600">Manage your equipment records and statuses</p>
          </div>
          <Button
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add Tool
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input placeholder="Search tools by name or code..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {/* Header with status + delete */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{tool.name}</h3>
                      <p className="text-sm text-gray-600">{tool.code}</p>
                    </div>
                    <div className="flex items-center gap-2">
                    <StatusBadge status={tool.status} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTool(tool.id)}
                        className="text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Description & Price */}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-600">Description</p>
                        <p className="text-sm font-medium">
                          {tool.description || "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Cost</p>
                        <p className="text-sm font-bold text-blue-600">
                          ${tool.cost}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="pt-3 border-t flex justify-between items-center">
                    <Label className="text-sm text-gray-600">Change Status</Label>
                    <Select
                      defaultValue={tool.status}
                      onValueChange={(value) =>
                        handleStatusChange(tool.id, value as ToolStatus)
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
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
                onChange={(e) =>
                  setNewTool({ ...newTool, name: e.target.value })
                }
                placeholder="Tool name"
              />
            </div>
            <div>
              <Label>Code</Label>
              <Input
                value={newTool.code}
                onChange={(e) =>
                  setNewTool({ ...newTool, code: e.target.value })
                }
                placeholder="e.g. TL-001"
              />
            </div>
            <div>
              <Label>Cost</Label>
              <Input
                value={newTool.cost}
                onChange={(e) =>
                  setNewTool({ ...newTool, cost: e.target.value })
                }
                placeholder="100.00"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newTool.description}
                onChange={(e) =>
                  setNewTool({ ...newTool, description: e.target.value })
                }
                placeholder="Short description"
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={newTool.status}
                onValueChange={(val) =>
                  setNewTool({ ...newTool, status: val as ToolStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddTool}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Tool
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Tools;
