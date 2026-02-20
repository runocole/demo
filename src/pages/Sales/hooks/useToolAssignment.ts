// src/pages/Sales/hooks/useToolAssignment.ts
import { useState } from 'react';
import { api } from '../utils/api';
import { extractAllSerialsFromTool } from '../utils/serialHelpers';
import type { AssignmentResult, CurrentItem } from '../types';

const useToolAssignment = () => {
  const [assignmentResult, setAssignmentResult] = useState<AssignmentResult | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const assignRandomTool = async (currentItem: CurrentItem): Promise<any> => {
    if (!currentItem.selectedTool) {
      throw new Error("No tool selected");
    }

    setIsAssigning(true);
    try {
      console.log("Starting tool assignment for:", {
        tool_name: currentItem.selectedTool.name,
        category: currentItem.selectedCategory,
        equipment_type: currentItem.selectedEquipmentType
      });

      const response = await api.assignRandomTool(
        currentItem.selectedTool.name,
        currentItem.selectedCategory,
        currentItem.selectedEquipmentType
      );
      
      const initialResult = response.data;
      const completeToolData = await api.getTool(initialResult.assigned_tool_id);
      
      if (!completeToolData) {
        throw new Error("Failed to fetch complete tool data");
      }

      // 1. Extract all serials
      let { serialSet, dataloggerSerial, externalRadioSerial } = extractAllSerialsFromTool(
        completeToolData.data, 
        currentItem.selectedEquipmentType
      );

      // 2. Fallback to initial result if helper returned empty (safety net)
      if (serialSet.length === 0 && initialResult.serial_set?.length > 0) {
        serialSet = initialResult.serial_set;
        dataloggerSerial = dataloggerSerial || initialResult.datalogger_serial;
        externalRadioSerial = externalRadioSerial || initialResult.external_radio_serial; 
      }

      // --- STRICT VALIDATION: REJECT INCOMPLETE SETS ---
      if (currentItem.selectedEquipmentType === "Base & Rover Combo") {
        const missingReceivers = serialSet.length < 2;
        const missingDatalogger = !dataloggerSerial;
        const missingRadio = !externalRadioSerial;

        if (missingReceivers || missingDatalogger || missingRadio) {
           console.error("Assignment Rejected: Incomplete Set", { serialSet, dataloggerSerial, externalRadioSerial });
           throw new Error(
             `Inventory Error: The assigned set is incomplete. Missing: ${
               missingRadio ? 'External Radio' : missingDatalogger ? 'Datalogger' : 'Receiver'
             }. Please check stock or try again.`
           );
        }
      }
      // --------------------------------------------------

      const finalResult = {
        assigned_tool_id: initialResult.assigned_tool_id,
        tool_name: initialResult.tool_name,
        serial_set: serialSet,
        serial_count: serialSet.length,
        set_type: currentItem.selectedEquipmentType || initialResult.set_type,
        cost: initialResult.cost,
        datalogger_serial: dataloggerSerial,
        external_radio_serial: externalRadioSerial,
        invoice_number: initialResult.invoice_number,
        import_invoice: completeToolData.data.invoice_number
      };

      setAssignmentResult({
        open: true,
        toolName: finalResult.tool_name,
        serialSet: finalResult.serial_set,
        serialCount: finalResult.serial_count,
        setType: finalResult.set_type,
        assignedToolId: finalResult.assigned_tool_id,
        dataloggerSerial: finalResult.datalogger_serial,
        externalRadioSerial: finalResult.external_radio_serial,
        invoiceNumber: finalResult.invoice_number,
        importInvoice: finalResult.import_invoice
      });

      return finalResult;

    } catch (error: any) {
      console.error("Error assigning random tool:", error);
      // Pass the specific validation error message to the UI
      if (error.message.includes("Inventory Error")) {
        throw error; 
      }
      if (error.response?.status === 404) {
        throw new Error(error.response.data.error || "No complete equipment sets available in stock");
      }
      throw new Error("Failed to assign equipment set from inventory");
    } finally {
      setIsAssigning(false);
    }
  };

  const clearAssignment = () => {
    setAssignmentResult(null);
  };

  return {
    assignmentResult,
    isAssigning,
    assignRandomTool,
    clearAssignment
  };
};

export { useToolAssignment };