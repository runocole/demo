import { Badge } from "../components/ui/badge";

interface StatusBadgeProps {
  status: "available" | "rented" | "maintenance" | "disabled" | "active" | "overdue" | "completed" | "pending";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants: Record<typeof status, { label: string; className: string }> = {
    available: { label: "Available", className: "bg-green-100 text-green-800" }, // Green
    rented: { label: "Rented", className: "bg-blue-100 text-blue-800" }, // Blue
    maintenance: { label: "Maintenance", className: "bg-orange-100 text-orange-800" }, // Orange
    disabled: { label: "Disabled", className: "bg-red-100 text-red-800" }, // Red
    active: { label: "Active", className: "bg-green-100 text-green-800" }, // Green
    overdue: { label: "Overdue", className: "bg-red-100 text-red-800" }, // Red
    completed: { label: "Completed", className: "bg-gray-100 text-gray-500" }, // Light Gray
    pending: { label: "Pending", className: "bg-orange-100 text-orange-800" }, // Orange
  };

  const variant = variants[status];

  return (
    <Badge className={`${variant.className} ${className}`}>
      {variant.label}
    </Badge>
  );
}
