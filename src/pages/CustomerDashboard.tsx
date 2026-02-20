import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { 
  Package, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Lock, 
  Copy, 
  Activity 
} from "lucide-react";
import { Progress } from "../components/ui/progress";

// ✅ UPDATE: Import the actual functions from your api.ts
import { fetchCustomerOwingData, getSales } from "../services/api"; 

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Customer");
  
  // State for data
  const [financials, setFinancials] = useState<any>(null); 
  const [sales, setSales] = useState<any[]>([]); 

  useEffect(() => {
    // 1. Get User Name
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserName(parsed.name || "Customer");
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    // 2. Fetch Data (Updated Logic)
    const loadData = async () => {
      try {
        setLoading(true);

        // ✅ Run both API calls in parallel
        const [financialData, salesData] = await Promise.all([
            fetchCustomerOwingData(), // Gets the owing/payment stats
            getSales()                // Gets the list of purchased tools
        ]);

        // ✅ Set state with the actual responses
        setFinancials(financialData);
        
        // Handle case where sales might be paginated (response.results) or a flat array
        if (Array.isArray(salesData)) {
            setSales(salesData);
        } else if (salesData?.results) {
            setSales(salesData.results);
        } else {
            setSales([]);
        }

      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96 text-blue-200">
          <Activity className="w-8 h-8 animate-spin mr-2" />
          Loading your dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-2">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Hello, <span className="text-blue-400">{userName}</span>
            </h1>
            <p className="text-slate-400 mt-1">
              Manage your equipment and payments.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/payments')} 
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Make a Payment
          </Button>
        </div>

        {/* Financial Overview Cards */}
        {financials && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Purchase Value</CardTitle>
                <Package className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  ₦{financials.totalSellingPrice?.toLocaleString() || "0.00"}
                </div>
                <p className="text-xs text-slate-500 mt-1">Total value of equipment</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Outstanding Balance</CardTitle>
                <AlertCircle className={`h-4 w-4 ${financials.amountLeft > 0 ? "text-red-500" : "text-green-500"}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  ₦{financials.amountLeft?.toLocaleString() || "0.00"}
                </div>
                <Progress 
                    value={financials.progress || 0} 
                    className="h-2 mt-2 bg-slate-800" 
                />
                <p className="text-xs text-slate-500 mt-1">
                    {financials.progress}% Paid
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Next Payment Due</CardTitle>
                <Calendar className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {financials.dateNextInstallment 
                    ? new Date(financials.dateNextInstallment).toLocaleDateString() 
                    : "No Due Date"}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Status: <span className="capitalize text-blue-300">{financials.status}</span>
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Purchased Equipment List */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">My Equipment</h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sales.map((sale) => (
                    // Logic: We map through sales, then items inside that sale
                    sale.items.map((item: any) => {
                        // Check if the sale is fully paid
                        const isFullyPaid = sale.payment_status === "completed";

                        return (
                            <Card key={item.id} className="bg-[#0f1f3d] border-[#1b2d55] overflow-hidden hover:border-blue-500/50 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-[#142647]">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg font-semibold text-blue-100">
                                            {item.equipment || "Unknown Tool"}
                                        </CardTitle>
                                        <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-300 bg-blue-500/10">
                                            {item.category}
                                        </Badge>
                                    </div>
                                    {isFullyPaid ? (
                                        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                            <Lock className="h-5 w-5 text-red-500" />
                                        </div>
                                    )}
                                </CardHeader>
                                
                                <CardContent className="pt-4 space-y-4">
                                    {/* Serial Number Section */}
                                    <div>
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                                            Serial Number
                                        </p>
                                        <p className="font-mono text-sm text-white bg-slate-900/50 p-2 rounded border border-slate-800">
                                            {item.serial_number || "Pending Assignment"}
                                        </p>
                                    </div>

                                    {/* Activation Code Section */}
                                    <div className={`p-3 rounded-lg border ${
                                        isFullyPaid 
                                        ? "bg-green-950/30 border-green-900/50" 
                                        : "bg-red-950/10 border-red-900/30"
                                    }`}>
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                                Activation Code
                                            </p>
                                            {isFullyPaid && (
                                                <Badge className="bg-green-600 text-[10px] h-5 px-1">Active</Badge>
                                            )}
                                        </div>
                                        
                                        {isFullyPaid ? (
                                            <div className="flex justify-between items-center mt-1">
                                                <code className="text-lg font-mono text-green-400 tracking-widest">
                                                    {item.activation_code || "GEN-CODE-REQ"}
                                                </code>
                                                <button 
                                                    className="text-slate-400 hover:text-white transition-colors"
                                                    onClick={() => {
                                                        if(item.activation_code) 
                                                            navigator.clipboard.writeText(item.activation_code)
                                                    }}
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-2 space-y-2 text-center">
                                                <div className="text-lg font-bold text-slate-700 blur-[4px] select-none">
                                                    XXXX-XXXX-XXXX
                                                </div>
                                                <p className="text-xs text-red-300">
                                                    Complete payment to view
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Invoice Info */}
                                    <div className="pt-2 flex justify-between items-center border-t border-slate-800">
                                        <span className="text-xs text-slate-500">Invoice: #{sale.invoice_number}</span>
                                        <span className="text-xs text-slate-500">
                                            {new Date(sale.date_sold).toLocaleDateString()}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                ))}
                
                {sales.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/50 rounded-lg border border-slate-800 border-dashed">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No equipment found.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;