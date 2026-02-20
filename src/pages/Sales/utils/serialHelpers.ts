// src/pages/Sales/utils/serialHelpers.ts
import type { Tool, SerialNumbers } from "../types";

export const isSerialNumbersObject = (serials: any): serials is SerialNumbers => {
  return serials && typeof serials === 'object' && !Array.isArray(serials);
};

// Update the return type to include externalRadioSerial
export const extractAllSerialsFromTool = (
  tool: Tool,
  expectedEquipmentType?: string
): { serialSet: string[]; dataloggerSerial?: string; externalRadioSerial?: string } => {
  
  const serialSet: string[] = [];
  let dataloggerSerial: string | undefined;
  let externalRadioSerial: string | undefined;

  console.log("Extracting serials from tool:", tool.serials, "expected:", expectedEquipmentType);

  // --- 1. HANDLE ARRAY FORMAT ---
  if (Array.isArray(tool.serials)) {
    const allSerials = tool.serials as string[];

    // A. Find Datalogger (Look for 'DL' or 'Data')
    dataloggerSerial = allSerials.find(s => 
      s.toUpperCase().includes('DL-') || 
      s.toUpperCase().includes('DATALOGGER')
    );

    // B. Find External Radio (Look for 'ER', 'Radio', or specific radio models)
    externalRadioSerial = allSerials.find(s => 
      s.toUpperCase().includes('ER-') || 
      s.toUpperCase().includes('RADIO') ||
      s.toUpperCase().includes('EXTERNAL')
    );

    // C. Find Receivers (Everything that isn't a DL or Radio)
    const receiverCandidates = allSerials.filter(s => s !== dataloggerSerial && s !== externalRadioSerial);

    if (expectedEquipmentType === "Base & Rover Combo") {
      // We expect 2 receivers
      if (receiverCandidates.length >= 1) serialSet.push(receiverCandidates[0]);
      if (receiverCandidates.length >= 2) serialSet.push(receiverCandidates[1]);
      
      // Fallback: If we didn't find specific DL/Radio tags, but we have enough items
      if (!dataloggerSerial && allSerials.length >= 3) dataloggerSerial = allSerials[2];
      if (!externalRadioSerial && allSerials.length >= 4) externalRadioSerial = allSerials[3];
    } 
    else if (expectedEquipmentType === "Base Only" || expectedEquipmentType === "Rover Only") {
      if (receiverCandidates.length >= 1) serialSet.push(receiverCandidates[0]);
    }
    else {
      // Default behavior
      serialSet.push(...receiverCandidates);
    }
  }

  // --- 2. HANDLE OBJECT FORMAT ---
  else if (tool.serials && typeof tool.serials === 'object') {
    const serialObj = tool.serials as any;

    // Helper to grab common keys
    const getVal = (...keys: string[]) => {
      for (const k of keys) {
        if (serialObj[k]) return serialObj[k];
      }
      return undefined;
    };

    // Extract Known Parts
    dataloggerSerial = getVal('data_logger', 'datalogger', 'dl');
    externalRadioSerial = getVal('external_radio', 'radio', 'externalRadio', 'er');

    if (expectedEquipmentType === "Base & Rover Combo") {
      // Try specific keys first
      if (serialObj.receiver1) serialSet.push(serialObj.receiver1);
      if (serialObj.receiver2) serialSet.push(serialObj.receiver2);

      // If no numbered keys, try splitting the main 'receiver' key
      if (serialSet.length === 0 && serialObj.receiver) {
        const parts = serialObj.receiver.split(',').map((s: string) => s.trim());
        serialSet.push(...parts); 
      }
    } 
    else {
      // Base Only, Rover Only, or Generic
      if (serialObj.receiver) serialSet.push(serialObj.receiver);
      if (serialObj.receiver1) serialSet.push(serialObj.receiver1);
    }
  }

  console.log("Final extracted:", { serialSet, dataloggerSerial, externalRadioSerial });
  return { serialSet, dataloggerSerial, externalRadioSerial };
};

const getSerialValue = (serials: any, key: string): string => {
  if (!serials) return '';
  if (isSerialNumbersObject(serials)) return serials[key] || '';
  // Simple array fallback logic for display helpers
  if (Array.isArray(serials)) {
    if (key === 'receiver1') return serials[0] || '';
    if (key === 'receiver2') return serials[1] || '';
  }
  return '';
};

export { getSerialValue };