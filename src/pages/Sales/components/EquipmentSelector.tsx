// src/pages/Sales/components/EquipmentSelector.tsx
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { TOOL_CATEGORIES } from "../types";
import type { GroupedTool, CurrentItem } from "../types";

interface EquipmentSelectorProps {
  currentItem: CurrentItem;
  groupedTools: GroupedTool[];
  filteredGroupedTools: GroupedTool[];
  onCategoryChange: (category: string) => void;
  onToolSelect: (toolName: string) => void;
  onCostChange: (cost: string) => void;
  onAddItem: () => void;
  isAddDisabled: boolean;
}

const EquipmentSelector = ({
  currentItem,
  groupedTools,
  filteredGroupedTools,
  onCategoryChange,
  onToolSelect,
  onCostChange,
  onAddItem,
  isAddDisabled
}: EquipmentSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-slate-800 rounded-lg border border-slate-700">
      <div className="md:col-span-4">
        <Label className="text-white">Equipment Category</Label>
        <Select
          value={currentItem.selectedCategory}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 text-white border-slate-600">
            {TOOL_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category} className="hover:bg-slate-700">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {currentItem.selectedCategory === "Receiver" && currentItem.selectedEquipmentType && (
          <div className="mt-2 p-2 bg-blue-900/30 rounded border border-blue-700">
            <p className="text-sm text-blue-300">
              Type: <span className="font-semibold">{currentItem.selectedEquipmentType}</span>
            </p>
          </div>
        )}
      </div>

      <div className="md:col-span-4">
        <Label className="text-white">Select Equipment</Label>
        <Select
          value={currentItem.selectedTool?.name || ""}
          onValueChange={onToolSelect}
          disabled={!currentItem.selectedCategory || (currentItem.selectedCategory === "Receiver" && !currentItem.selectedEquipmentType)}
        >
          <SelectTrigger className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
            <SelectValue 
              placeholder={
                currentItem.selectedCategory === "Receiver" && !currentItem.selectedEquipmentType
                  ? "Select equipment type first"
                  : currentItem.selectedCategory
                  ? `Select ${currentItem.selectedCategory}`
                  : "Select category first"
              } 
            />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 text-white border-slate-600">
            {filteredGroupedTools.map((tool) => (
              <SelectItem key={tool.group_id} value={tool.name} className="hover:bg-slate-700">
                <div className="flex justify-between items-center w-full">
                  <span>{tool.name}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    Stock: {tool.total_stock}
                  </span>
                </div>
              </SelectItem>
            ))}
            {filteredGroupedTools.length === 0 && currentItem.selectedCategory && (
              <SelectItem value="no-tools" disabled>
                No equipment found for selected criteria
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {currentItem.selectedTool && (
          <div className="mt-1 space-y-1">
            <p className="text-xs text-gray-400">
              {currentItem.selectedTool.total_stock} complete sets available
            </p>
            {currentItem.selectedTool.invoice_number && (
              <p className="text-xs text-blue-400">
                Import Invoice: {currentItem.selectedTool.invoice_number}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="md:col-span-3">
        <Label className="text-white">Selling Price (₦)</Label>
        <Input
          type="number"
          value={currentItem.cost}
          onChange={(e) => onCostChange(e.target.value)}
          className="bg-slate-700 text-white border-slate-600 placeholder-gray-400"
          placeholder="Enter Selling Price"
          disabled={!currentItem.selectedTool}
        />
      </div>

      <div className="md:col-span-1">
        <Button
          onClick={onAddItem}
          disabled={isAddDisabled}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export { EquipmentSelector };