import React, { useEffect, useMemo, useState } from "react";
import { getTools } from "../services/api";
import { Button } from "../components/ui/button";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent } from "../components/ui/card"; // ADDED: Missing imports
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --------------------
// INTERFACE
// --------------------
interface SerialNumbers {
  receiver?: string;
  receiver1?: string;
  receiver2?: string;
  data_logger?: string;
  external_radio?: string;
  [key: string]: any;
}

interface Tool {
  id: string;
  name: string;
  code: string; // Serial or main identifier
  stock: number;
  supplier?: string;
  supplier_name?: string;
  category?: string;
  invoice_no?: string;
  date_added?: string;
  updated_at?: string;
  description?: string;
  box_type?: string; // Base / Rover / Single Box
  expiry_date?: string; // Added expiry date
  serials?: string[] | SerialNumbers; // For Receivers only
  available_serials?: string[]; // NEW: Available serial numbers
  sold_serials?: any[]; // NEW: Sold serial numbers with sale info
}

// --------------------
// ACCESSORY TYPES
// --------------------
interface Accessory {
  name: string;
  quantity: number;
}

// FIXED: Updated SoldSerialInfo interface to allow null values
interface SoldSerialInfo {
  serial: string;
  sale_id?: number | null;
  customer_name: string;
  date_sold?: string | null;
  invoice_number?: string | null;
}

// --------------------
// HELPER FUNCTIONS
// --------------------
const isSerialObject = (serials: any): serials is SerialNumbers => {
  return serials && typeof serials === 'object' && !Array.isArray(serials);
};

const getSerialValue = (serials: any, key: string): string => {
  if (!serials) return '';
  if (isSerialObject(serials)) {
    return serials[key] || '';
  }
  return '';
};

// Format date for display
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch {
    return "—";
  }
};

// Check if date is expired
const isDateExpired = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;
  try {
    const date = new Date(dateString);
    return date < new Date();
  } catch {
    return false;
  }
};

// Check if date is expiring soon (within 30 days)
const isDateExpiringSoon = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;
  try {
    const date = new Date(dateString);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return date > now && date <= thirtyDaysFromNow;
  } catch {
    return false;
  }
};

// --------------------
// MAIN COMPONENT
// --------------------
const ToolsSummary: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<{invoiceNo: string, boxType: string} | null>(null);
  const [serialSearch, setSerialSearch] = useState("");

  // NEW: Serial number viewing state
  const [viewingSerials, setViewingSerials] = useState<{
    open: boolean;
    tool: Tool | null;
    soldSerials: SoldSerialInfo[];
  }>({
    open: false,
    tool: null,
    soldSerials: []
  });

  // --------------------
  // ACCESSORY DEFINITIONS
  // --------------------
  const getAccessoriesForBoxType = (boxType: string): Accessory[] => {
    if (!boxType) return [];
    
    const normalizedType = boxType.toLowerCase().trim();
    
    if (normalizedType.includes("base")) {
      // Base box type accessories
      return [
        { name: "Spindle and Tribrac", quantity: 1 },
        { name: "30cm Pole", quantity: 1 },
        { name: "Batteries", quantity: 2 },
        { name: "Data Logger", quantity: 1 },
        { name: "Receivers", quantity: 1 },
        { name: "Download Cable", quantity: 1 },
        { name: "Receiver Adapter", quantity: 1 },
        { name: "Pole Bracket", quantity: 1 },
        { name: "Charger", quantity: 1 },
        { name: "Whip Antenna", quantity: 1 },
        { name: "Flash Drive", quantity: 1 }
      ];
    } else if (normalizedType.includes("rover")) {
      // Rover box type accessories (without spindle & tribrac and 30cm pole)
      return [
        { name: "Batteries", quantity: 2 },
        { name: "Data Logger", quantity: 1 },
        { name: "Receivers", quantity: 1 },
        { name: "Download Cable", quantity: 1 },
        { name: "Receiver Adapter", quantity: 1 },
        { name: "Pole Bracket", quantity: 1 },
        { name: "Charger", quantity: 1 },
        { name: "Whip Antenna", quantity: 1 },
        { name: "Flash Drive", quantity: 1 }
      ];
    }
    
    return [];
  };

  // --------------------
  // LOAD TOOLS - FIXED DATA NORMALIZATION WITH EXPIRY DATE AND SERIAL TRACKING
  // --------------------
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getTools();
        if (!mounted) return;
        
        console.log('Raw tools data:', data); // Debug log
        
        const normalized: Tool[] = (data || []).map((t: any) => {
          // Handle serials data - check if it's array or object
          let serialsData: SerialNumbers = {};
          
          if (t.serials && Array.isArray(t.serials)) {
            // Convert array to object format based on box type
            const boxType = (t.box_type || t.description || "").toLowerCase();
            
            if (boxType.includes("base and rover")) {
              // Base and Rover: 4 serials
              serialsData = {
                receiver1: t.serials[0] || "",
                receiver2: t.serials[1] || "",
                data_logger: t.serials[2] || "",
                external_radio: t.serials[3] || ""
              };
            } else if (boxType.includes("base") || boxType.includes("rover")) {
              // Base or Rover: 2 serials
              serialsData = {
                receiver: t.serials[0] || "",
                data_logger: t.serials[1] || ""
              };
            } else {
              // Default: use first serial as receiver
              serialsData = {
                receiver: t.serials[0] || ""
              };
            }
          } else if (t.serials && typeof t.serials === 'object') {
            // Already in object format
            serialsData = t.serials;
          }
          
          // Handle expiry date - check multiple possible property names
          let expiryDate = "";
          if (t.expiry_date) {
            expiryDate = t.expiry_date;
          } else if (t.expiration_date) {
            expiryDate = t.expiration_date;
          } else if (t.warranty_expiry) {
            expiryDate = t.warranty_expiry;
          }
          
          // Handle available_serials and sold_serials
          let availableSerials: string[] = [];
          if (Array.isArray(t.available_serials)) {
            availableSerials = t.available_serials;
          } else if (!t.available_serials && t.serials) {
            // Initialize available_serials with serials if not set
            availableSerials = Array.isArray(t.serials) ? t.serials : Object.values(serialsData).filter(Boolean);
          }
          
          let soldSerials: any[] = [];
          if (Array.isArray(t.sold_serials)) {
            soldSerials = t.sold_serials;
          }
          
          // Debug expiry date
          if (expiryDate) {
            console.log('Found expiry date for tool:', t.name, expiryDate);
          }
          
          return {
            id: t.id,
            name: t.name,
            code: t.code || "",
            stock: Number(t.stock || 0),
            supplier: t.supplier || "",
            supplier_name: t.supplier_name || "",
            category: t.category || "Uncategorized",
            invoice_no: t.invoice_number || t.invoice_no || "",
            date_added: t.date_added,
            updated_at: t.updated_at,
            box_type: t.box_type || t.description || "",
            expiry_date: expiryDate, // Fixed expiry date mapping
            serials: serialsData,
            available_serials: availableSerials, // NEW
            sold_serials: soldSerials, // NEW
          };
        });

        console.log('Normalized tools with expiry dates and serial tracking:', normalized.map(t => ({
          name: t.name,
          expiry_date: t.expiry_date,
          hasExpiry: !!t.expiry_date,
          available_serials: t.available_serials?.length || 0,
          sold_serials: t.sold_serials?.length || 0
        }))); // Debug log
        
        setTools(normalized);
      } catch (err) {
        console.error("Failed to load tools:", err);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // NEW: View serial numbers for a tool
  const viewSerialNumbers = async (tool: Tool) => {
    try {
      const soldSerials: SoldSerialInfo[] = [];
      
      for (const serialInfo of tool.sold_serials || []) {
        if (typeof serialInfo === 'object') {
          // FIXED: Properly handle null values
          soldSerials.push({
            serial: serialInfo.serial || 'Unknown',
            sale_id: serialInfo.sale_id || null,
            customer_name: serialInfo.customer_name || 'Unknown',
            date_sold: serialInfo.date_sold || null,
            invoice_number: serialInfo.invoice_number || null
          });
        } else {
          // Handle case where serialInfo is just a string
          soldSerials.push({
            serial: serialInfo,
            sale_id: null,
            customer_name: 'Unknown',
            date_sold: null,
            invoice_number: null
          });
        }
      }
      
      setViewingSerials({
        open: true,
        tool,
        soldSerials
      });
    } catch (error) {
      console.error("Error fetching sold serials:", error);
      alert("Failed to load serial number history");
    }
  };

  // --------------------
  // LAST UPDATED
  // --------------------
  const lastUpdated = useMemo(() => {
    if (tools.length === 0) return null;
    const sorted = [...tools]
      .filter((t) => t.updated_at)
      .sort(
        (a, b) =>
          new Date(b.updated_at || "").getTime() -
          new Date(a.updated_at || "").getTime()
      );
    return sorted[0]?.updated_at || null;
  }, [tools]);

  // --------------------
  // CATEGORY LIST
  // --------------------
  const categories = useMemo(() => {
    const set = new Set<string>();
    tools.forEach((t) => set.add(t.category || "Uncategorized"));
    return ["all", ...Array.from(set).sort()];
  }, [tools]);

  // --------------------
  // GROUPED DATA
  // --------------------
  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = tools.filter((t) => {
      const categoryMatch =
        categoryFilter === "all" ||
        !categoryFilter ||
        (t.category || "Uncategorized").toLowerCase() ===
          categoryFilter.toLowerCase();
      const qMatch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        (t.supplier || "").toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q);
      const lowStockMatch = !lowStockOnly || t.stock < 5;
      return categoryMatch && qMatch && lowStockMatch;
    });

    const map = new Map<
      string,
      { name: string; totalStock: number; suppliers: string[]; serials: Tool[]; totalAvailableSerials: number; totalSoldSerials: number }[]
    >();

    for (const t of filtered) {
      const category = t.category || "Uncategorized";
      if (!map.has(category)) map.set(category, []);

      const toolGroup = map.get(category)!;
      const existing = toolGroup.find((x) => x.name === t.name);

      if (existing) {
        existing.totalStock += t.stock;
        if (t.supplier_name && !existing.suppliers.includes(t.supplier_name))
          existing.suppliers.push(t.supplier_name);
        existing.serials.push(t);
        existing.totalAvailableSerials += t.available_serials?.length || 0;
        existing.totalSoldSerials += t.sold_serials?.length || 0;
      } else {
        toolGroup.push({
          name: t.name,
          totalStock: t.stock,
          suppliers: t.supplier_name ? [t.supplier_name] : [],
          serials: [t],
          totalAvailableSerials: t.available_serials?.length || 0,
          totalSoldSerials: t.sold_serials?.length || 0,
        });
      }
    }

    return Array.from(map.entries()).map(([category, tools]) => ({
      category,
      tools,
    }));
  }, [tools, search, categoryFilter, lowStockOnly]);

  // --------------------
  // TOTAL STOCK AND SERIALS
  // --------------------
  const totalStock = useMemo(
    () =>
      grouped.reduce(
        (s, g) =>
          s + g.tools.reduce((sum, t) => sum + (t.totalStock || 0), 0),
        0
      ),
    [grouped]
  );

  const totalAvailableSerials = useMemo(
    () => tools.reduce((acc, tool) => acc + (tool.available_serials?.length || 0), 0),
    [tools]
  );

  const totalSoldSerials = useMemo(
    () => tools.reduce((acc, tool) => acc + (tool.sold_serials?.length || 0), 0),
    [tools]
  );

  // --------------------
  // EXPORT TO PDF (MAIN PAGE) - UPDATED WITH SERIAL INFO
  // --------------------
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Inventory Summary", 14, 15);
    doc.setFontSize(10);
    doc.text(`Exported: ${new Date().toLocaleString()}`, 14, 22);
    doc.text(`Total Available Serials: ${totalAvailableSerials} | Total Sold Serials: ${totalSoldSerials}`, 14, 28);

    const body: any[] = [];
    grouped.forEach((cat) => {
      cat.tools.forEach((t, i) => {
        body.push([
          i === 0 ? cat.category : "",
          t.name,
          String(t.totalStock ?? 0),
          String(t.totalAvailableSerials ?? 0),
          String(t.totalSoldSerials ?? 0),
        ]);
      });
    });

    autoTable(doc, {
      head: [["Category", "Tool Name", "Quantity", "Available Serials", "Sold Serials"]],
      body,
      startY: 35,
      styles: { fontSize: 9, cellPadding: 3, valign: "top" },
      headStyles: { fillColor: [15, 23, 42] },
      didDrawPage: () => {
        const pageCount =
          (doc.internal as any).getNumberOfPages?.() || 1;
        doc.setFontSize(8);
        doc.text(
          `Page ${pageCount}`,
          (doc.internal as any).pageSize.getWidth() - 20,
          (doc.internal as any).pageSize.getHeight() - 10
        );
      },
    });

    doc.save(`inventory_summary_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // --------------------
  // EXPORT TOOL DETAILS PDF (INNER PAGE) - FIXED EXPIRY DATE AND SERIAL INFO
  // --------------------
  const exportToolDetailsPDF = () => {
    if (!selectedTool) return;

    const toolGroup = tools.filter((t) => t.name === selectedTool.name);
    const filteredSerials = toolGroup.filter((t) =>
      t.code.toLowerCase().includes(serialSearch.toLowerCase()) ||
      (t.serials && isSerialObject(t.serials) && 
        Object.values(t.serials).some((serial: any) => 
          serial && serial.toString().toLowerCase().includes(serialSearch.toLowerCase())
        )
      )
    );

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${selectedTool.name} - Detailed Inventory`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Exported: ${new Date().toLocaleString()}`, 14, 22);
    doc.text(`Total Items: ${filteredSerials.length}`, 14, 28);

    const body: any[] = [];
    
    filteredSerials.forEach((item) => {
      const serials: string[] = [];
      
      // Handle serials display for PDF
      if (item.serials && isSerialObject(item.serials)) {
        const boxType = (item.box_type || "").toLowerCase();
        
        if (boxType.includes("base and rover")) {
          // Base and Rover: 4 serials
          if (item.serials.receiver1) serials.push(`R1: ${item.serials.receiver1}`);
          if (item.serials.receiver2) serials.push(`R2: ${item.serials.receiver2}`);
          if (item.serials.data_logger) serials.push(`DL: ${item.serials.data_logger}`);
          if (item.serials.external_radio) serials.push(`ER: ${item.serials.external_radio}`);
        } else if (boxType.includes("base") || boxType.includes("rover")) {
          // Base or Rover: 2 serials
          if (item.serials.receiver) serials.push(`R: ${item.serials.receiver}`);
          if (item.serials.data_logger) serials.push(`DL: ${item.serials.data_logger}`);
        } else {
          // Default
          if (item.serials.receiver) serials.push(`R: ${item.serials.receiver}`);
          if (item.serials.data_logger) serials.push(`DL: ${item.serials.data_logger}`);
          if (item.serials.external_radio) serials.push(`ER: ${item.serials.external_radio}`);
        }
      }
      
      // If no serials found, show main code
      if (serials.length === 0 && item.code) {
        serials.push(`Code: ${item.code}`);
      }
      
      body.push([
        item.box_type || "—",
        serials.join('\n') || "—",
        item.supplier_name || "—",
        item.invoice_no || "—",
        formatDate(item.date_added),
        formatDate(item.expiry_date), // Fixed expiry date display
        item.available_serials?.length || 0, // NEW: Available serials count
        item.sold_serials?.length || 0, // NEW: Sold serials count
      ]);
    });

    autoTable(doc, {
      head: [["Box Type", "Serial Numbers", "Supplier", "Invoice No", "Date Added", "Expiry Date"]],
      body,
      startY: 40,
      styles: { fontSize: 8, cellPadding: 2, valign: 'top' },
      headStyles: { fillColor: [15, 23, 42] },
      didDrawPage: () => {
        const pageCount = (doc.internal as any).getNumberOfPages?.() || 1;
        doc.setFontSize(8);
        doc.text(
          `Page ${pageCount}`,
          (doc.internal as any).pageSize.getWidth() - 20,
          (doc.internal as any).pageSize.getHeight() - 10
        );
      },
    });

    doc.save(`${selectedTool.name}_details_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // --------------------
  // EXPORT ACCESSORIES PDF
  // --------------------
  const exportAccessoriesPDF = () => {
    if (!selectedInvoice) return;

    const accessories = getAccessoriesForBoxType(selectedInvoice.boxType);
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(`Accessories List - Invoice ${selectedInvoice.invoiceNo}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Exported: ${new Date().toLocaleString()}`, 14, 22);
    doc.text(`Box Type: ${selectedInvoice.boxType || "Not specified"}`, 14, 28);

    const body: any[] = accessories.map((accessory, index) => [
      index + 1,
      accessory.name,
      accessory.quantity
    ]);

    autoTable(doc, {
      head: [["#", "Accessory Name", "Quantity"]],
      body,
      startY: 35,
      styles: { fontSize: 9, cellPadding: 3, valign: "top" },
      headStyles: { fillColor: [15, 23, 42] },
      didDrawPage: () => {
        const pageCount = (doc.internal as any).getNumberOfPages?.() || 1;
        doc.setFontSize(8);
        doc.text(
          `Page ${pageCount}`,
          (doc.internal as any).pageSize.getWidth() - 20,
          (doc.internal as any).pageSize.getHeight() - 10
        );
      },
    });

    doc.save(`accessories_${selectedInvoice.invoiceNo}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // --------------------
  // RENDER ACCESSORIES PAGE
  // --------------------
  const renderAccessoriesPage = () => {
    if (!selectedInvoice) return null;

    const accessories = getAccessoriesForBoxType(selectedInvoice.boxType);

    return (
      <div className="mt-6 border rounded-lg p-4 bg-blue-950">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Accessories List - Invoice {selectedInvoice.invoiceNo}
          </h2>
          <div className="flex gap-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={exportAccessoriesPDF}
            >
              Export PDF
            </Button>
            <Button
              className="bg-slate-700 hover:bg-slate-600"
              onClick={() => setSelectedInvoice(null)}
            >
              Back to Details
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-300">
            <strong>Box Type:</strong> {selectedInvoice.boxType || "Not specified"}
          </p>
        </div>

        <div className="overflow-auto border rounded-md">
          <table className="min-w-full text-white">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-4 py-2 text-left w-16">#</th>
                <th className="px-4 py-2 text-left">Accessory Name</th>
                <th className="px-4 py-2 text-left w-24">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {accessories.length > 0 ? (
                accessories.map((accessory, index) => (
                  <tr key={index} className="border-b border-slate-700">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{accessory.name}</td>
                    <td className="px-4 py-2">{accessory.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-center text-gray-400">
                    No accessories defined for this box type.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // --------------------
  // RENDER MAIN TABLE - UPDATED WITH SERIAL INFO
  // --------------------
  const renderMainTable = () => {
    if (grouped.length === 0)
      return (
        <tr>
          <td colSpan={4} className="p-6 text-center text-gray-500">
            No tools found.
          </td>
        </tr>
      );

    const rows: React.ReactNode[] = [];
    grouped.forEach((cat) => {
      // Calculate total tools in this category
      const totalToolsInCategory = cat.tools.reduce((sum, tool) => sum + tool.totalStock, 0);
      // REMOVED: Unused variables that were causing warnings
      // const totalAvailableInCategory = cat.tools.reduce((sum, tool) => sum + tool.totalAvailableSerials, 0);
      // const totalSoldInCategory = cat.tools.reduce((sum, tool) => sum + tool.totalSoldSerials, 0);
      
      cat.tools.forEach((t, i) => {
        rows.push(
          <tr
            key={`${cat.category}-${t.name}-${i}`}
            className="border-b last:border-b-0 hover:bg-slate-50/5"
          >
            <td className={`px-4 py-3 align-top ${i === 0 ? "font-semibold" : ""}`}>
              {i === 0 ? (
                <div>
                  {cat.category} 
                  <span className="font-bold text-white ml-1">
                    ({totalToolsInCategory})
                  </span>
                </div>
              ) : (
                ""
              )}
            </td>

            <td
              className="px-4 py-3 align-top text-blue-400 cursor-pointer hover:underline"
              onClick={() => setSelectedTool(t.serials[0])}
            >
              <div className="flex items-center gap-2">
                {t.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    viewSerialNumbers(t.serials[0]);
                  }}
                  className="text-green-400 hover:text-green-300"
                  title="View serial numbers"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </td>

            <td className="px-4 py-3 text-center align-top">
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  t.totalStock <= 5
                    ? "bg-amber-600/20 text-amber-300"
                    : "bg-green-600/10 text-green-300"
                }`}
              >
                {t.totalStock}
              </span>
            </td>
          </tr>
        );
      });
    });

    return rows;
  };

  // --------------------
  // RENDER TOOL DETAILS - FIXED EXPIRY DATE DISPLAY AND ADDED SERIAL INFO
  // --------------------
  const renderToolDetails = () => {
    if (!selectedTool) return null;

    const toolGroup = tools.filter((t) => t.name === selectedTool.name);
    const filteredSerials = toolGroup.filter((t) =>
      t.code.toLowerCase().includes(serialSearch.toLowerCase()) ||
      (t.serials && isSerialObject(t.serials) && 
        Object.values(t.serials).some((serial: any) => 
          serial && serial.toString().toLowerCase().includes(serialSearch.toLowerCase())
        )
      )
    );

    // Group by invoice number
    const groupedByInvoice = filteredSerials.reduce((acc, item) => {
      const key = item.invoice_no || "no-invoice";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, Tool[]>);

    return (
      <div className="mt-6 border rounded-lg p-4 bg-blue-950">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">{selectedTool.name} — Details</h2>
          <div className="flex gap-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={exportToolDetailsPDF}
            >
              Export PDF
            </Button>
            <Button
              className="bg-slate-700 hover:bg-slate-600"
              onClick={() => setSelectedTool(null)}
            >
              Back
            </Button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Filter by serial number or code"
          value={serialSearch}
          onChange={(e) => setSerialSearch(e.target.value)}
          className="px-3 py-2 mb-3 bg-slate-800 text-white rounded-md w-80"
        />

        <div className="mb-3 text-sm text-gray-300">
          Showing {filteredSerials.length} items
          {filteredSerials.some(t => t.expiry_date) && (
            <span className="ml-4">
              • {filteredSerials.filter(t => t.expiry_date).length} items with expiry dates
            </span>
          )}
        </div>

        <div className="overflow-auto border rounded-md">
          <table className="min-w-full text-white">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-4 py-2 text-left w-40">Box Type</th>
                <th className="px-4 py-2 text-left w-64">Serial Numbers</th>
                <th className="px-4 py-2 text-left w-40">Supplier</th>
                <th className="px-4 py-2 text-left w-40">Invoice No</th>
                <th className="px-4 py-2 text-left w-40">Date Added</th>
                <th className="px-4 py-2 text-left w-40">Expiry Date</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(groupedByInvoice).map(([invoiceNo, group]) =>
                group.map((item, index) => {
                  const hasExpiryDate = !!item.expiry_date;
                  const isExpired = hasExpiryDate && isDateExpired(item.expiry_date);
                  const isExpiringSoon = hasExpiryDate && isDateExpiringSoon(item.expiry_date);
                  
                  return (
                    <tr key={`${item.id}-${index}`} className="border-b border-slate-700">
                      {/* Box Type */}
                      <td className="px-4 py-2 align-top">
                        {item.box_type || "—"}
                      </td>

                      {/* Serial Numbers */}
                      <td className="px-4 py-2 align-top">
                        <div className="space-y-1 text-sm">
                          
                          {/* Show serials based on box type */}
                          {item.serials && isSerialObject(item.serials) && (
                            <>
                              {/* Base and Rover: 4 serials */}
                              {(item.box_type || "").toLowerCase().includes("base and rover") && (
                                <>
                                  {getSerialValue(item.serials, 'receiver1') && (
                                    <div>
                                      <span className="text-gray-400">Receiver 1:</span> {getSerialValue(item.serials, 'receiver1')}
                                    </div>
                                  )}
                                  {getSerialValue(item.serials, 'receiver2') && (
                                    <div>
                                      <span className="text-gray-400">Receiver 2:</span> {getSerialValue(item.serials, 'receiver2')}
                                    </div>
                                  )}
                                  {getSerialValue(item.serials, 'data_logger') && (
                                    <div>
                                      <span className="text-gray-400">Data Logger:</span> {getSerialValue(item.serials, 'data_logger')}
                                    </div>
                                  )}
                                  {getSerialValue(item.serials, 'external_radio') && (
                                    <div>
                                      <span className="text-gray-400">External Radio:</span> {getSerialValue(item.serials, 'external_radio')}
                                    </div>
                                  )}
                                </>
                              )}
                              
                              {/* Base or Rover: 2 serials */}
                              {((item.box_type || "").toLowerCase().includes("base") || 
                                (item.box_type || "").toLowerCase().includes("rover")) && 
                                !(item.box_type || "").toLowerCase().includes("base and rover") && (
                                <>
                                  {getSerialValue(item.serials, 'receiver') && (
                                    <div>
                                      <span className="text-gray-400">Receiver:</span> {getSerialValue(item.serials, 'receiver')}
                                    </div>
                                  )}
                                  {getSerialValue(item.serials, 'data_logger') && (
                                    <div>
                                      <span className="text-gray-400">Data Logger:</span> {getSerialValue(item.serials, 'data_logger')}
                                    </div>
                                  )}
                                </>
                              )}
                              
                              {/* Default display for other types */}
                              {!(item.box_type || "").toLowerCase().includes("base") && 
                               !(item.box_type || "").toLowerCase().includes("rover") && (
                                <>
                                  {getSerialValue(item.serials, 'receiver') && (
                                    <div>
                                      <span className="text-gray-400">Receiver:</span> {getSerialValue(item.serials, 'receiver')}
                                    </div>
                                  )}
                                  {getSerialValue(item.serials, 'data_logger') && (
                                    <div>
                                      <span className="text-gray-400">Data Logger:</span> {getSerialValue(item.serials, 'data_logger')}
                                    </div>
                                  )}
                                  {getSerialValue(item.serials, 'external_radio') && (
                                    <div>
                                      <span className="text-gray-400">External Radio:</span> {getSerialValue(item.serials, 'external_radio')}
                                    </div>
                                  )}
                                </>
                              )}
                            </>
                          )}
                          
                          {/* Show if no serial data at all */}
                          {!item.code && (!item.serials || (isSerialObject(item.serials) && Object.keys(item.serials).length === 0)) && (
                            <span className="text-gray-500">No serial data</span>
                          )}
                        </div>
                      </td>

                      {/* Supplier */}
                      <td className="px-4 py-2 align-top">
                        {item.supplier_name || "—"}
                      </td>

                      {/* Invoice - Clickable */}
                      <td className="px-4 py-2 align-top">
                        {item.invoice_no ? (
                          <span
                            className="text-blue-400 cursor-pointer hover:underline"
                            onClick={() => setSelectedInvoice({
                              invoiceNo: item.invoice_no!,
                              boxType: item.box_type || ""
                            })}
                          >
                            {item.invoice_no}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Date Added */}
                      <td className="px-4 py-2 align-top">
                        {formatDate(item.date_added)}
                      </td>

                      {/* Expiry Date - FIXED DISPLAY */}
                      <td className="px-4 py-2 align-top">
                        {hasExpiryDate ? (
                          <span className={
                            isExpired 
                              ? "text-red-400 font-medium" 
                              : isExpiringSoon
                                ? "text-amber-400 font-medium"
                                : "text-green-400"
                          }>
                            {formatDate(item.expiry_date)}
                            {isExpired && (
                              <span className="text-xs text-red-400 block">Expired</span>
                            )}
                            {isExpiringSoon && (
                              <span className="text-xs text-amber-400 block">Expiring Soon</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
              
              {filteredSerials.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-gray-400">
                    No items found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // --------------------
  // VIEW SERIAL NUMBERS DIALOG
  // --------------------
  const renderSerialNumbersDialog = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${viewingSerials.open ? '' : 'hidden'}`}>
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">
            Serial Number History - {viewingSerials.tool?.name}
          </h3>
          <button
            onClick={() => setViewingSerials({ open: false, tool: null, soldSerials: [] })}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        {viewingSerials.soldSerials.length > 0 ? (
          <div className="space-y-3">
            {viewingSerials.soldSerials.map((serialInfo, index) => (
              <div key={index} className="bg-slate-800 p-4 rounded border border-slate-600">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-300 font-medium">Serial:</span>
                    <p className="text-white font-mono">{serialInfo.serial}</p>
                  </div>
                  <div>
                    <span className="text-blue-300 font-medium">Customer:</span>
                    <p className="text-white">{serialInfo.customer_name}</p>
                  </div>
                  <div>
                    <span className="text-blue-300 font-medium">Sale Date:</span>
                    <p className="text-white">{serialInfo.date_sold ? new Date(serialInfo.date_sold).toLocaleDateString() : 'Unknown'}</p>
                  </div>
                  <div>
                    <span className="text-blue-300 font-medium">Invoice:</span>
                    <p className="text-white">{serialInfo.invoice_number || "N/A"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p>No serial numbers have been sold for this tool yet.</p>
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => setViewingSerials({ open: false, tool: null, soldSerials: [] })}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );

  // --------------------
  // RETURN
  // --------------------
  return (
    <DashboardLayout>
      {renderSerialNumbersDialog()}
      
      <div className="p-6">
        {!selectedTool ? (
          // FIRST PAGE - Show header and search controls
          <>
            <div className="flex items-start justify-between mb-4 gap-4">
              <div>
                <h1 className="text-2xl font-semibold">Inventory Summary</h1>
                <p className="text-sm text-gray-500">
                  Grouped by category and tool name.
                </p>
                {lastUpdated && (
                  <p className="text-xs text-gray-400 mt-1">
                    Last updated: {new Date(lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="text"
                  placeholder="Search by name / supplier / code"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-3 py-2 bg-slate-800 text-white rounded-md w-64"
                />

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-800 text-white rounded-md"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === "all" ? "All categories" : c}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={lowStockOnly}
                    onChange={(e) => setLowStockOnly(e.target.checked)}
                  />
                  Low stock only
                </label>

                <Button
                  className="bg-slate-700 hover:bg-slate-600"
                  onClick={exportPDF}
                >
                  Export PDF
                </Button>
              </div>
            </div>

            {/* Stock Summary - UPDATED WITH SERIAL INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <Card className="border-border bg-blue-950">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400">Total Equipment Types</p>
                  <h3 className="text-2xl font-bold">{grouped.reduce((acc, cat) => acc + cat.tools.length, 0)}</h3>
                </CardContent>
              </Card>
              <Card className="border-border bg-blue-950">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400">Items in Stock</p>
                  <h3 className="text-2xl font-bold">{totalStock}</h3>
                </CardContent>
              </Card>
              <Card className="border-border bg-blue-950">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400">Sold Items</p>
                  <h3 className="text-2xl font-bold text-blue-400">{totalSoldSerials}</h3>
                </CardContent>
              </Card>
            </div>

            <div className="overflow-auto border rounded-lg">
              <table className="min-w-full table-fixed">
                <thead className="bg-slate-900 text-white sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left w-56">Category</th>
                    <th className="px-4 py-3 text-left">Item Name</th>
                    <th className="px-4 py-3 text-center w-28">Quantity</th>
                  </tr>
                </thead>

                <tbody className="text-white bg-blue-950">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    renderMainTable()
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div>
                Showing <strong>{grouped.length}</strong> categories
              </div>
              <div className="flex gap-4">
                <div>
                  Total stock: <strong>{totalStock}</strong>
                </div>
              </div>
            </div>
          </>
        ) : selectedInvoice ? (
          // THIRD PAGE - Accessories page
          renderAccessoriesPage()
        ) : (
          // SECOND PAGE - Only show details without header and search controls
          renderToolDetails()
        )}
      </div>
    </DashboardLayout>
  );
};

export default ToolsSummary;