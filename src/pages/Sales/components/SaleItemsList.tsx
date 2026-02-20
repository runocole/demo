// src/pages/Sales/components/SaleItemsList.tsx
import { Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import type { SaleItem } from "../types";

interface SaleItemsListProps {
  items: SaleItem[];
  totalCost: number;
  onRemoveItem: (index: number) => void;
}

const SaleItemsList = ({ items, totalCost, onRemoveItem }: SaleItemsListProps) => {
  if (items.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-semibold">Items in this Sale ({items.length})</h3>
        <div className="text-right">
          <div className="text-lg font-bold text-green-400">
            Total: ₦{totalCost.toLocaleString()}
          </div>
          {items[0]?.invoice_number && (
            <div className="text-sm text-green-300 mt-1 bg-green-900/30 px-2 py-1 rounded border border-green-700">
              <span className="font-medium">Sales Invoice:</span> {items[0].invoice_number}
            </div>
          )}
          {items[0]?.import_invoice && (
            <div className="text-sm text-blue-300 mt-1 bg-blue-900/30 px-2 py-1 rounded border border-blue-700">
              <span className="font-medium">Import Invoice:</span> {items[0].import_invoice}
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded border border-slate-600">
            <div className="flex-1">
              <div className="text-white font-medium">{item.equipment}</div>
              <div className="text-sm text-gray-300">
                {item.category}
                {item.serial_set && item.serial_set.length > 0 && (
                  <div className="mt-1">
                    <div className="text-blue-400">
                      Receiver Serials: {item.serial_set.join(', ')}
                    </div>
                    {item.datalogger_serial && (
                      <div className="text-green-400">
                        Datalogger Serial: {item.datalogger_serial}
                      </div>
                    )}
                    {item.external_radio_serial && (
                      <div className="text-orange-400">
                        External Radio: {item.external_radio_serial}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-lg font-bold text-white">
                ₦{parseFloat(item.cost).toLocaleString()}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveItem(index)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { SaleItemsList };