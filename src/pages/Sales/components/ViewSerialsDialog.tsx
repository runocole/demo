// src/pages/Sales/components/ViewSerialsDialog.tsx
import { Barcode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import type { Tool, SoldSerialInfo } from "../types";

interface ViewSerialsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: Tool | null;
  soldSerials: SoldSerialInfo[];
  onClose: () => void;
}

const ViewSerialsDialog = ({
  open,
  onOpenChange,
  tool,
  soldSerials,
  onClose
}: ViewSerialsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Barcode className="w-5 h-5" />
            Serial Number History - {tool?.name}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Track which serial numbers have been sold and to whom
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-3">
          {soldSerials.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {soldSerials.map((serialInfo, index) => (
                <Card key={index} className="bg-slate-800 border-slate-600">
                  <CardContent className="p-4">
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
                        <p className="text-white">{new Date(serialInfo.date_sold).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-blue-300 font-medium">Invoice:</span>
                        <p className="text-white">{serialInfo.invoice_number || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Barcode className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No serial numbers have been sold for this tool yet.</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { ViewSerialsDialog };