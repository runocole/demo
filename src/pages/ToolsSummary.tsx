import React, { useEffect, useMemo, useState } from "react";
import { getTools } from "../services/api";
import { Button } from "../components/ui/button";
import { DashboardLayout } from "../components/DashboardLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --------------------
// INTERFACE
// --------------------
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
  serials?: {
    receiver?: string;
    data_logger?: string;
    external_radio?: string;
  }; // For Receivers only
}

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
  const [serialSearch, setSerialSearch] = useState("");

  // --------------------
  // LOAD TOOLS
  // --------------------
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getTools();
        if (!mounted) return;
        const normalized: Tool[] = (data || []).map((t: any) => ({
          id: t.id,
          name: t.name,
          code: t.code,
          stock: Number(t.stock || 0),
          supplier: t.supplier || "",
          supplier_name: t.supplier_name || "",
          category: t.category || "Uncategorized",
          invoice_no: t.invoice_number || "",
          date_added: t.date_added,
          updated_at: t.updated_at,
          box_type: t.box_type || t.description || "",
          serials: t.serials || {},
        }));

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
        (t.supplier || "").toLowerCase().includes(q);
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
  // EXPORT TO PDF
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
          t.suppliers.join(" / ") || "—",
        ]);
      });
    });

    autoTable(doc, {
      head: [["Category", "Tool Name", "Quantity", "Supplier"]],
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
  // RENDER MAIN TABLE
  // --------------------
  const renderMainTable = () => {
    if (grouped.length === 0)
      return (
        <tr>
          <td colSpan={8} className="p-6 text-center text-gray-500">
            No tools found.
          </td>
        </tr>
      );

    const rows: React.ReactNode[] = [];
    grouped.forEach((cat) => {
      cat.tools.forEach((t, i) => {
        rows.push(
          <tr
            key={`${cat.category}-${t.name}-${i}`}
            className="border-b last:border-b-0 hover:bg-slate-50/5"
          >
            <td className={`px-4 py-3 align-top ${i === 0 ? "font-semibold" : ""}`}>
              {i === 0 ? cat.category : ""}
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

            <td className="px-4 py-3 align-top">
              {t.suppliers.join(" / ") || "—"}
            </td>
          </tr>
        );
      });
    });

    return rows;
  };

  // --------------------
  // RENDER TOOL DETAILS
  // --------------------
const renderToolDetails = () => {
  if (!selectedTool) return null;

  const toolGroup = tools.filter((t) => t.name === selectedTool.name);
  const filteredSerials = toolGroup.filter((t) =>
    t.code.toLowerCase().includes(serialSearch.toLowerCase())
  );

  // Group by invoice number
  const groupedByInvoice = filteredSerials.reduce((acc, item) => {
    const key = item.invoice_no || "no-invoice";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, Tool[]>);

  return (
    <div className="mt-6 border rounded-lg p-4 bg-slate-900">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">{selectedTool.name} — Details</h2>
        <Button
          className="bg-slate-700 hover:bg-slate-600"
          onClick={() => setSelectedTool(null)}
        >
          Back
        </Button>
      </div>

      <input
        type="text"
        placeholder="Filter by serial number"
        value={serialSearch}
        onChange={(e) => setSerialSearch(e.target.value)}
        className="px-3 py-2 mb-3 bg-slate-800 text-white rounded-md w-80"
      />

      <div className="overflow-auto border rounded-md">
        <table className="min-w-full text-white">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-4 py-2 text-left w-40">Box Type</th>
              <th className="px-4 py-2 text-left w-64">Serial Numbers</th>
              <th className="px-4 py-2 text-left w-40">Supplier</th>
              <th className="px-4 py-2 text-left w-40">Invoice No</th>
              <th className="px-4 py-2 text-left w-40">Date Added</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(groupedByInvoice).map(([invoice, group], i) =>
              group.map((item, idx) => (
                <tr key={`${invoice}-${idx}`} className="border-b border-slate-700">
                   {/* BOX TYPE */}
                    <td className="px-4 py-2 align-top">
                     {item.box_type || "—"}
                    </td>


                 {/* ✅ Serials Section */}
{selectedTool && Array.isArray(selectedTool.serials) && selectedTool.serials.length > 0 ? (
  <div className="mt-4">
    <h3 className="text-lg font-semibold mb-2">Serial Numbers</h3>
    <ul className="list-disc list-inside">
      {selectedTool.serials.map((s: string, sIdx: number) => (
        <li key={sIdx} className="text-sm text-gray-700">{s}</li>
      ))}
    </ul>
  </div>
) : (
  <p className="mt-4 text-sm text-gray-500">No serial numbers available.</p>
)}


                  {/* SUPPLIER */}
                  <td className="px-4 py-2 align-top">
                    {item.supplier_name || "—"}
                  </td>

                  {/* INVOICE */}
                  <td className="px-4 py-2 align-top">{item.invoice_no || "—"}</td>

                  {/* DATE */}
                  <td className="px-4 py-2 align-top">
                    {item.date_added
                      ? new Date(item.date_added).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))
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
              placeholder="Search by name / supplier"
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

        {!selectedTool ? (
          <div className="overflow-auto border rounded-lg">
            <table className="min-w-full table-fixed">
              <thead className="bg-slate-900 text-white sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left w-56">Category</th>
                  <th className="px-4 py-3 text-left">Item Name</th>
                  <th className="px-4 py-3 text-center w-28">Quantity</th>
                  <th className="px-4 py-3 text-left w-40">Supplier</th>
                </tr>
              </thead>

              <tbody className="text-white bg-blue-950">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  renderMainTable()
                )}
              </tbody>
            </table>
          </div>
        ) : (
          renderToolDetails()
        )}

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing <strong>{grouped.length}</strong> categories
          </div>
          <div>
            Total stock: <strong>{totalStock}</strong>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ToolsSummary;
