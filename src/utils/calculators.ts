import { AmortizationRow, LoanResult, SalaryResult, SalaryMonth, DepositResult } from '../types';

/**
 * Format currency or number with Turkish locale
 */
export function formatTL(num: number, digits = 2): string {
  if (isNaN(num) || num === null || num === undefined) return '0,00';
  return num.toLocaleString('tr-TR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatPercent(num: number, digits = 2): string {
  if (isNaN(num) || num === null || num === undefined) return '%0,00';
  const prefix = num > 0 ? '+' : '';
  return `${prefix}%${num.toLocaleString('tr-TR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

/**
 * Kredi Taksit & Amortisman Hesaplayıcı
 */
export function calculateLoan(
  loanType: string,
  amount: number,
  termMonths: number,
  monthlyRatePercent: number
): LoanResult {
  const r = monthlyRatePercent / 100;

  // Tax rates based on loan type (KKDF & BSMV)
  let kkdfRate = 0.15; // Consumer/İhtiyaç default
  let bsmvRate = 0.15;

  if (loanType === 'konut') {
    kkdfRate = 0.0;
    bsmvRate = 0.0;
  } else if (loanType === 'tasit') {
    kkdfRate = 0.15;
    bsmvRate = 0.05;
  } else if (loanType === 'ticari') {
    kkdfRate = 0.0;
    bsmvRate = 0.05;
  }

  // Effective monthly interest rate including tax surcharges
  const taxMultiplier = 1 + kkdfRate + bsmvRate;
  const effectiveMonthlyRate = r * taxMultiplier;

  let monthlyPayment = 0;
  if (effectiveMonthlyRate > 0) {
    monthlyPayment =
      (amount *
        (effectiveMonthlyRate * Math.pow(1 + effectiveMonthlyRate, termMonths))) /
      (Math.pow(1 + effectiveMonthlyRate, termMonths) - 1);
  } else {
    monthlyPayment = amount / termMonths;
  }

  const schedule: AmortizationRow[] = [];
  let remainingPrincipal = amount;
  let totalInterest = 0;

  for (let m = 1; m <= termMonths; m++) {
    const rawInterest = remainingPrincipal * r;
    const kkdf = rawInterest * kkdfRate;
    const bsmv = rawInterest * bsmvRate;
    const totalMonthInterestAndTax = rawInterest + kkdf + bsmv;

    let principalPayment = monthlyPayment - totalMonthInterestAndTax;
    if (m === termMonths) {
      principalPayment = remainingPrincipal;
    }

    remainingPrincipal = Math.max(0, remainingPrincipal - principalPayment);
    totalInterest += totalMonthInterestAndTax;

    schedule.push({
      month: m,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: rawInterest,
      kkdf,
      bsmv,
      remainingPrincipal,
    });
  }

  const totalPayment = monthlyPayment * termMonths;

  return {
    loanType,
    amount,
    termMonths,
    monthlyRate: monthlyRatePercent,
    monthlyPayment,
    totalPayment,
    totalInterest,
    schedule,
  };
}

/**
 * 2026 Brütten Nete Yıllık Maaş Hesaplayıcı (Tüm 12 Ay)
 */
export function calculateSalary2026(grossSalary: number): SalaryResult {
  const sgkRate = 0.14;
  const unemploymentRate = 0.01;
  const stampRate = 0.00759;
  const minWageGross2026 = 33030; // 2026 Minimum Wage benchmark
  const minWageTaxBase2026 = minWageGross2026 * (1 - sgkRate - unemploymentRate); // 28075.50

  const monthlySgk = grossSalary * sgkRate;
  const monthlyUnemployment = grossSalary * unemploymentRate;
  const monthlyTaxBase = grossSalary - monthlySgk - monthlyUnemployment;

  const minWageExemptionTaxMonthly = minWageTaxBase2026 * 0.15; // 4211.33 TL exemption
  const minWageExemptionStampMonthly = minWageGross2026 * stampRate;

  // 2026 Tax Brackets (Yıllık)
  const brackets = [
    { limit: 190000, rate: 0.15 },
    { limit: 400000, rate: 0.20 },
    { limit: 1500000, rate: 0.27 },
    { limit: 5300000, rate: 0.35 },
    { limit: Infinity, rate: 0.40 },
  ];

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  let cumulativeBase = 0;
  const months: SalaryMonth[] = [];
  let yearlyTotalNet = 0;
  let yearlyTotalTax = 0;

  for (let i = 0; i < 12; i++) {
    const prevCumulative = cumulativeBase;
    cumulativeBase += monthlyTaxBase;

    // Calculate tax for this month based on cumulative base transition
    const taxThisMonthBeforeExemption = calculateTaxBracketDelta(prevCumulative, cumulativeBase, brackets);
    const netIncomeTax = Math.max(0, taxThisMonthBeforeExemption - minWageExemptionTaxMonthly);

    const rawStamp = grossSalary * stampRate;
    const netStampTax = Math.max(0, rawStamp - minWageExemptionStampMonthly);

    const netSalary = grossSalary - monthlySgk - monthlyUnemployment - netIncomeTax - netStampTax;

    yearlyTotalNet += netSalary;
    yearlyTotalTax += netIncomeTax;

    // Effective bracket rate indicator
    const currentBracketRate = getBracketRate(cumulativeBase, brackets);

    months.push({
      monthName: monthNames[i],
      gross: grossSalary,
      sgkWorker: monthlySgk,
      unemploymentWorker: monthlyUnemployment,
      cumulativeBase,
      taxBracketRate: currentBracketRate,
      incomeTaxBeforeExemption: taxThisMonthBeforeExemption,
      incomeTaxExemption: minWageExemptionTaxMonthly,
      netIncomeTax,
      stampTax: netStampTax,
      netSalary,
    });
  }

  return {
    grossSalary,
    firstMonthNet: months[0].netSalary,
    yearAverageNet: yearlyTotalNet / 12,
    yearlyTotalGross: grossSalary * 12,
    yearlyTotalNet,
    yearlyTotalTax,
    months,
  };
}

function calculateTaxBracketDelta(
  prevCumulative: number,
  newCumulative: number,
  brackets: Array<{ limit: number; rate: number }>
): number {
  let tax = 0;
  let currentPos = prevCumulative;

  let lowerLimit = 0;
  for (const b of brackets) {
    const upperLimit = b.limit;
    if (newCumulative > lowerLimit && currentPos < upperLimit) {
      const startInThisBracket = Math.max(currentPos, lowerLimit);
      const endInThisBracket = Math.min(newCumulative, upperLimit);
      const amountInBracket = Math.max(0, endInThisBracket - startInThisBracket);
      tax += amountInBracket * b.rate;
      currentPos = endInThisBracket;
    }
    lowerLimit = upperLimit;
    if (currentPos >= newCumulative) break;
  }
  return tax;
}

function getBracketRate(cumulative: number, brackets: Array<{ limit: number; rate: number }>): number {
  let lower = 0;
  for (const b of brackets) {
    if (cumulative <= b.limit) return b.rate;
    lower = b.limit;
  }
  return 0.40;
}

/**
 * Mevduat / Repo Getiri Hesaplayıcı
 */
export function calculateDeposit(
  amount: number,
  days: number,
  annualGrossRatePercent: number
): DepositResult {
  const grossInterest = (amount * (annualGrossRatePercent / 100) * days) / 365;

  let withholdingRate = 0.075; // Default 7.5% for up to 6 months
  if (days > 180 && days <= 365) withholdingRate = 0.05;
  else if (days > 365) withholdingRate = 0.025;

  const withholdingTaxAmount = grossInterest * withholdingRate;
  const netInterest = grossInterest - withholdingTaxAmount;

  return {
    amount,
    days,
    grossInterestRate: annualGrossRatePercent,
    grossInterest,
    withholdingTaxRate: withholdingRate * 100,
    withholdingTaxAmount,
    netInterest,
    totalPayout: amount + netInterest,
  };
}
