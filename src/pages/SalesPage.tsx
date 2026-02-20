// import { useEffect, useState } from "react";
// import { Plus, FileText, Search, X, Trash2, Edit, Eye, Barcode } from "lucide-react";
// import { Button } from "../components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "../components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "../components/ui/dialog";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "../components/ui/select";
// import { DashboardLayout } from "../components/DashboardLayout";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import axios from "axios";

// // Interfaces
// interface SerialNumbers {
//   receiver?: string;
//   receiver1?: string;
//   receiver2?: string;
//   data_logger?: string;
//   external_radio?: string;
//   [key: string]: any;
// }

// interface SaleItem {
//   tool_id: string;
//   equipment: string;
//   cost: string;
//   category?: string;
//   serial_set?: string[];
//   datalogger_serial?: string;
//   assigned_tool_id?: string;
//   invoice_number?: string; // Sales invoice
//   import_invoice?: string; // Import invoice from tools
// }

// interface Sale {
//   id: number;
//   customer_id?: number;
//   name: string;
//   phone: string;
//   state: string;
//   items: SaleItem[];
//   total_cost: string;
//   date_sold: string;
//   invoice_number?: string; // Sales invoice
//   import_invoice?: string; // Import invoice from tools
//   payment_plan?: string;
//   initial_deposit?: string; // NEW: Initial deposit amount
//   payment_months?: string;  // NEW: Number of months to spread payment
//   expiry_date?: string;
//   payment_status?: string;
// }

// interface Customer {
//   id: number;
//   name: string;
//   phone: string;
//   email: string;
//   state: string;
//   user?: number;
// }

// interface Tool {
//   id: string;
//   name: string;
//   code: string;
//   category: string;
//   cost: string | number;
//   stock: number;
//   description?: string;
//   supplier?: string;
//   supplier_name?: string;
//   invoice_number?: string;
//   expiry_date?: string;
//   date_added?: string;
//   serials?: SerialNumbers;
//   available_serials?: string[];
//   sold_serials?: any[];
//   equipment_type?: string | null;
//   equipment_type_id?: string | null;
//   box_type?: string;
// }

// // Grouped tool interface
// interface GroupedTool {
//   name: string;
//   category: string;
//   cost: string | number;
//   total_stock: number;
//   tool_count: number;
//   description?: string;
//   supplier_name?: string;
//   group_id: string;
//   invoice_number?: string;
// }

// interface SoldSerialInfo {
//   serial: string;
//   sale_id: number;
//   customer_name: string;
//   date_sold: string;
//   invoice_number?: string;
// }

// const API_URL = "http://localhost:8000/api";

// const TOOL_CATEGORIES = [
//   "Receiver",
//   "Accessory",
//   "Total Station",
//   "Level",
//   "Drones",
//   "EchoSounder",
//   "Laser Scanner",
//   "Other",
// ];

// const RECEIVER_EQUIPMENT_TYPES = [
//   "Base Only",
//   "Rover Only", 
//   "Base & Rover Combo",
//   "Accessories"
// ];

// const PAYMENT_STATUSES = [
//   "pending",
//   "completed",
//   "installment",
//   "failed",
//   "cancelled"
// ];

// // Helper functions for serial numbers
// const isSerialNumbersObject = (serials: any): serials is SerialNumbers => {
//   return serials && typeof serials === 'object' && !Array.isArray(serials);
// };

// const getSerialValue = (serials: any, key: string): string => {
//   if (!serials) return '';
//   if (isSerialNumbersObject(serials)) {
//     return serials[key] || '';
//   }
//   return '';
// };

// export default function SalesPage() {
//   const [sales, setSales] = useState<Sale[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [tools, setTools] = useState<Tool[]>([]);
//   const [groupedTools, setGroupedTools] = useState<GroupedTool[]>([]);
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
//   const [open, setOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loading, setLoading] = useState(true);
  
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<Customer[]>([]);
//   const [showSearchResults, setShowSearchResults] = useState(false); 

//   // Multi-item state
//   const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
//   const [currentItem, setCurrentItem] = useState<{
//     selectedCategory: string;
//     selectedEquipmentType: string;
//     selectedTool: GroupedTool | null;
//     cost: string;
//   }>({
//     selectedCategory: "",
//     selectedEquipmentType: "",
//     selectedTool: null,
//     cost: ""
//   });

//   const [filteredGroupedTools, setFilteredGroupedTools] = useState<GroupedTool[]>([]);
//   const [saleDetails, setSaleDetails] = useState({
//     payment_plan: "",
//     initial_deposit: "", // NEW: Initial deposit amount
//     payment_months: "",  // NEW: Number of months
//     expiry_date: ""
//   });

//   // Equipment type modal state
//   const [showEquipmentTypeModal, setShowEquipmentTypeModal] = useState(false);

//   // Edit status state
//   const [editingSale, setEditingSale] = useState<Sale | null>(null);
//   const [editStatusOpen, setEditStatusOpen] = useState(false);
//   const [newPaymentStatus, setNewPaymentStatus] = useState("");
//   const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

//   // Serial number viewing state
//   const [viewingSerials, setViewingSerials] = useState<{
//     open: boolean;
//     tool: Tool | null;
//     soldSerials: SoldSerialInfo[];
//   }>({
//     open: false,
//     tool: null,
//     soldSerials: []
//   });

//   // Assignment confirmation state
//   const [assignmentResult, setAssignmentResult] = useState<{
//     open: boolean;
//     toolName: string;
//     serialSet: string[];
//     serialCount: number;
//     setType: string;
//     assignedToolId: string;
//     dataloggerSerial?: string;
//     invoiceNumber?: string; // Sales invoice
//     importInvoice?: string; // Import invoice
//   } | null>(null);

//   const token = localStorage.getItem("access");
  
//   const axiosConfig = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   // NEW: Enhanced function to get complete tool data with all serials
//   const getCompleteToolData = async (toolId: string): Promise<Tool | null> => {
//     try {
//       const response = await axios.get(`${API_URL}/tools/${toolId}/`, axiosConfig);
//       console.log("Complete tool data:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching complete tool data:", error);
//       return null;
//     }
//   };

//   // NEW: Function to extract all serial numbers from a tool
//   const extractAllSerialsFromTool = (
//   tool: Tool,
//   expectedEquipmentType?: string
// ): { serialSet: string[]; dataloggerSerial?: string } => {
//   const serialSet: string[] = [];
//   let dataloggerSerial: string | undefined;

//   if (tool.serials && isSerialNumbersObject(tool.serials)) {
//     console.log("Extracting serials from tool:", tool.serials, "expected:", expectedEquipmentType);

//     if (expectedEquipmentType === "Base & Rover Combo") {
//       // Should have two receivers
//       if (tool.serials.receiver1) serialSet.push(tool.serials.receiver1);
//       if (tool.serials.receiver2) serialSet.push(tool.serials.receiver2);
//       // Fallback: if only 'receiver' exists (data inconsistency), use it once
//       if (serialSet.length === 0 && tool.serials.receiver) {
//         console.warn("Combo tool has only one receiver serial stored");
//         serialSet.push(tool.serials.receiver);
//       }
//     } else if (expectedEquipmentType === "Base Only" || expectedEquipmentType === "Rover Only") {
//       // Single receiver
//       if (tool.serials.receiver) {
//         serialSet.push(tool.serials.receiver);
//       }
//     } else {
//       // For other categories or when no type is selected, fall back to old detection
//       if (tool.box_type?.toLowerCase().includes("base and rover") ||
//           tool.description?.toLowerCase().includes("base and rover")) {
//         if (tool.serials.receiver1) serialSet.push(tool.serials.receiver1);
//         if (tool.serials.receiver2) serialSet.push(tool.serials.receiver2);
//       } else if (tool.serials.receiver) {
//         serialSet.push(tool.serials.receiver);
//       }
//     }

//     // Always add datalogger if present
//     if (tool.serials.data_logger) {
//       dataloggerSerial = tool.serials.data_logger;
//     }
//   }

//   console.log("Extracted serials:", { serialSet, dataloggerSerial });
//   return { serialSet, dataloggerSerial };
// };

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [salesRes, custRes, toolsRes] = await Promise.all([
//           axios.get(`${API_URL}/sales/`, axiosConfig),
//           axios.get(`${API_URL}/customers/`, axiosConfig),
//           axios.get(`${API_URL}/tools/`, axiosConfig),
//         ]);
//         setSales(salesRes.data);
//         setCustomers(custRes.data);
//         setTools(toolsRes.data);
        
//         const storedCustomer = localStorage.getItem('selectedCustomer');
//         if (storedCustomer) {
//           const customerData = JSON.parse(storedCustomer);
//           setSelectedCustomer(customerData);
//           setOpen(true);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, []);

//   // Fetch grouped tools when category changes
//   useEffect(() => {
//     const fetchGroupedTools = async () => {
//       if (currentItem.selectedCategory) {
//         try {
//           const params = new URLSearchParams({
//             category: currentItem.selectedCategory
//           });
          
//           if (currentItem.selectedCategory === "Receiver" && currentItem.selectedEquipmentType) {
//             params.append('equipment_type', currentItem.selectedEquipmentType);
//           }
          
//           const response = await axios.get(
//             `${API_URL}/tools/grouped/?${params}`,
//             axiosConfig
//           );
//           setGroupedTools(response.data);
//           setFilteredGroupedTools(response.data);
//         } catch (error) {
//           console.error("Error fetching grouped tools:", error);
//           setGroupedTools([]);
//           setFilteredGroupedTools([]);
//         }
//       } else {
//         setGroupedTools([]);
//         setFilteredGroupedTools([]);
//       }
//     };

//     fetchGroupedTools();
//   }, [currentItem.selectedCategory, currentItem.selectedEquipmentType]);

//   // Calculate total cost
//   const totalCost = saleItems.reduce((sum, item) => sum + parseFloat(item.cost || "0"), 0);

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
    
//     if (query.trim() === "") {
//       setSearchResults([]);
//       setShowSearchResults(false);
//       return;
//     }

//     const filtered = customers.filter(customer =>
//       customer.name.toLowerCase().includes(query.toLowerCase()) ||
//       customer.phone.includes(query) ||
//       customer.email.toLowerCase().includes(query.toLowerCase()) ||
//       customer.state.toLowerCase().includes(query.toLowerCase())
//     );
    
//     setSearchResults(filtered);
//     setShowSearchResults(true);
//   };

//   const handleSelectCustomer = (customer: Customer) => {
//     setSelectedCustomer(customer);
//     setSearchQuery("");
//     setShowSearchResults(false);
//     setOpen(true);
//   };

//   const clearSearch = () => {
//     setSearchQuery("");
//     setSearchResults([]);
//     setShowSearchResults(false);
//   };

//   // Handle category selection with equipment type modal
//   const handleCategorySelect = (category: string) => {
//     setCurrentItem(prev => ({
//       ...prev,
//       selectedCategory: category,
//       selectedEquipmentType: "",
//       selectedTool: null,
//       cost: ""
//     }));

//     if (category === "Receiver") {
//       setShowEquipmentTypeModal(true);
//     }
//   };

//   // Handle equipment type selection
//   const handleEquipmentTypeSelect = (equipmentType: string) => {
//     setCurrentItem(prev => ({
//       ...prev,
//       selectedEquipmentType: equipmentType
//     }));
//     setShowEquipmentTypeModal(false);
//   };

//   // Handle tool selection from grouped tools
//   const handleToolSelect = (groupedToolName: string) => {
//     const selected = groupedTools.find(tool => tool.name === groupedToolName);
    
//     if (selected) {
//       setCurrentItem(prev => ({
//         ...prev,
//         selectedTool: selected,
//         cost: prev.cost || String(selected.cost || "")
//       }));
//     }
//   };

//   // COMPLETELY REVISED: Enhanced assign random tool function
// const assignRandomTool = async (): Promise<{
//   assigned_tool_id: string;
//   tool_name: string;
//   serial_set: string[];
//   serial_count: number;
//   set_type: string;
//   cost: string;
//   datalogger_serial?: string;
//   invoice_number?: string; // Sales invoice
//   import_invoice?: string; // Import invoice
// }> => {
//   if (!currentItem.selectedTool) {
//     throw new Error("No tool selected");
//   }

//   try {
//     console.log("Starting tool assignment for:", {
//       tool_name: currentItem.selectedTool.name,
//       category: currentItem.selectedCategory,
//       equipment_type: currentItem.selectedEquipmentType
//     });

//     // Step 1: Get the assigned tool from the API
//     const response = await axios.post(
//       `${API_URL}/tools/assign-random/`,
//       {
//         tool_name: currentItem.selectedTool.name,
//         category: currentItem.selectedCategory,
//         equipment_type: currentItem.selectedEquipmentType
//       },
//       axiosConfig
//     );
    
//     const initialResult = response.data;
//     console.log("Initial assignment result:", initialResult);
//     console.log("Initial serial_set:", initialResult.serial_set);
//     console.log("Initial serial_count:", initialResult.serial_count);

//     // Step 2: Always fetch the complete tool data to get ALL serials and import invoice
//     const completeToolData = await getCompleteToolData(initialResult.assigned_tool_id);
    
//     if (!completeToolData) {
//       throw new Error("Failed to fetch complete tool data");
//     }

//     console.log("Complete tool data:", completeToolData);
//     console.log("Complete tool serials:", completeToolData.serials);
//     console.log("receiver1 exists:", !!completeToolData.serials?.receiver1);
//     console.log("receiver2 exists:", !!completeToolData.serials?.receiver2);
//     console.log("receiver exists:", !!completeToolData.serials?.receiver);

//     // Step 3: Extract ALL serial numbers from the complete tool data
//     const { serialSet, dataloggerSerial } = extractAllSerialsFromTool(
//       completeToolData, 
//       currentItem.selectedEquipmentType
//     );

//     console.log("Extracted serials:", { serialSet, dataloggerSerial });
//     console.log("Serial set length:", serialSet.length);
//     console.log("Serial set contents:", serialSet);

//     // Step 4: Build the final result with both invoices
//     const finalResult = {
//       assigned_tool_id: initialResult.assigned_tool_id,
//       tool_name: initialResult.tool_name,
//       serial_set: serialSet,
//       serial_count: serialSet.length, // ALWAYS use the actual length from extracted serials
//       set_type: currentItem.selectedEquipmentType || initialResult.set_type,
//       cost: initialResult.cost,
//       datalogger_serial: dataloggerSerial || initialResult.datalogger_serial,
//       invoice_number: initialResult.invoice_number, // Sales invoice
//       import_invoice: completeToolData.invoice_number // Import invoice from tool
//     };

//     console.log("Final assignment result:", finalResult);
//     return finalResult;

//   } catch (error: any) {
//     console.error("Error assigning random tool:", error);
    
//     if (error.response?.status === 404) {
//       throw new Error(error.response.data.error || "No complete equipment sets available in stock");
//     } else if (error.response?.status === 400) {
//       throw new Error("Invalid request for tool assignment");
//     } else {
//       throw new Error("Failed to assign equipment set from inventory");
//     }
//   }
// };

//   // Add item to sale with automatic invoice number and serial assignment
//   const addItemToSale = async () => {
//     if (!currentItem.selectedTool || !currentItem.cost) {
//       alert("Please select equipment and enter a Selling Price.");
//       return;
//     }

//     try {
//       // Assign random tool from the group - this returns both invoice numbers and serials
//       const assignment = await assignRandomTool();
      
//       console.log("Final assignment for sale item:", assignment);

//       const newItem: SaleItem = {
//         tool_id: assignment.assigned_tool_id,
//         equipment: assignment.tool_name,
//         cost: currentItem.cost,
//         category: currentItem.selectedCategory,
//         serial_set: assignment.serial_set,
//         datalogger_serial: assignment.datalogger_serial,
//         assigned_tool_id: assignment.assigned_tool_id,
//         invoice_number: assignment.invoice_number, // Sales invoice
//         import_invoice: assignment.import_invoice // Import invoice from tool
//       };

//       setSaleItems(prev => [...prev, newItem]);
      
//       // Show assignment confirmation with all details
//       setAssignmentResult({
//         open: true,
//         toolName: assignment.tool_name,
//         serialSet: assignment.serial_set,
//         serialCount: assignment.serial_count,
//         setType: assignment.set_type,
//         assignedToolId: assignment.assigned_tool_id,
//         dataloggerSerial: assignment.datalogger_serial,
//         invoiceNumber: assignment.invoice_number, // Sales invoice
//         importInvoice: assignment.import_invoice // Import invoice
//       });

//       // Reset current item form
//       setCurrentItem({
//         selectedCategory: "",
//         selectedEquipmentType: "",
//         selectedTool: null,
//         cost: ""
//       });
//       setFilteredGroupedTools([]);
      
//       // Refresh grouped tools to update stock counts
//       if (currentItem.selectedCategory) {
//         const params = new URLSearchParams({
//           category: currentItem.selectedCategory
//         });
//         if (currentItem.selectedCategory === "Receiver" && currentItem.selectedEquipmentType) {
//           params.append('equipment_type', currentItem.selectedEquipmentType);
//         }
//         const response = await axios.get(
//           `${API_URL}/tools/grouped/?${params}`,
//           axiosConfig
//         );
//         setGroupedTools(response.data);
//       }
//     } catch (error: any) {
//       alert(error.message || "Failed to assign equipment set from inventory.");
//       console.error("Error adding item to sale:", error);
//     }
//   };

//   const removeItemFromSale = (index: number) => {
//     setSaleItems(prev => prev.filter((_, i) => i !== index));
//   };

//   const resetForm = () => {
//     setSaleItems([]);
//     setCurrentItem({
//       selectedCategory: "",
//       selectedEquipmentType: "",
//       selectedTool: null,
//       cost: ""
//     });
//     setSaleDetails({
//       payment_plan: "",
//       initial_deposit: "",
//       payment_months: "",
//       expiry_date: "",
//     });
//     setSelectedCustomer(null);
//     setOpen(false);
//     setIsSubmitting(false);
//     setShowEquipmentTypeModal(false);
//     setAssignmentResult(null);
//   };

//   // View serial numbers for a tool
//   const viewSerialNumbers = async (tool: Tool) => {
//     try {
//       const response = await axios.get(`${API_URL}/tools/${tool.id}/sold-serials/`, axiosConfig);
//       setViewingSerials({
//         open: true,
//         tool,
//         soldSerials: response.data
//       });
//     } catch (error) {
//       console.error("Error fetching sold serials:", error);
//       alert("Failed to load serial number history");
//     }
//   };

//   const sendEmail = async (email: string, name: string, items: SaleItem[], total: number, invoiceNumber?: string) => {
//     try {
//       const itemList = items.map(item => 
//         `• ${item.equipment} - ₦${parseFloat(item.cost).toLocaleString()}`
//       ).join('\n');
      
//       await axios.post(`${API_URL}/send-sale-email/`, {
//         to_email: email,
//         subject: `Your Invoice ${invoiceNumber ? `- ${invoiceNumber}` : ''}`,
//         message: `Hello ${name},\n\nThank you for your purchase! Here's your invoice:\n\n${itemList}\n\nTotal: ₦${total.toLocaleString()}\n\nPayment link: [Paystack Link Here]\n\nBest regards,\nOTIC Surveys`,
//       });
//     } catch (error) {
//       console.error("Error sending email:", error);
//     }
//   };

//   const handleAction = async (action: "cancel" | "draft" | "send") => {
//     if (action === "cancel") return resetForm();

//     if (!selectedCustomer) {
//         alert("Please select a customer first.");
//         return;
//     }

//     if (saleItems.length === 0) {
//         alert("Please add at least one item to the sale.");
//         return;
//     }

//     if (action === "draft" || action === "send") {
//         setIsSubmitting(true);
//         try {
//             // Get both invoice numbers from the first item
//             const invoiceNumber = saleItems[0]?.invoice_number || "";
//             const importInvoice = saleItems[0]?.import_invoice || "";

//             // Create a pure date string without any datetime components
//             const today = new Date();
//             const year = today.getFullYear();
//             const month = String(today.getMonth() + 1).padStart(2, '0');
//             const day = String(today.getDate()).padStart(2, '0');
//             const dateSold = `${year}-${month}-${day}`;

//             // Clean up data before submission - clear installment fields if payment plan is "No"
//             const payload = {
//                 name: selectedCustomer.name,
//                 phone: selectedCustomer.phone,
//                 state: selectedCustomer.state,
//                 items: saleItems,
//                 total_cost: totalCost.toString(),
//                 payment_plan: saleDetails.payment_plan || "",
//                 // Clear installment fields if not using installment plan
//                 initial_deposit: saleDetails.payment_plan === "No" ? null : (saleDetails.initial_deposit || null),
//                 payment_months: saleDetails.payment_plan === "No" ? null : (saleDetails.payment_months || null),
//                 expiry_date: saleDetails.expiry_date || null,
//                 invoice_number: invoiceNumber,
//                 import_invoice: importInvoice,
//                 date_sold: dateSold,
//             };

//             console.log("Sending payload:", payload);

//             const res = await axios.post(`${API_URL}/sales/`, payload, axiosConfig);
//             setSales((prev) => [res.data, ...prev]);

//             if (action === "send" && selectedCustomer?.email) {
//                 await sendEmail(
//                     selectedCustomer.email, 
//                     selectedCustomer.name, 
//                     saleItems, 
//                     totalCost,
//                     res.data.invoice_number
//                 );
//             }

//             resetForm();
//         } catch (error) {
//             if (axios.isAxiosError(error)) {
//                 console.error("Error adding sale:", error);
//                 console.error("Error response:", error.response?.data);
//                 alert(error.response?.data?.message || "Failed to save sale. Please check all fields.");
//             } else if (error instanceof Error) {
//                 console.error("Unexpected error:", error.message);
//                 alert("Unexpected error occurred.");
//             } else {
//                 console.error("Unknown error:", error);
//             }
//         } finally {
//             setIsSubmitting(false);
//         }
//     }
// };
//   // Edit status functions
//   const openEditStatus = (sale: Sale) => {
//     setEditingSale(sale);
//     setNewPaymentStatus(sale.payment_status || "pending");
//     setEditStatusOpen(true);
//   };

//   const closeEditStatus = () => {
//     setEditingSale(null);
//     setNewPaymentStatus("");
//     setEditStatusOpen(false);
//   };

//   const updatePaymentStatus = async () => {
//     if (!editingSale || !newPaymentStatus) return;

//     setIsUpdatingStatus(true);
//     try {
//       const payload = {
//         payment_status: newPaymentStatus
//       };

//       await axios.patch(`${API_URL}/sales/${editingSale.id}/`, payload, axiosConfig);
      
//       setSales(prev => prev.map(sale => 
//         sale.id === editingSale.id ? { ...sale, payment_status: newPaymentStatus } : sale
//       ));

//       closeEditStatus();
//     } catch (error) {
//       console.error("Error updating payment status:", error);
//       alert("Failed to update payment status. Please try again.");
//     } finally {
//       setIsUpdatingStatus(false);
//     }
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.text("My Sales Records", 14, 15);
//     autoTable(doc, {
//       startY: 25,
//       head: [
//         [
//           "Client",
//           "Phone", 
//           "State",
//           "Items",
//           "Serial Numbers",
//           "Price",
//           "Date Sold",
//           "Sales Invoice",
//           "Import Invoice",
//           "Payment Plan",
//           "Initial Deposit",
//           "Payment Months",
//           "Expiry",
//           "Status",
//         ],
//       ],
//       body: sales.map((s) => [
//         s.name,
//         s.phone,
//         s.state,
//         s.items.map(item => item.equipment).join(', '),
//         s.items.map(item => 
//           item.serial_set ? 
//             `Receiver: ${item.serial_set.join(', ')}${item.datalogger_serial ? `, Datalogger: ${item.datalogger_serial}` : ''}` 
//             : 'No serials'
//         ).join('; '),
//         `₦${s.total_cost}`,
//         s.date_sold,
//         s.invoice_number || "-",
//         s.import_invoice || "-",
//         s.payment_plan || "-",
//         s.initial_deposit ? `₦${s.initial_deposit}` : "-", 
//         s.payment_months || "-",        
//         s.expiry_date || "-",
//         s.payment_status || "-",
//       ]),
//       styles: { fontSize: 7 },
//     });
//     doc.save("my_sales_records.pdf");
//   };

//   return (
//     <DashboardLayout>
//       <div className="p-6 space-y-6">
//         {/* Customer Search Section */}
//         <Card className="bg-slate-900 border-slate-700">
//           <CardHeader>
//             <CardTitle className="text-white">
//               Find Customer for New Sale
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="relative">
//               <div className="flex gap-2">
//                 <div className="flex-1 relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <Input
//                     type="text"
//                     placeholder="Search customers by name, phone, email, or state..."
//                     value={searchQuery}
//                     onChange={(e) => handleSearch(e.target.value)}
//                     className="pl-10 pr-10 text-white bg-slate-800 border-slate-600 focus:border-blue-500 placeholder-gray-400"
//                   />
//                   {searchQuery && (
//                     <button
//                       onClick={clearSearch}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//                 <Button
//                   onClick={() => setOpen(true)}
//                   className="bg-green-600 hover:bg-green-700 text-white"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Sale Manually
//                 </Button>
//               </div>

//               {showSearchResults && searchResults.length > 0 && (
//                 <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-md shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
//                   {searchResults.map((customer) => (
//                     <div
//                       key={customer.id}
//                       className="p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-600 last:border-b-0 transition-colors"
//                       onClick={() => handleSelectCustomer(customer)}
//                     >
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <p className="font-medium text-white">{customer.name}</p>
//                           <p className="text-sm text-gray-300">{customer.phone}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-sm text-gray-300">{customer.email}</p>
//                           <p className="text-sm text-gray-300">{customer.state}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {showSearchResults && searchQuery && searchResults.length === 0 && (
//                 <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-md shadow-lg z-10 mt-1 p-4">
//                   <p className="text-gray-300 text-center">No customers found matching your search.</p>
//                 </div>
//               )}
//             </div>

//             {selectedCustomer && (
//               <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded-md">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h3 className="font-semibold text-blue-300">Selected Customer</h3>
//                     <p className="text-sm text-gray-300">
//                       {selectedCustomer.name} • {selectedCustomer.phone} • {selectedCustomer.email} • {selectedCustomer.state}
//                     </p>
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => {
//                       setSelectedCustomer(null);
//                       resetForm();
//                     }}
//                     className="text-red-400 border-red-600 hover:bg-red-900/30 hover:text-red-300"
//                   >
//                     <X className="w-3 h-3 mr-1" />
//                     Clear
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <div className="flex justify-end gap-3">
//           <Button
//             className="bg-blue-600 hover:bg-blue-700 text-white"
//             onClick={exportPDF}
//           >
//             <FileText className="w-4 h-4 mr-2" />
//             Export PDF
//           </Button>
//         </div>
          
//         {/* Equipment Type Selection Modal */}
//         <Dialog open={showEquipmentTypeModal} onOpenChange={setShowEquipmentTypeModal}>
//           <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
//             <DialogHeader>
//               <DialogTitle className="text-white">Select Equipment Type</DialogTitle>
//               <DialogDescription className="text-gray-300">
//                 Choose the type of Receiver equipment you want to sell
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-3 py-4">
//               {RECEIVER_EQUIPMENT_TYPES.map((type) => (
//                 <Card
//                   key={type}
//                   className={`p-4 cursor-pointer hover:scale-105 transform transition-all ${
//                     currentItem.selectedEquipmentType === type 
//                       ? "ring-2 ring-blue-500 bg-blue-900/20" 
//                       : "bg-slate-800 hover:bg-slate-700"
//                   }`}
//                   onClick={() => handleEquipmentTypeSelect(type)}
//                 >
//                   <CardContent className="p-0">
//                     <div className="text-lg font-semibold text-center">{type}</div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setShowEquipmentTypeModal(false);
//                   setCurrentItem(prev => ({ ...prev, selectedCategory: "" }));
//                 }}
//                 className="text-gray-300 border-slate-600 hover:bg-slate-700"
//               >
//                 Cancel
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Assignment Confirmation Modal with Both Invoice Numbers */}
//         <Dialog open={!!assignmentResult} onOpenChange={(open) => !open && setAssignmentResult(null)}>
//           <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
//             <DialogHeader>
//               <DialogTitle className="text-white flex items-center gap-2">
//                 <Barcode className="w-5 h-5 text-green-400" />
//                 Equipment Set Assigned Successfully!
//               </DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4 py-3">
//               {assignmentResult && (
//                 <div className="bg-green-900/20 p-4 rounded-md border border-green-700">
//                   <div className="text-center">
//                     <div className="text-lg font-semibold text-green-300 mb-2">
//                       {assignmentResult.toolName}
//                     </div>
//                     <div className="text-sm text-gray-300 mb-3">
//                       {assignmentResult.setType} • {assignmentResult.serialCount} serials
//                     </div>
                    
//                     {/* Sales Invoice Number */}
//                     {assignmentResult.invoiceNumber && (
//                       <div className="mb-3 p-2 bg-green-900/30 rounded border border-green-700">
//                         <div className="font-medium text-green-300">Sales Invoice:</div>
//                         <div className="text-white font-mono">{assignmentResult.invoiceNumber}</div>
//                       </div>
//                     )}
                    
//                     {/* Import Invoice Number */}
//                     {assignmentResult.importInvoice && (
//                       <div className="mb-3 p-2 bg-blue-900/30 rounded border border-blue-700">
//                         <div className="font-medium text-blue-300">Import Invoice:</div>
//                         <div className="text-white font-mono">{assignmentResult.importInvoice}</div>
//                       </div>
//                     )}
                    
//                     {/* Receiver Serial Numbers */}
//                     <div className="space-y-2 text-sm mb-3">
//                       <div className="font-medium text-blue-300">Receiver Serials:</div>
//                       {assignmentResult.serialSet.map((serial, index) => (
//                         <div key={index} className="flex justify-between">
//                           <span className="text-gray-300">
//                             {assignmentResult.setType === "Base & Rover Combo" 
//                               ? `Receiver ${index + 1}:` 
//                               : 'Receiver:'}
//                           </span>
//                           <span className="text-white font-mono">{serial}</span>
//                         </div>
//                       ))}
//                     </div>
                    
//                     {/* Datalogger Serial Number */}
//                     {assignmentResult.dataloggerSerial && (
//                       <div className="space-y-2 text-sm border-t border-green-600 pt-3">
//                         <div className="font-medium text-blue-300">Datalogger Serial:</div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-300">Datalogger:</span>
//                           <span className="text-white font-mono">{assignmentResult.dataloggerSerial}</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//               <p className="text-gray-300 text-sm text-center">
//                 Complete equipment set has been assigned from inventory.
//               </p>
//             </div>
//             <DialogFooter>
//               <Button
//                 onClick={() => setAssignmentResult(null)}
//                 className="bg-green-600 hover:bg-green-700 text-white"
//               >
//                 Continue
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Updated Sale Dialog */}
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle className="text-white">Add New Sale</DialogTitle>
//             </DialogHeader>

//             {selectedCustomer ? (
//               <div className="bg-blue-900/20 p-4 rounded-md mb-4 border border-blue-700">
//                 <h3 className="font-semibold text-blue-300 mb-2">Customer Information</h3>
//                 <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
//                   <div>
//                     <span className="font-medium text-blue-300">Name:</span> {selectedCustomer.name}
//                   </div>
//                   <div>
//                     <span className="font-medium text-blue-300">Email:</span> {selectedCustomer.email}
//                   </div>
//                   <div>
//                     <span className="font-medium text-blue-300">Phone:</span> {selectedCustomer.phone}
//                   </div>
//                   <div>
//                     <span className="font-medium text-blue-300">State:</span> {selectedCustomer.state}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-yellow-900/20 p-4 rounded-md mb-4 border border-yellow-700">
//                 <h3 className="font-semibold text-yellow-300 mb-2">No Customer Selected</h3>
//                 <p className="text-sm text-yellow-300">
//                   Please search and select a customer above.
//                 </p>
//               </div>
//             )}

//             <div className="space-y-6 py-3">
//               {/* Current Item Selection */}
//               <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-slate-800 rounded-lg border border-slate-700">
//                 <div className="md:col-span-4">
//                   <Label className="text-white">Equipment Category</Label>
//                   <Select
//                     value={currentItem.selectedCategory}
//                     onValueChange={handleCategorySelect}
//                   >
//                     <SelectTrigger className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
//                       <SelectValue placeholder="Select Category" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-slate-800 text-white border-slate-600">
//                       {TOOL_CATEGORIES.map((category) => (
//                         <SelectItem key={category} value={category} className="hover:bg-slate-700">
//                           {category}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
                  
//                   {currentItem.selectedCategory === "Receiver" && currentItem.selectedEquipmentType && (
//                     <div className="mt-2 p-2 bg-blue-900/30 rounded border border-blue-700">
//                       <p className="text-sm text-blue-300">
//                         Type: <span className="font-semibold">{currentItem.selectedEquipmentType}</span>
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="md:col-span-4">
//                   <Label className="text-white">Select Equipment</Label>
//                   <Select
//                     value={currentItem.selectedTool?.name || ""}
//                     onValueChange={handleToolSelect}
//                     disabled={!currentItem.selectedCategory || (currentItem.selectedCategory === "Receiver" && !currentItem.selectedEquipmentType)}
//                   >
//                     <SelectTrigger className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
//                       <SelectValue 
//                         placeholder={
//                           currentItem.selectedCategory === "Receiver" && !currentItem.selectedEquipmentType
//                             ? "Select equipment type first"
//                             : currentItem.selectedCategory
//                             ? `Select ${currentItem.selectedCategory}`
//                             : "Select category first"
//                         } 
//                       />
//                     </SelectTrigger>
//                     <SelectContent className="bg-slate-800 text-white border-slate-600">
//                       {filteredGroupedTools.map((tool) => (
//                         <SelectItem key={tool.group_id} value={tool.name} className="hover:bg-slate-700">
//                           <div className="flex justify-between items-center w-full">
//                             <span>{tool.name}</span>
//                             <span className="text-xs text-gray-400 ml-2">
//                               Stock: {tool.total_stock}
//                             </span>
//                           </div>
//                         </SelectItem>
//                       ))}
//                       {filteredGroupedTools.length === 0 && currentItem.selectedCategory && (
//                         <SelectItem value="no-tools" disabled>
//                           No equipment found for selected criteria
//                         </SelectItem>
//                       )}
//                     </SelectContent>
//                   </Select>
//                   {currentItem.selectedTool && (
//                     <div className="mt-1 space-y-1">
//                       <p className="text-xs text-gray-400">
//                         {currentItem.selectedTool.total_stock} complete sets available
//                       </p>
//                       {/* Show import invoice when tool is selected */}
//                       {currentItem.selectedTool.invoice_number && (
//                         <p className="text-xs text-blue-400">
//                           Import Invoice: {currentItem.selectedTool.invoice_number}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 <div className="md:col-span-3">
//                   <Label className="text-white">Selling Price (₦)</Label>
//                   <Input
//                     type="number"
//                     value={currentItem.cost}
//                     onChange={(e) => setCurrentItem(prev => ({ ...prev, cost: e.target.value }))}
//                     className="bg-slate-700 text-white border-slate-600 placeholder-gray-400"
//                     placeholder="Enter Selling Price"
//                     disabled={!currentItem.selectedTool}
//                   />
//                 </div>

//                 <div className="md:col-span-1">
//                   <Button
//                     onClick={addItemToSale}
//                     disabled={!currentItem.selectedTool || !currentItem.cost}
//                     className="w-full bg-green-600 hover:bg-green-700 text-white"
//                   >
//                     <Plus className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Sale Items Summary with Both Invoice Numbers */}
//               {saleItems.length > 0 && (
//                 <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
//                   <div className="flex justify-between items-center mb-3">
//                     <h3 className="text-white font-semibold">Items in this Sale ({saleItems.length})</h3>
//                     <div className="text-right">
//                       <div className="text-lg font-bold text-green-400">
//                         Total: ₦{totalCost.toLocaleString()}
//                       </div>
//                       {/* Show both invoice numbers from first item */}
//                       {saleItems[0]?.invoice_number && (
//                         <div className="text-sm text-green-300 mt-1 bg-green-900/30 px-2 py-1 rounded border border-green-700">
//                           <span className="font-medium">Sales Invoice:</span> {saleItems[0].invoice_number}
//                         </div>
//                       )}
//                       {saleItems[0]?.import_invoice && (
//                         <div className="text-sm text-blue-300 mt-1 bg-blue-900/30 px-2 py-1 rounded border border-blue-700">
//                           <span className="font-medium">Import Invoice:</span> {saleItems[0].import_invoice}
//                         </div>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="space-y-2 max-h-60 overflow-y-auto">
//                     {saleItems.map((item, index) => (
//                       <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded border border-slate-600">
//                         <div className="flex-1">
//                           <div className="text-white font-medium">{item.equipment}</div>
//                           <div className="text-sm text-gray-300">
//                             {item.category}
//                             {item.serial_set && (
//                               <div className="mt-1">
//                                 <div className="text-blue-400">
//                                   Receiver Serials: {item.serial_set.join(', ')}
//                                 </div>
//                                 {item.datalogger_serial && (
//                                   <div className="text-green-400">
//                                     Datalogger Serial: {item.datalogger_serial}
//                                   </div>
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <div className="text-lg font-bold text-white">
//                             ₦{parseFloat(item.cost).toLocaleString()}
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => removeItemFromSale(index)}
//                             className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Sale Details */}
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label className="text-white">Payment Plan</Label>
//                     <Select
//                       value={saleDetails.payment_plan}
//                       onValueChange={(value) => setSaleDetails(prev => ({ 
//                         ...prev, 
//                         payment_plan: value,
//                         // Reset deposit and months when switching to "No"
//                         initial_deposit: value === "No" ? "" : prev.initial_deposit,
//                         payment_months: value === "No" ? "" : prev.payment_months
//                       }))}
//                     >
//                       <SelectTrigger className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
//                         <SelectValue placeholder="Select Payment Plan" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-slate-800 text-white border-slate-600">
//                         <SelectItem value="No" className="hover:bg-slate-700">
//                           No (Full Payment)
//                         </SelectItem>
//                         <SelectItem value="Yes" className="hover:bg-slate-700">
//                           Yes (Installment Plan)
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label className="text-white">Expiry Date</Label>
//                     <Input
//                       type="date"
//                       value={saleDetails.expiry_date}
//                       onChange={(e) => setSaleDetails(prev => ({ ...prev, expiry_date: e.target.value }))}
//                       className="bg-slate-700 text-white border-slate-600"
//                     />
//                   </div>
//                 </div>

//                 {/* Conditional fields for installment plan */}
//                 {saleDetails.payment_plan === "Yes" && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-900/20 rounded-lg border border-blue-700">
//                     <div>
//                       <Label className="text-white">Initial Deposit (₦)</Label>
//                       <Input
//                         type="number"
//                         value={saleDetails.initial_deposit}
//                         onChange={(e) => setSaleDetails(prev => ({ ...prev, initial_deposit: e.target.value }))}
//                         className="bg-slate-700 text-white border-slate-600 placeholder-gray-400"
//                         placeholder="Enter deposit amount"
//                       />
//                       {saleDetails.initial_deposit && (
//                         <p className="text-xs text-gray-400 mt-1">
//                           Remaining: ₦{(totalCost - parseFloat(saleDetails.initial_deposit || "0")).toLocaleString()}
//                         </p>
//                       )}
//                     </div>
//                     <div>
//                       <Label className="text-white">Payment Months</Label>
//                       <Select
//                         value={saleDetails.payment_months}
//                         onValueChange={(value) => setSaleDetails(prev => ({ ...prev, payment_months: value }))}
//                       >
//                         <SelectTrigger className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
//                           <SelectValue placeholder="Select months" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-slate-800 text-white border-slate-600">
//                           {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
//                             <SelectItem key={month} value={month.toString()} className="hover:bg-slate-700">
//                               {month} {month === 1 ? 'month' : 'months'}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       {saleDetails.initial_deposit && saleDetails.payment_months && (
//                         <p className="text-xs text-gray-400 mt-1">
//                           Monthly: ₦{((totalCost - parseFloat(saleDetails.initial_deposit)) / parseInt(saleDetails.payment_months || "1")).toLocaleString()}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <DialogFooter className="gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => handleAction("cancel")}
//                 disabled={isSubmitting}
//                 className="text-gray-300 border-slate-600 hover:bg-slate-700 hover:text-white"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="secondary"
//                 onClick={() => handleAction("draft")}
//                 disabled={isSubmitting || saleItems.length === 0}
//                 className="bg-gray-600 hover:bg-gray-700 text-white"
//               >
//                 {isSubmitting ? "Saving..." : "Save to Draft"}
//               </Button>
//               <Button
//                 onClick={() => handleAction("send")}
//                 disabled={isSubmitting || saleItems.length === 0}
//                 className="bg-blue-600 hover:bg-blue-700 text-white"
//               >
//                 {isSubmitting ? "Saving..." : "Save & Send Bill"}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Edit Status Dialog */}
//         <Dialog open={editStatusOpen} onOpenChange={setEditStatusOpen}>
//           <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
//             <DialogHeader>
//               <DialogTitle className="text-white">Edit Payment Status</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4 py-3">
//               {editingSale && (
//                 <div className="bg-blue-900/20 p-3 rounded-md border border-blue-700">
//                   <h4 className="font-semibold text-blue-300 mb-2">Sale Information</h4>
//                   <p className="text-sm text-gray-300">
//                     <strong className="text-blue-300">Customer:</strong> {editingSale.name}
//                   </p>
//                   <p className="text-sm text-gray-300">
//                     <strong className="text-blue-300">Sales Invoice:</strong> {editingSale.invoice_number || "N/A"}
//                   </p>
//                   <p className="text-sm text-gray-300">
//                     <strong className="text-blue-300">Import Invoice:</strong> {editingSale.import_invoice || "N/A"}
//                   </p>
//                   <p className="text-sm text-gray-300">
//                     <strong className="text-blue-300">Total:</strong> ₦{parseFloat(editingSale.total_cost).toLocaleString()}
//                   </p>
//                 </div>
//               )}
              
//               <div>
//                 <Label className="text-white">Payment Status</Label>
//                 <Select
//                   value={newPaymentStatus}
//                   onValueChange={setNewPaymentStatus}
//                 >
//                   <SelectTrigger className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
//                     <SelectValue placeholder="Select Status" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-slate-800 text-white border-slate-600">
//                     {PAYMENT_STATUSES.map((status) => (
//                       <SelectItem key={status} value={status} className="hover:bg-slate-700">
//                         {status.charAt(0).toUpperCase() + status.slice(1)}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <DialogFooter className="gap-2">
//               <Button
//                 variant="outline"
//                 onClick={closeEditStatus}
//                 disabled={isUpdatingStatus}
//                 className="text-gray-300 border-slate-600 hover:bg-slate-700 hover:text-white"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={updatePaymentStatus}
//                 disabled={isUpdatingStatus || !newPaymentStatus}
//                 className="bg-blue-600 hover:bg-blue-700 text-white"
//               >
//                 {isUpdatingStatus ? "Updating..." : "Update Status"}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* View Serial Numbers Dialog */}
//         <Dialog open={viewingSerials.open} onOpenChange={(open) => setViewingSerials(prev => ({ ...prev, open }))}>
//           <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white">
//             <DialogHeader>
//               <DialogTitle className="text-white flex items-center gap-2">
//                 <Barcode className="w-5 h-5" />
//                 Serial Number History - {viewingSerials.tool?.name}
//               </DialogTitle>
//               <DialogDescription className="text-gray-300">
//                 Track which serial numbers have been sold and to whom
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4 py-3">
//               {viewingSerials.soldSerials.length > 0 ? (
//                 <div className="space-y-3 max-h-96 overflow-y-auto">
//                   {viewingSerials.soldSerials.map((serialInfo, index) => (
//                     <Card key={index} className="bg-slate-800 border-slate-600">
//                       <CardContent className="p-4">
//                         <div className="grid grid-cols-2 gap-4 text-sm">
//                           <div>
//                             <span className="text-blue-300 font-medium">Serial:</span>
//                             <p className="text-white font-mono">{serialInfo.serial}</p>
//                           </div>
//                           <div>
//                             <span className="text-blue-300 font-medium">Customer:</span>
//                             <p className="text-white">{serialInfo.customer_name}</p>
//                           </div>
//                           <div>
//                             <span className="text-blue-300 font-medium">Sale Date:</span>
//                             <p className="text-white">{new Date(serialInfo.date_sold).toLocaleDateString()}</p>
//                           </div>
//                           <div>
//                             <span className="text-blue-300 font-medium">Invoice:</span>
//                             <p className="text-white">{serialInfo.invoice_number || "N/A"}</p>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 text-gray-400">
//                   <Barcode className="w-12 h-12 mx-auto mb-3 opacity-50" />
//                   <p>No serial numbers have been sold for this tool yet.</p>
//                 </div>
//               )}
//             </div>
//             <DialogFooter>
//               <Button
//                 onClick={() => setViewingSerials({ open: false, tool: null, soldSerials: [] })}
//                 className="bg-slate-700 hover:bg-slate-600 text-white"
//               >
//                 Close
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Sales Table with Both Invoice Columns */}
//         <Card className="bg-slate-900 border-slate-700">
//           <CardHeader>
//             <CardTitle className="text-white">Sales Overview</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {loading ? (
//               <p className="text-gray-400 text-center py-4">Loading...</p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm border-collapse">
//                   <thead>
//                     <tr className="text-left border-b border-slate-700 bg-slate-800">
//                       {[
//                         "Client",
//                         "Phone",
//                         "State", 
//                         "Items",
//                         "Serial Numbers",
//                         "Total Cost",
//                         "Date Sold",
//                         "Sales Invoice",
//                         "Import Invoice",
//                         "Payment Plan",
//                         "Initial Deposit",
//                         "Payment Months", 
//                         "Expiry",
//                         "Status",
//                         "Actions",
//                       ].map((col) => (
//                         <th key={col} className="p-3 text-white font-medium">
//                           {col}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {sales.length === 0 ? (
//                       <tr>
//                         <td colSpan={15} className="text-center p-4 text-gray-400">
//                           No records yet. Add a sale to begin.
//                         </td>
//                       </tr>
//                     ) : (
//                       sales.map((sale) => (
//                         <tr 
//                           key={sale.id} 
//                           className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors text-gray-300"
//                         >
//                           <td className="p-3 text-white">{sale.name}</td>
//                           <td className="p-3">{sale.phone}</td>
//                           <td className="p-3">{sale.state}</td>
//                           <td className="p-3">
//                             <div className="max-w-xs">
//                               {sale.items?.map((item, index) => (
//                                 <div key={index} className="text-xs mb-1 text-gray-300">
//                                   • {item.equipment}
//                                 </div>
//                               )) || "No items"}
//                             </div>
//                           </td>
//                           {/* Serial Numbers Column */}
//                           <td className="p-3">
//                             <div className="max-w-xs">
//                               {sale.items?.map((item, index) => {
//                                 // Method 1: Check if we have serial_set from the sale item (PREFERRED)
//                                 if (item.serial_set && item.serial_set.length > 0) {
//                                   const isBaseRoverCombo = item.category === "Receiver" && 
//                                                           (item.equipment.toLowerCase().includes("base and rover") || 
//                                                             item.serial_set.length > 1);
                                  
//                                   return (
//                                     <div key={index} className="text-xs mb-2">
//                                       <div className="text-blue-300 font-medium">{item.equipment}:</div>
//                                       <div className="ml-2 space-y-1">
//                                         {/* Display ONLY first 2 receiver serials for Base & Rover */}
//                                         {(item.serial_set || []).slice(0, isBaseRoverCombo ? 2 : item.serial_set.length).map((serial, serialIndex) => (
//                                           <div key={serialIndex} className="text-gray-300">
//                                             <span className="text-blue-400">
//                                               {isBaseRoverCombo ? `Receiver ${serialIndex + 1}:` : 'Receiver:'}
//                                             </span> {serial}
//                                           </div>
//                                         ))}
                                        
//                                         {/* Display datalogger serial if available */}
//                                         {item.datalogger_serial && (
//                                           <div className="text-gray-300">
//                                             <span className="text-green-400">Data Logger:</span> {item.datalogger_serial}
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   );
//                                 }
                                
//                                 // Method 2: Check if we have the actual tool with serials data
//                                 const soldTool = tools.find(t => t.id === item.tool_id);
//                                 if (soldTool && soldTool.serials && isSerialNumbersObject(soldTool.serials)) {
//                                   const toolDescription = soldTool.description || soldTool.box_type || "";
//                                   const isBaseAndRover = toolDescription.toLowerCase().includes("base and rover");
                                  
//                                   return (
//                                     <div key={index} className="text-xs mb-2">
//                                       <div className="text-blue-300 font-medium">{item.equipment}:</div>
//                                       <div className="ml-2 space-y-1">
//                                         {/* Base and Rover Box Type - 4 serials */}
//                                         {isBaseAndRover && (
//                                           <>
//                                             {getSerialValue(soldTool.serials, 'receiver1') && (
//                                               <div className="text-gray-300">
//                                                 <span className="text-blue-400">Receiver 1:</span> {getSerialValue(soldTool.serials, 'receiver1')}
//                                               </div>
//                                             )}
//                                             {getSerialValue(soldTool.serials, 'receiver2') && (
//                                               <div className="text-gray-300">
//                                                 <span className="text-blue-400">Receiver 2:</span> {getSerialValue(soldTool.serials, 'receiver2')}
//                                               </div>
//                                             )}
//                                             {/*{getSerialValue(soldTool.serials, 'data_logger') && (
//                                               <div className="text-gray-300">
//                                                 <span className="text-green-400">Data Logger:</span> {getSerialValue(soldTool.serials, 'data_logger')}
//                                               </div>
//                                             )}
//                                             {getSerialValue(soldTool.serials, 'external_radio') && (
//                                               <div className="text-gray-300">
//                                                 <span className="text-purple-400">External Radio:</span> {getSerialValue(soldTool.serials, 'external_radio')}
//                                               </div>
//                                             )}*/}
//                                           </>
//                                         )}
                                        
//                                         {/* Base or Rover Box Type - 2 serials */}
//                                         {(toolDescription.toLowerCase().includes("base") || 
//                                           toolDescription.toLowerCase().includes("rover")) && 
//                                           !isBaseAndRover && (
//                                           <>
//                                             {getSerialValue(soldTool.serials, 'receiver') && (
//                                               <div className="text-gray-300">
//                                                 <span className="text-blue-400">Receiver:</span> {getSerialValue(soldTool.serials, 'receiver')}
//                                               </div>
//                                             )}
//                                             {getSerialValue(soldTool.serials, 'data_logger') && (
//                                               <div className="text-gray-300">
//                                                 <span className="text-green-400">Data Logger:</span> {getSerialValue(soldTool.serials, 'data_logger')}
//                                               </div>
//                                             )}
//                                           </>
//                                         )}
                                        
//                                         {/* Default display for other types */}
//                                         {!toolDescription.toLowerCase().includes("base") && 
//                                          !toolDescription.toLowerCase().includes("rover") && (
//                                           <>
//                                             {getSerialValue(soldTool.serials, 'receiver') && (
//                                               <div className="text-gray-300">
//                                                 <span className="text-blue-400">Receiver:</span> {getSerialValue(soldTool.serials, 'receiver')}
//                                               </div>
//                                             )}
//                                             {getSerialValue(soldTool.serials, 'data_logger') && (
//                                               <div className="text-gray-300">
//                                                 <span className="text-green-400">Data Logger:</span> {getSerialValue(soldTool.serials, 'data_logger')}
//                                               </div>
//                                             )}
//                                             {/*{getSerialValue(soldTool.serials, 'external_radio') && (
//                                               <div className="text-gray-300">
//                                                 <span className="text-purple-400">External Radio:</span> {getSerialValue(soldTool.serials, 'external_radio')}
//                                               </div>
//                                             )}*/}
//                                           </>
//                                         )}
//                                       </div>
//                                     </div>
//                                   );
//                                 }
                                
//                                 // No serial data available
//                                 return (
//                                   <div key={index} className="text-xs mb-2">
//                                     <div className="text-blue-300 font-medium">{item.equipment}:</div>
//                                     <div className="ml-2 text-gray-500 italic">
//                                       No serials recorded
//                                     </div>
//                                   </div>
//                                 );
//                               })}
//                             </div>
//                           </td>
//                           <td className="p-3 font-semibold text-white">₦{parseFloat(sale.total_cost).toLocaleString()}</td>
//                           <td className="p-3">
//                             {sale.date_sold ? sale.date_sold.split('T')[0] : "-"}
//                           </td>
//                           {/* Sales Invoice Column */}
//                           <td className="p-3 text-green-300">{sale.invoice_number || "-"}</td>

//                           {/* Import Invoice Column - Direct from sale data */}
//                           <td className="p-3 text-yellow-300">
//                             {sale.import_invoice || "-"}
//                           </td>
//                           <td className="p-3">{sale.payment_plan || "-"}</td>
//                           <td className="p-3">
//                             {sale.initial_deposit ? `₦${parseFloat(sale.initial_deposit).toLocaleString()}` : "-"}
//                           </td>

//                           <td className="p-3">{sale.payment_months || "-"}</td>
//                           <td className="p-3">{sale.expiry_date || "-"}</td>
//                           <td className="p-3">
//                             <span
//                               className={`px-3 py-1 rounded-full text-xs font-medium ${
//                                 sale.payment_status === "completed"
//                                   ? "bg-green-900/50 text-green-300 border border-green-700"
//                                   : sale.payment_status === "installment"
//                                   ? "bg-blue-900/50 text-blue-300 border border-blue-700"
//                                   : sale.payment_status === "failed"
//                                   ? "bg-red-900/50 text-red-300 border border-red-700"
//                                   : "bg-gray-900/50 text-gray-300 border border-gray-700"
//                               }`}
//                             >
//                               {sale.payment_status || "pending"}
//                             </span>
//                           </td>
//                           <td className="p-3">
//                             <div className="flex gap-1">
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => openEditStatus(sale)}
//                                 className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
//                                 title="Edit payment status"
//                               >
//                                 <Edit className="w-4 h-4" />
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => {
//                                   if (sale.items.length > 0) {
//                                     const tool = tools.find(t => t.id === sale.items[0].tool_id);
//                                     if (tool) {
//                                       viewSerialNumbers(tool);
//                                     }
//                                   }
//                                 }}
//                                 className="text-green-400 hover:text-green-300 hover:bg-green-900/30"
//                                 title="View serial numbers"
//                               >
//                                 <Eye className="w-4 h-4" />
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// }