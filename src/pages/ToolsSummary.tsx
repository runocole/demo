import React, { useEffect, useMemo, useState } from "react";
import { getTools } from "../services/api";
import { Button } from "../components/ui/button";
import { DashboardLayout } from "../components/DashboardLayout";
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
}

// --------------------
// ACCESSORY TYPES
// --------------------
interface Accessory {
  name: string;
  quantity: number;
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
  // LOAD TOOLS - FIXED DATA NORMALIZATION
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
            expiry_date: t.expiry_date || "", // Fixed expiry date mapping
            serials: serialsData,
          };
        });

        console.log('Normalized tools:', normalized); // Debug log
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
      { name: string; totalStock: number; suppliers: string[]; serials: Tool[] }[]
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
      } else {
        toolGroup.push({
          name: t.name,
          totalStock: t.stock,
          suppliers: t.supplier_name ? [t.supplier_name] : [],
          serials: [t],
        });
      }
    }

    return Array.from(map.entries()).map(([category, tools]) => ({
      category,
      tools,
    }));
  }, [tools, search, categoryFilter, lowStockOnly]);

  // --------------------
  // TOTAL STOCK
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

  // --------------------
  // EXPORT TO PDF (MAIN PAGE)
  // --------------------
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Inventory Summary", 14, 15);
    doc.setFontSize(10);
    doc.text(`Exported: ${new Date().toLocaleString()}`, 14, 22);

    const body: any[] = [];
    grouped.forEach((cat) => {
      cat.tools.forEach((t, i) => {
        body.push([
          i === 0 ? cat.category : "",
          t.name,
          String(t.totalStock ?? 0),
        ]);
      });
    });

    autoTable(doc, {
      head: [["Category", "Tool Name", "Quantity"]],
      body,
      startY: 28,
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
  // EXPORT TOOL DETAILS PDF (INNER PAGE)
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
        item.date_added ? new Date(item.date_added).toLocaleDateString() : "—",
        item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : "—",
      ]);
    });

    autoTable(doc, {
      head: [["Box Type", "Serial Numbers", "Supplier", "Invoice No", "Date Added", "Expiry Date"]],
      body,
      startY: 35,
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
  // RENDER MAIN TABLE
  // --------------------
  const renderMainTable = () => {
    if (grouped.length === 0)
      return (
        <tr>
          <td colSpan={3} className="p-6 text-center text-gray-500">
            No tools found.
          </td>
        </tr>
      );

    const rows: React.ReactNode[] = [];
    grouped.forEach((cat) => {
      // Calculate total tools in this category
      const totalToolsInCategory = cat.tools.reduce((sum, tool) => sum + tool.totalStock, 0);
      
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
              {t.name}
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
  // RENDER TOOL DETAILS - FIXED SERIAL NUMBER AND EXPIRY DATE DISPLAY
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
                  const isExpired = item.expiry_date && new Date(item.expiry_date) < new Date();
                  const isExpiringSoon = item.expiry_date && 
                    new Date(item.expiry_date) > new Date() && 
                    new Date(item.expiry_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
                  
                  return (
                    <tr key={`${item.id}-${index}`} className="border-b border-slate-700">
                      {/* Box Type */}
                      <td className="px-4 py-2 align-top">
                        {item.box_type || "—"}
                      </td>

                      {/* Serial Numbers - FIXED DISPLAY */}
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
                        {item.date_added
                          ? new Date(item.date_added).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* Expiry Date - FIXED DISPLAY */}
                      <td className="px-4 py-2 align-top">
                        {item.expiry_date ? (
                          <span className={
                            isExpired 
                              ? "text-red-400 font-medium" 
                              : isExpiringSoon
                                ? "text-amber-400 font-medium"
                                : "text-green-400"
                          }>
                            {new Date(item.expiry_date).toLocaleDateString()}
                            {isExpired && (
                              <span className="text-xs text-red-400 block">Expired</span>
                            )}
                            {isExpiringSoon && (
                              <span className="text-xs text-amber-400 block">Expiring Soon</span>
                            )}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
              
              {filteredSerials.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-gray-400">
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
  // RETURN
  // --------------------
  return (
    <DashboardLayout>
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
                      <td colSpan={3} className="p-6 text-center">
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
              <div>
                Total stock: <strong>{totalStock}</strong>
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