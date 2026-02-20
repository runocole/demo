// src/pages/Sales/components/AssignmentModal.tsx
import { Barcode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import type { AssignmentResult } from "../types";

interface AssignmentModalProps {
  assignment: AssignmentResult | null;
  onClose: () => void;
}

const AssignmentModal = ({ assignment, onClose }: AssignmentModalProps) => {
  if (!assignment) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Barcode className="w-5 h-5 text-green-400" />
            Equipment Set Assigned Successfully!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-3">
          <div className="bg-green-900/20 p-4 rounded-md border border-green-700">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-300 mb-2">
                {assignment.toolName}
              </div>
              <div className="text-sm text-gray-300 mb-3">
                {assignment.setType} • {assignment.serialCount} serials
              </div>
              
              {assignment.invoiceNumber && (
                <div className="mb-3 p-2 bg-green-900/30 rounded border border-green-700">
                  <div className="font-medium text-green-300">Sales Invoice:</div>
                  <div className="text-white font-mono">{assignment.invoiceNumber}</div>
                </div>
              )}
              
              {assignment.importInvoice && (
                <div className="mb-3 p-2 bg-blue-900/30 rounded border border-blue-700">
                  <div className="font-medium text-blue-300">Import Invoice:</div>
                  <div className="text-white font-mono">{assignment.importInvoice}</div>
                </div>
              )}
              
              <div className="space-y-2 text-sm mb-3">
                <div className="font-medium text-blue-300">Receiver Serials:</div>
                {assignment.serialSet.map((serial, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-300">
                      {assignment.setType === "Base & Rover Combo" 
                        ? `Receiver ${index + 1}:` 
                        : 'Receiver:'}
                    </span>
                    <span className="text-white font-mono">{serial}</span>
                  </div>
                ))}
              </div>
              
              {assignment.dataloggerSerial && (
                <div className="space-y-2 text-sm border-t border-green-600 pt-3">
                  <div className="font-medium text-blue-300">Datalogger Serial:</div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Datalogger:</span>
                    <span className="text-white font-mono">{assignment.dataloggerSerial}</span>
                  </div>
                </div>
              )}

              {assignment.externalRadioSerial && (
                <div className="space-y-2 text-sm border-t border-green-600 pt-3 mt-3">
                  <div className="font-medium text-blue-300">External Radio Serial:</div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">External Radio:</span>
                    <span className="text-white font-mono">{assignment.externalRadioSerial}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-300 text-sm text-center">
            Complete equipment set has been assigned from inventory.
          </p>
        </div>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { AssignmentModal };