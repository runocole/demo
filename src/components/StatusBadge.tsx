import { Badge } from "../components/ui/badge";

interface StatusBadgeProps {
  status: "available" | "rented" | "maintenance" | "disabled" | "active" | "overdue" | "completed" | "pending";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants: Record<typeof status, { label: string; className: string }> = {
    available: { label: "Available", className: "bg-success text-success-foreground" },
    rented: { label: "Rented", className: "bg-primary text-primary-foreground" },
    maintenance: { label: "Maintenance", className: "bg-warning text-warning-foreground" },
    disabled: { label: "Disabled", className: "bg-destructive text-destructive-foreground" },
    active: { label: "Active", className: "bg-success text-success-foreground" },
    overdue: { label: "Overdue", className: "bg-destructive text-destructive-foreground" },
    completed: { label: "Completed", className: "bg-muted text-muted-foreground" },
    pending: { label: "Pending", className: "bg-warning text-warning-foreground" },
  };

  const variant = variants[status];

  return (
    <Badge className={`${variant.className} ${className}`}>
      {variant.label}
    </Badge>
  );
}
