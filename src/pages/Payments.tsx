import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import {
  TrendingUp, Clock, AlertTriangle, Search, Download,
  Loader2, RefreshCcw, ChevronUp, ChevronDown, ChevronsUpDown,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "../components/ui/use-toast";
import axios from "axios";

// ─── Constants ────────────────────────────────────────────────────────────────

const API_URL = "http://127.0.0.1:8000/api";

const authHeader = () => {
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaymentSummary {
  total_revenue: number;
  pending_amount: number;
  pending_count: number;
  overdue_amount: number;
  overdue_count: number;
  total_sales: number;
}

interface PaymentRow {
  payment_id: string;
  invoice_number: string;
  customer_name: string;
  customer_phone: string;
  equipment: string;
  amount: string;
  date: string;
  payment_plan: string;
  payment_status: string;
  state: string;
}

type SortKey = keyof PaymentRow;
type SortDir = "asc" | "desc";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNaira = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const statusConfig: Record<string, { label: string; classes: string }> = {
  completed: { label: "Completed", classes: "bg-green-900/40 text-green-400 border border-green-800/50" },
  pending:   { label: "Pending",   classes: "bg-yellow-900/40 text-yellow-400 border border-yellow-800/50" },
  installment: { label: "Installment", classes: "bg-blue-900/40 text-blue-300 border border-blue-700/50" },
  failed:    { label: "Failed",    classes: "bg-red-900/40 text-red-400 border border-red-800/50" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = statusConfig[status] ?? { label: status, classes: "bg-slate-800 text-slate-400" };
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PaymentTracking = () => {
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/payments/summary/`, {
        headers: authHeader(),
      });
      setSummary(res.data.summary);
      setPayments(res.data.payments);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.detail || "Failed to load payment data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── Sort ──────────────────────────────────────────────────────────────────

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown className="h-3 w-3 ml-1 text-blue-700" />;
    return sortDir === "asc"
      ? <ChevronUp className="h-3 w-3 ml-1 text-blue-400" />
      : <ChevronDown className="h-3 w-3 ml-1 text-blue-400" />;
  };

  // ── Filter + Sort ─────────────────────────────────────────────────────────

  const filtered = payments
    .filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        p.customer_name.toLowerCase().includes(q) ||
        p.invoice_number.toLowerCase().includes(q) ||
        p.equipment.toLowerCase().includes(q) ||
        p.customer_phone.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || p.payment_status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let aVal: string | number = a[sortKey];
      let bVal: string | number = b[sortKey];

      // Numeric sort for amount
      if (sortKey === "amount") {
        aVal = parseFloat(a.amount) || 0;
        bVal = parseFloat(b.amount) || 0;
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  // ── CSV Export ────────────────────────────────────────────────────────────

  const exportCSV = () => {
    const headers = ["Invoice", "Customer", "Phone", "Equipment", "Amount", "Date", "Plan", "Status", "State"];
    const rows = filtered.map((p) => [
      p.invoice_number,
      p.customer_name,
      p.customer_phone,
      p.equipment,
      p.amount,
      p.date,
      p.payment_plan,
      p.payment_status,
      p.state,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Payment Tracking</h2>
            <p className="text-muted-foreground">Monitor all sales and payment statuses</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchData}
              className="gap-2 border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
            >
              <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={exportCSV}
              className="gap-2 border-teal-700 bg-teal-950/30 text-teal-300 hover:bg-teal-800 hover:text-white"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* ── Summary Cards ────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border border-blue-900/50 bg-blue-950/40 p-6 animate-pulse h-28" />
            ))}
          </div>
        ) : summary ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Total Revenue */}
            <Card className="border-blue-900/50 bg-blue-950/40">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-blue-400 font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {formatNaira(summary.total_revenue)}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">
                      {summary.total_sales} total sales
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-900/30 p-2.5">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Payments */}
            <Card className="border-blue-900/50 bg-blue-950/40">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-blue-400 font-medium">Pending Payments</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {formatNaira(summary.pending_amount)}
                    </p>
                    <p className="text-xs text-yellow-500 mt-1">
                      {summary.pending_count} {summary.pending_count === 1 ? "sale" : "sales"} awaiting payment
                    </p>
                  </div>
                  <div className="rounded-lg bg-yellow-900/30 p-2.5">
                    <Clock className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overdue */}
            <Card className="border-blue-900/50 bg-blue-950/40">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-blue-400 font-medium">Overdue Amount</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {formatNaira(summary.overdue_amount)}
                    </p>
                    <p className="text-xs text-red-400 mt-1">
                      {summary.overdue_count} {summary.overdue_count === 1 ? "customer" : "customers"} overdue
                    </p>
                  </div>
                  <div className="rounded-lg bg-red-900/30 p-2.5">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* ── Filters ─────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer, invoice, or equipment…"
              className="pl-10 bg-blue-950 border-blue-800 text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div className="flex gap-2 flex-wrap">
            {["all", "completed", "pending", "installment", "failed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === s
                    ? "bg-blue-600 text-white"
                    : "bg-blue-950 border border-blue-800 text-blue-400 hover:border-blue-600 hover:text-white"
                }`}
              >
                {s === "all" ? "All" : statusConfig[s]?.label ?? s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ───────────────────────────────────────────────────── */}
        <Card className="border-blue-900/50 bg-blue-950/50 backdrop-blur-sm">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-blue-400 gap-3">
                <Loader2 className="h-7 w-7 animate-spin" />
                Loading payments…
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
                <TrendingUp className="h-10 w-10 text-blue-800" />
                <p>No payments found{search ? ` for "${search}"` : ""}.</p>
                <p className="text-xs text-blue-700">Payments are generated automatically from sales.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-blue-900/30">
                    <TableRow className="hover:bg-transparent border-blue-900/50">

                      {/* Sortable headers */}
                      {[
                        { key: "invoice_number", label: "Invoice" },
                        { key: "customer_name",  label: "Customer" },
                        { key: "equipment",      label: "Equipment" },
                        { key: "amount",         label: "Amount" },
                        { key: "date",           label: "Date" },
                        { key: "payment_plan",   label: "Plan" },
                        { key: "payment_status", label: "Status" },
                      ].map(({ key, label }) => (
                        <TableHead
                          key={key}
                          className="text-blue-200 cursor-pointer select-none hover:text-white"
                          onClick={() => toggleSort(key as SortKey)}
                        >
                          <div className="flex items-center">
                            {label}
                            <SortIcon col={key as SortKey} />
                          </div>
                        </TableHead>
                      ))}

                      <TableHead className="text-blue-200">State</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filtered.map((row, idx) => (
                      <TableRow
                        key={`${row.invoice_number}-${idx}`}
                        className="border-blue-900/50 hover:bg-blue-900/10 transition-colors"
                      >
                        {/* Invoice */}
                        <TableCell>
                          <span className="font-mono text-xs text-teal-300 font-semibold">
                            {row.invoice_number}
                          </span>
                        </TableCell>

                        {/* Customer */}
                        <TableCell>
                          <div className="text-sm font-medium text-white">{row.customer_name}</div>
                          <div className="text-[11px] text-blue-400">{row.customer_phone}</div>
                        </TableCell>

                        {/* Equipment */}
                        <TableCell>
                          <span className="text-sm text-blue-200">{row.equipment}</span>
                        </TableCell>

                        {/* Amount */}
                        <TableCell>
                          <span className="text-sm font-semibold text-white">
                            {formatNaira(parseFloat(row.amount))}
                          </span>
                        </TableCell>

                        {/* Date */}
                        <TableCell>
                          <span className="text-sm text-blue-300">{row.date}</span>
                        </TableCell>

                        {/* Plan */}
                        <TableCell>
                          <span className="text-xs text-blue-400">
                            {row.payment_plan || "Full Payment"}
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <StatusBadge status={row.payment_status} />
                        </TableCell>

                        {/* State */}
                        <TableCell>
                          <span className="text-xs text-blue-500">{row.state}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Row count */}
                <div className="px-4 py-3 border-t border-blue-900/50 text-xs text-blue-600">
                  Showing {filtered.length} of {payments.length} records
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentTracking;
