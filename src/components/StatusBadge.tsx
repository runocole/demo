import { Badge } from "../components/ui/badge";

interface StatusBadgeProps {
  status?:
    | "available"
    | "rented"
    | "maintenance"
    | "disabled"
    | "active"
    | "overdue"
    | "completed"
    | "pending"
    | "sold"; // ✅ Added sold
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants: Record<
    NonNullable<StatusBadgeProps["status"]>,
    { label: string; className: string }
  > = {
    available: { label: "Available", className: "bg-green-100 text-green-800" },
    rented: { label: "Rented", className: "bg-blue-100 text-blue-800" },
    maintenance: { label: "Maintenance", className: "bg-orange-100 text-orange-800" },
    disabled: { label: "Disabled", className: "bg-red-100 text-red-800" },
    active: { label: "Active", className: "bg-green-100 text-green-800" },
    overdue: { label: "Overdue", className: "bg-red-100 text-red-800" },
    completed: { label: "Completed", className: "bg-gray-100 text-gray-500" },
    pending: { label: "Pending", className: "bg-orange-100 text-orange-800" },
    sold: { label: "Sold", className: "bg-purple-100 text-purple-800" },
  };

  // ✅ Safe fallback for undefined or unknown statuses
  const variant = status ? variants[status] : { label: "N/A", className: "bg-gray-100 text-gray-500" };

  return (
    <Badge className={`${variant.className} ${className || ""}`}>
      {variant.label}
    </Badge>
  );
}
