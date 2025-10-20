// src/pages/ToolsSummary.tsx
import React, { useEffect, useMemo, useState } from "react";
import { getTools } from "../services/api";
import { Button } from "../components/ui/button";
import { DashboardLayout } from "../components/DashboardLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Tool {
  id: string;
  name: string;
  code: string; // serial number
  stock: number;
  supplier?: string;
  category?: string;
}

const ToolsSummary: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

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
          stock: typeof t.stock === "number" ? t.stock : Number(t.stock || 0),
          supplier: t.supplier || "",
          category: t.category || "Uncategorized",
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

  // build category list for filter dropdown
  const categories = useMemo(() => {
    const set = new Set<string>();
    tools.forEach((t) => set.add(t.category || "Uncategorized"));
    return ["all", ...Array.from(set).sort()];
  }, [tools]);

  // filtered and grouped tools
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
        t.code.toLowerCase().includes(q) ||
        (t.supplier || "").toLowerCase().includes(q);
      return categoryMatch && qMatch;
    });

    // group by category → tool name
    const map = new Map<
      string,
      { name: string; serials: string[]; totalStock: number; suppliers: string[] }[]
    >();

    for (const t of filtered) {
      const category = t.category || "Uncategorized";
      if (!map.has(category)) map.set(category, []);

      const toolGroup = map.get(category)!;
      const existing = toolGroup.find((x) => x.name === t.name);

      if (existing) {
        existing.serials.push(t.code);
        existing.totalStock += t.stock || 0;
        if (t.supplier && !existing.suppliers.includes(t.supplier)) {
          existing.suppliers.push(t.supplier);
        }
      } else {
        toolGroup.push({
          name: t.name,
          serials: [t.code],
          totalStock: t.stock || 0,
          suppliers: t.supplier ? [t.supplier] : [],
        });
      }
    }

    return Array.from(map.entries()).map(([category, tools]) => ({
      category,
      tools,
    }));
  }, [tools, search, categoryFilter]);

  const totalStock = useMemo(
    () =>
      grouped.reduce(
        (s, g) =>
          s +
          g.tools.reduce((sum, t) => sum + (t.totalStock || 0), 0),
        0
      ),
    [grouped]
  );

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
          i === 0 ? cat.category : "", // show category once
          t.name,
          t.serials.join("\n"), // vertical list
          String(t.totalStock ?? 0),
          t.suppliers.join(" / ") || "—",
        ]);
      });
    });

    autoTable(doc, {
      head: [["Category", "Tool Name", "Serial Numbers", "Quantity", "Supplier"]],
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

  // --- UI rendering ---
  const renderRows = () => {
    if (grouped.length === 0) {
      return (
        <tr>
          <td colSpan={8} className="p-6 text-center text-gray-500">
            No tools found.
          </td>
        </tr>
      );
    }

    const rows: React.ReactNode[] = [];
    grouped.forEach((cat) => {
      cat.tools.forEach((t, i) => {
        rows.push(
          <tr
            key={`${cat.category}-${t.name}-${i}`}
            className="border-b last:border-b-0 hover:bg-slate-50/5"
          >
            <td
              className={`px-4 py-3 align-top ${
                i === 0 ? "font-semibold" : ""
              }`}
              style={{ width: 220 }}
            >
              {i === 0 ? cat.category : ""}
            </td>

            <td className="px-4 py-3 align-top">
              <div className="font-medium">{t.name}</div>
            </td>

            <td className="px-4 py-3 align-top">
              {t.serials.map((s, idx) => (
                <div key={idx}>{s}</div>
              ))}
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

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Inventory Summary</h1>
            <p className="text-sm text-gray-500">
              Grouped by category and tool name. 
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by name / serial / supplier"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 bg-slate-800 text-white rounded-md w-80"
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
                <th className="px-4 py-3 text-left w-44">Serial Numbers</th>
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
                renderRows()
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
      </div>
    </DashboardLayout>
  );
};

export default ToolsSummary;