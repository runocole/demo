// src/pages/Sales/components/EditStatusDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/select";
import { PAYMENT_STATUSES } from "../types";
import type { Sale } from "../types";

interface EditStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale | null;
  paymentStatus: string;
  onStatusChange: (status: string) => void;
  onUpdate: () => void;
  isUpdating: boolean;
}

export const EditStatusDialog = ({
  open,
  onOpenChange,
  sale,
  paymentStatus,
  onStatusChange,
  onUpdate,
  isUpdating
}: EditStatusDialogProps) => {
  if (!sale) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Payment Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-3">
          <div className="bg-blue-900/20 p-3 rounded-md border border-blue-700">
            <h4 className="font-semibold text-blue-300 mb-2">Sale Information</h4>
            <p className="text-sm text-gray-300">
              <strong className="text-blue-300">Customer:</strong> {sale.name}
            </p>
            <p className="text-sm text-gray-300">
              <strong className="text-blue-300">Sales Invoice:</strong> {sale.invoice_number || "N/A"}
            </p>
            <p className="text-sm text-gray-300">
              <strong className="text-blue-300">Import Invoice:</strong> {sale.import_invoice || "N/A"}
            </p>
            <p className="text-sm text-gray-300">
              <strong className="text-blue-300">Total:</strong> ₦{parseFloat(sale.total_cost).toLocaleString()}
            </p>
          </div>
          
          <div>
            <Label className="text-white">Payment Status</Label>
            <Select
              value={paymentStatus}
              onValueChange={onStatusChange}
            >
              <SelectTrigger className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-white border-slate-600">
                {PAYMENT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status} className="hover:bg-slate-700">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
            className="text-gray-300 border-slate-600 hover:bg-slate-700 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={onUpdate}
            disabled={isUpdating || !paymentStatus}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};