import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { StatusBadge } from "../components/StatusBadge";
import { Search, Plus, Filter } from "lucide-react";

const Tools = () => {
  const tools = [
    {
      id: "T001",
      name: "Total Station Leica TS06",
      code: "TS-LEI-001",
      pricePerDay: "$50.00",
      status: "available" as const,
      category: "Surveying Equipment",
    },
    {
      id: "T002",
      name: "GPS Receiver Trimble R10",
      code: "GPS-TRI-001",
      pricePerDay: "$75.00",
      status: "rented" as const,
      category: "GPS Equipment",
    },
    {
      id: "T003",
      name: "Digital Theodolite",
      code: "TH-DIG-001",
      pricePerDay: "$40.00",
      status: "maintenance" as const,
      category: "Surveying Equipment",
    },
    {
      id: "T004",
      name: "Laser Level Bosch",
      code: "LL-BOS-001",
      pricePerDay: "$30.00",
      status: "available" as const,
      category: "Leveling Equipment",
    },
    {
      id: "T005",
      name: "Auto Level Sokkia",
      code: "AL-SOK-001",
      pricePerDay: "$25.00",
      status: "available" as const,
      category: "Leveling Equipment",
    },
    {
      id: "T006",
      name: "Measuring Wheel Professional",
      code: "MW-PRO-001",
      pricePerDay: "$15.00",
      status: "disabled" as const,
      category: "Measuring Tools",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tools Inventory</h2>
            <p className="text-muted-foreground">
              Manage your surveying equipment and tools
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Tool
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools by name or code..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground">{tool.code}</p>
                    </div>
                    <StatusBadge status={tool.status} />
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Category</p>
                        <p className="text-sm font-medium">{tool.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Price/Day</p>
                        <p className="text-sm font-bold text-primary">{tool.pricePerDay}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1" disabled={tool.status !== "available"}>
                      Rent Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tools;
