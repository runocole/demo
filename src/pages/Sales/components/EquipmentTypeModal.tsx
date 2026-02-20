// src/pages/Sales/components/EquipmentTypeModal.tsx
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
import { RECEIVER_EQUIPMENT_TYPES } from "../types";

interface EquipmentTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedType: string;
  onSelect: (type: string) => void;
  onCancel: () => void;
}

const EquipmentTypeModal = ({
  open,
  onOpenChange,
  selectedType,
  onSelect,
  onCancel
}: EquipmentTypeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Select Equipment Type</DialogTitle>
          <DialogDescription className="text-gray-300">
            Choose the type of Receiver equipment you want to sell
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {RECEIVER_EQUIPMENT_TYPES.map((type) => (
            <Card
              key={type}
              className={`p-4 cursor-pointer hover:scale-105 transform transition-all ${
                selectedType === type 
                  ? "ring-2 ring-blue-500 bg-blue-900/20" 
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
              onClick={() => onSelect(type)}
            >
              <CardContent className="p-0">
                <div className="text-lg font-semibold text-center">{type}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            className="text-gray-300 border-slate-600 hover:bg-slate-700"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { EquipmentTypeModal };