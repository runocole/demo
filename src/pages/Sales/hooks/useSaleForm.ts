// src/pages/Sales/hooks/useSaleForm.ts
import { useState } from 'react';
import type { CurrentItem, SaleItem, SaleDetails, GroupedTool } from '../types';

const useSaleForm = () => {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [currentItem, setCurrentItem] = useState<CurrentItem>({
    selectedCategory: "",
    selectedEquipmentType: "",
    selectedTool: null,
    cost: ""
  });
  const [saleDetails, setSaleDetails] = useState<SaleDetails>({
    payment_plan: "",
    initial_deposit: "",
    payment_months: "",
    expiry_date: ""
  });

  const totalCost = saleItems.reduce((sum, item) => sum + parseFloat(item.cost || "0"), 0);

  const addItem = (item: SaleItem) => {
    setSaleItems(prev => [...prev, item]);
  };

  const removeItem = (index: number) => {
    setSaleItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateCurrentItem = (updates: Partial<CurrentItem>) => {
    setCurrentItem(prev => ({ ...prev, ...updates }));
  };

  const updateSaleDetails = (updates: Partial<SaleDetails>) => {
    setSaleDetails(prev => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setSaleItems([]);
    setCurrentItem({
      selectedCategory: "",
      selectedEquipmentType: "",
      selectedTool: null,
      cost: ""
    });
    setSaleDetails({
      payment_plan: "",
      initial_deposit: "",
      payment_months: "",
      expiry_date: "",
    });
  };

  return {
    saleItems,
    currentItem,
    saleDetails,
    totalCost,
    addItem,
    removeItem,
    updateCurrentItem,
    updateSaleDetails,
    resetForm
  };
};

export { useSaleForm };