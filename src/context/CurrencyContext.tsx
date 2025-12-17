import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Define the shape of our context
type CurrencyContextType = {
  currentCurrency: string;
  exchangeRate: number;
  setCurrency: (currency: string) => void;
  getConvertedPrice: (price: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currentCurrency, setCurrency] = useState("USD");
  const exchangeRate = 1450; 

  // Centralized math logic
  const getConvertedPrice = (usdPrice: number): string => {
    if (currentCurrency === 'NGN') {
      const ngnPrice = usdPrice * exchangeRate;
      return `₦${ngnPrice.toLocaleString('en-NG')}`;
    }
    return `$${usdPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currentCurrency, exchangeRate, setCurrency, getConvertedPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

// The Custom Hook
export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}