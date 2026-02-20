import { useState, useEffect } from "react";
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
import { 
  Save, 
  Search, 
  Package, 
  UserCheck, 
  RefreshCcw, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { toast } from "../components/ui/use-toast";

interface ReceiverItem {
  serial: string;
  tool_name: string;
  status: 'In Stock' | 'Sold';
  current_code: string;
  duration: string;
  customer_name?: string;
  invoice?: string;
}

const CodesManagement = () => {
  const [activeTab, setActiveTab] = useState<'in_stock' | 'sold'>('in_stock');
  const [data, setData] = useState<{ in_stock: ReceiverItem[], sold: ReceiverItem[] }>({ in_stock: [], sold: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [savingSerial, setSavingSerial] = useState<string | null>(null);

  // Local state for inline editing
  const [editValues, setEditValues] = useState<{ [key: string]: { code: string, duration: string } }>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/codes/management/');
      const result = await response.json();
      setData(result);
      
      // Sync edit state with fetched data
      const initialEdits: any = {};
      [...result.in_stock, ...result.sold].forEach(item => {
        initialEdits[item.serial] = { 
          code: item.current_code || "", 
          duration: item.duration || "unlimited" 
        };
      });
      setEditValues(initialEdits);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch receiver data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (serial: string, field: 'code' | 'duration', value: string) => {
    setEditValues(prev => ({
      ...prev,
      [serial]: { ...prev[serial], [field]: value }
    }));
  };

  const saveCode = async (serial: string) => {
    setSavingSerial(serial);
    const { code, duration } = editValues[serial];

    try {
      const response = await fetch('/api/codes/management/save/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serial, code, duration })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Code updated for Serial: ${serial}`,
        });
        // Optional: refresh data to ensure sync
      } else {
        throw new Error();
      }
    } catch (err) {
      toast({
        title: "Update Failed",
        description: "Could not save the activation code.",
        variant: "destructive",
      });
    } finally {
      setSavingSerial(null);
    }
  };

  const filteredList = data[activeTab].filter(item => 
    item.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tool_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Receiver Codes</h2>
            <p className="text-muted-foreground">
              Manage activation codes for inventory and sold units.
            </p>
          </div>
          <Button variant="outline" onClick={fetchData} className="gap-2 border-slate-700 bg-slate-800 text-white hover:bg-slate-700">
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {/* Search and Tabs */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-blue-950/40 p-1 rounded-xl border border-blue-900/50">
          <div className="flex w-full md:w-auto">
            <button
              onClick={() => setActiveTab('in_stock')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'in_stock' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Package className="h-4 w-4" />
              In Stock ({data.in_stock.length})
            </button>
            <button
              onClick={() => setActiveTab('sold')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'sold' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              Sold ({data.sold.length})
            </button>
          </div>

          <div className="relative w-full md:w-72 pr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by serial or name..."
              className="pl-10 bg-blue-950 border-blue-800 focus:ring-blue-500 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Main Table Card */}
        <Card className="border-blue-900/50 bg-blue-950/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              {activeTab === 'in_stock' ? 'Inventory Receivers' : 'Customer Assignments'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-blue-900/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-blue-900/30">
                  <TableRow className="hover:bg-transparent border-blue-900/50">
                    <TableHead className="text-blue-200">Receiver Info</TableHead>
                    {activeTab === 'sold' && <TableHead className="text-blue-200">Customer/Invoice</TableHead>}
                    <TableHead className="text-blue-200">Activation Code</TableHead>
                    <TableHead className="text-blue-200">Duration</TableHead>
                    <TableHead className="text-right text-blue-200">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={activeTab === 'sold' ? 5 : 4} className="h-32 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                          <span>Syncing records...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={activeTab === 'sold' ? 5 : 4} className="h-32 text-center text-muted-foreground">
                        No receivers found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredList.map((item) => (
                      <TableRow key={item.serial} className="border-blue-900/50 hover:bg-blue-900/10 transition-colors">
                        <TableCell>
                          <div className="font-bold text-white">{item.serial}</div>
                          <div className="text-xs text-blue-400/80">{item.tool_name}</div>
                        </TableCell>

                        {activeTab === 'sold' && (
                          <TableCell>
                            <div className="text-sm font-medium text-white">{item.customer_name}</div>
                            <div className="text-[10px] text-teal-400 font-mono uppercase tracking-wider">INV: {item.invoice}</div>
                          </TableCell>
                        )}

                        <TableCell className="min-w-[200px]">
                          <Input
                            className="bg-blue-950 border-blue-800 text-teal-300 font-mono text-xs focus:border-blue-500 h-8"
                            value={editValues[item.serial]?.code || ""}
                            onChange={(e) => handleInputChange(item.serial, 'code', e.target.value)}
                          />
                        </TableCell>

                        <TableCell>
                          <select 
                            className="bg-blue-950 border border-blue-800 text-white rounded px-2 py-1 text-xs outline-none focus:border-blue-500 w-full"
                            value={editValues[item.serial]?.duration || 'unlimited'}
                            onChange={(e) => handleInputChange(item.serial, 'duration', e.target.value)}
                          >
                            <option value="unlimited">Unlimited</option>
                            <option value="1 year">1 Year</option>
                            <option value="2 years">2 Years</option>
                            <option value="6 months">6 Months</option>
                            <option value="trial">Trial (30 days)</option>
                          </select>
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => saveCode(item.serial)}
                            disabled={savingSerial === item.serial}
                            className="bg-blue-600 hover:bg-blue-500 text-white h-8 gap-2"
                          >
                            {savingSerial === item.serial ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Save className="h-3 w-3" />
                            )}
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CodesManagement;