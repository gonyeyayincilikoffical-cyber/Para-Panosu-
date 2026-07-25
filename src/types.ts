export type CategoryType = 'doviz' | 'altin' | 'bist' | 'kripto' | 'hesap' | 'portfoy';

export interface MarketAsset {
  id: string;
  name: string;
  code?: string;
  value: number;
  change: number; // percentage
  changeAmount?: number;
  unit: string;
  category: 'doviz' | 'altin' | 'bist' | 'kripto' | 'commodity';
  high24h?: number;
  low24h?: number;
  volume24h?: string;
  sparkline: number[];
  isFavorite?: boolean;
}

export interface StockItem {
  code: string;
  name: string;
  price: number;
  change: number;
  high: number;
  low: number;
  volume: string;
  sector: string;
  sparkline: number[];
  isFavorite?: boolean;
}

export interface PortfolioItem {
  id: string;
  assetId: string;
  assetName: string;
  category: string;
  amount: number;
  buyPrice: number;
  buyDate: string;
  notes?: string;
}

export interface PriceAlert {
  id: string;
  assetId: string;
  assetName: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  createdAt: string;
  active: boolean;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  kkdf: number;
  bsmv: number;
  remainingPrincipal: number;
}

export interface LoanResult {
  loanType: string;
  amount: number;
  termMonths: number;
  monthlyRate: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: AmortizationRow[];
}

export interface SalaryMonth {
  monthName: string;
  gross: number;
  sgkWorker: number;
  unemploymentWorker: number;
  cumulativeBase: number;
  taxBracketRate: number;
  incomeTaxBeforeExemption: number;
  incomeTaxExemption: number;
  netIncomeTax: number;
  stampTax: number;
  netSalary: number;
}

export interface SalaryResult {
  grossSalary: number;
  firstMonthNet: number;
  yearAverageNet: number;
  yearlyTotalGross: number;
  yearlyTotalNet: number;
  yearlyTotalTax: number;
  months: SalaryMonth[];
}

export interface DepositResult {
  amount: number;
  days: number;
  grossInterestRate: number;
  grossInterest: number;
  withholdingTaxRate: number;
  withholdingTaxAmount: number;
  netInterest: number;
  totalPayout: number;
}
