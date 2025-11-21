// types/currency.ts
export type CurrencyType = 'USD' | 'NGN';

export interface ExchangeRateData {
  rate: number;
  lastUpdated: string;
}