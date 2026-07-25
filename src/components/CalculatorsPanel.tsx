import React, { useState } from 'react';
import { BentoCard } from './BentoCard';
import {
  calculateLoan,
  calculateSalary2026,
  calculateDeposit,
  formatTL
} from '../utils/calculators';
import {
  Calculator,
  Building,
  Briefcase,
  Percent,
  Calendar,
  ChevronDown,
  ChevronUp,
  Table,
  HelpCircle,
  PiggyBank
} from 'lucide-react';

export const CalculatorsPanel: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<'kredi' | 'maas' | 'mevduat'>('kredi');

  // Kredi State
  const [loanType, setLoanType] = useState<string>('ihtiyac');
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [loanTerm, setLoanTerm] = useState<number>(24);
  const [loanRate, setLoanRate] = useState<number>(3.5);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  // Maaş State
  const [grossSalary, setGrossSalary] = useState<number>(65000);

  // Mevduat State
  const [depositAmount, setDepositAmount] = useState<number>(250000);
  const [depositDays, setDepositDays] = useState<number>(32);
  const [depositRate, setDepositRate] = useState<number>(48.0);

  // Defaults when type changes
  const handleLoanTypeChange = (type: string) => {
    setLoanType(type);
    if (type === 'konut') setLoanRate(1.6);
    else if (type === 'tasit') setLoanRate(3.0);
    else setLoanRate(3.5);
  };

  const loanResult = calculateLoan(loanType, loanAmount, loanTerm, loanRate);
  const salaryResult = calculateSalary2026(grossSalary);
  const depositResult = calculateDeposit(depositAmount, depositDays, depositRate);

  return (
    <div className="space-y-6">
      {/* Calculator Mode Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl max-w-xl">
        <button
          onClick={() => setActiveCalc('kredi')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-space text-xs font-bold transition-all ${
            activeCalc === 'kredi'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Kredi Taksit</span>
        </button>

        <button
          onClick={() => setActiveCalc('maas')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-space text-xs font-bold transition-all ${
            activeCalc === 'maas'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Brütten Nete Maaş (2026)</span>
        </button>

        <button
          onClick={() => setActiveCalc('mevduat')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-space text-xs font-bold transition-all ${
            activeCalc === 'mevduat'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PiggyBank className="w-4 h-4" />
          <span>Mevduat Getirisi</span>
        </button>
      </div>

      {/* CALC 1: KREDI */}
      {activeCalc === 'kredi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <BentoCard className="lg:col-span-5" title="KREDİ PARAMETRELERİ">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Kredi Türü
                </label>
                <select
                  value={loanType}
                  onChange={(e) => handleLoanTypeChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="ihtiyac">İhtiyaç Kredisi (KKDF %15 + BSMV %15)</option>
                  <option value="konut">Konut Kredisi (Vergisiz)</option>
                  <option value="tasit">Taşıt Kredisi (KKDF %15 + BSMV %5)</option>
                  <option value="ticari">Ticari Kredi (BSMV %5)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Kredi Tutarı (TL)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
                  step="1000"
                  min="1000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Vade (Ay)
                </label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value) || 1)}
                  min="1"
                  max="360"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Aylık Faiz Oranı (%)
                </label>
                <input
                  type="number"
                  value={loanRate}
                  onChange={(e) => setLoanRate(Number(e.target.value) || 0)}
                  step="0.01"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </BentoCard>

          {/* Results Bento */}
          <BentoCard className="lg:col-span-7" title="ÖDEME PLANIZ & ÖZET">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs font-mono text-slate-500 block">AYLIK TAKSİT</span>
                  <div className="text-xl font-mono font-bold text-amber-400 mt-1">
                    {formatTL(loanResult.monthlyPayment)} TL
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs font-mono text-slate-500 block">TOPLAM GERİ ÖDEME</span>
                  <div className="text-xl font-mono font-bold text-slate-100 mt-1">
                    {formatTL(loanResult.totalPayment)} TL
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs font-mono text-slate-500 block">TOPLAM FAİZ & VERGİ YÜKÜ</span>
                  <div className="text-xl font-mono font-bold text-rose-400 mt-1">
                    {formatTL(loanResult.totalInterest)} TL
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowAmortization(!showAmortization)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition-all"
                >
                  <Table className="w-4 h-4 text-amber-400" />
                  <span>{showAmortization ? 'Amortisman Tablosunu Gizle' : 'Aylık Amortisman Tablosunu Göster'}</span>
                  {showAmortization ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Schedule Table */}
              {showAmortization && (
                <div className="max-h-72 overflow-y-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800">
                      <tr>
                        <th className="p-2">Ay</th>
                        <th className="p-2 text-right">Taksit</th>
                        <th className="p-2 text-right">Anapara</th>
                        <th className="p-2 text-right">Faiz</th>
                        <th className="p-2 text-right">Vergiler</th>
                        <th className="p-2 text-right">Kalan Borç</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 bg-slate-900/40">
                      {loanResult.schedule.map((row) => (
                        <tr key={row.month} className="hover:bg-slate-800/30">
                          <td className="p-2 font-bold text-slate-300">{row.month}</td>
                          <td className="p-2 text-right text-amber-400 font-bold">{formatTL(row.payment)}</td>
                          <td className="p-2 text-right text-emerald-400">{formatTL(row.principal)}</td>
                          <td className="p-2 text-right text-slate-300">{formatTL(row.interest)}</td>
                          <td className="p-2 text-right text-rose-400">{formatTL(row.kkdf + row.bsmv)}</td>
                          <td className="p-2 text-right text-slate-400">{formatTL(row.remainingPrincipal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </BentoCard>
        </div>
      )}

      {/* CALC 2: MAAS */}
      {activeCalc === 'maas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <BentoCard className="lg:col-span-4" title="2026 BRÜT MAAŞ GİRİŞİ">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Aylık Brüt Maaş (TL)
                </label>
                <input
                  type="number"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(Number(e.target.value) || 0)}
                  step="500"
                  min="0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono space-y-2 text-slate-400">
                <div className="flex justify-between">
                  <span>SGK İşçi Payı (%14):</span>
                  <span className="text-slate-200 font-bold">-{formatTL(grossSalary * 0.14)} TL</span>
                </div>
                <div className="flex justify-between">
                  <span>İşsizlik Sigortası (%1):</span>
                  <span className="text-slate-200 font-bold">-{formatTL(grossSalary * 0.01)} TL</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span>Gelir Vergisi Matrahı:</span>
                  <span className="text-amber-400 font-bold">{formatTL(grossSalary * 0.85)} TL</span>
                </div>
              </div>

              <p className="text-[11px] font-mono text-slate-500 leading-relaxed">
                * 2026 asgari ücret istisnası (aylık 33.030 TL brüt eşdeğeri) otomatik olarak uygulanmıştır.
              </p>
            </div>
          </BentoCard>

          <BentoCard className="lg:col-span-8" title="12 AYLIK NET MAAŞ & VERGİ DİLİMİ GEÇİŞ TABLOSU">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[11px] font-mono text-slate-500 block">OCAK NET MAAŞ (İLK AY)</span>
                  <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
                    {formatTL(salaryResult.firstMonthNet)} TL
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[11px] font-mono text-slate-500 block">YILLIK AYLIK ORTALAMA NET</span>
                  <div className="text-lg font-mono font-bold text-amber-400 mt-1">
                    {formatTL(salaryResult.yearAverageNet)} TL
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-[11px] font-mono text-slate-500 block">YILLIK TOPLAM NET ELE GEÇEN</span>
                  <div className="text-lg font-mono font-bold text-slate-100 mt-1">
                    {formatTL(salaryResult.yearlyTotalNet)} TL
                  </div>
                </div>
              </div>

              {/* 12 Month Table */}
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="p-2.5">Ay</th>
                      <th className="p-2.5 text-right">Kümülatif Matrah</th>
                      <th className="p-2.5 text-center">Vergi Dilimi</th>
                      <th className="p-2.5 text-right">Net Gelir Vergisi</th>
                      <th className="p-2.5 text-right font-bold">NET MAAŞ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 bg-slate-900/40">
                    {salaryResult.months.map((m) => (
                      <tr key={m.monthName} className="hover:bg-slate-800/30">
                        <td className="p-2.5 font-bold text-slate-200">{m.monthName}</td>
                        <td className="p-2.5 text-right text-slate-400">{formatTL(m.cumulativeBase)} TL</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                            %{(m.taxBracketRate * 100).toFixed(0)}
                          </span>
                        </td>
                        <td className="p-2.5 text-right text-rose-400">-{formatTL(m.netIncomeTax)} TL</td>
                        <td className="p-2.5 text-right font-bold text-emerald-400">{formatTL(m.netSalary)} TL</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </BentoCard>
        </div>
      )}

      {/* CALC 3: MEVDUAT */}
      {activeCalc === 'mevduat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <BentoCard className="lg:col-span-5" title="MEVDUAT & REPO HESAPLAMA">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Yatırılacak Anapara (TL)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value) || 0)}
                  step="5000"
                  min="1000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Vade Süresi (Gün)
                </label>
                <input
                  type="number"
                  value={depositDays}
                  onChange={(e) => setDepositDays(Number(e.target.value) || 1)}
                  min="1"
                  max="730"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Yıllık Brüt Faiz Oranı (%)
                </label>
                <input
                  type="number"
                  value={depositRate}
                  onChange={(e) => setDepositRate(Number(e.target.value) || 0)}
                  step="0.5"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </BentoCard>

          <BentoCard className="lg:col-span-7" title="NET GETİRİ & STOPAJ KESİNTİSİ ÖZETİ">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs font-mono text-slate-500 block">BRÜT FAİZ GETİRİSİ</span>
                  <div className="text-lg font-mono font-bold text-slate-200 mt-1">
                    {formatTL(depositResult.grossInterest)} TL
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs font-mono text-slate-500 block">STOPAJ KESİNTİSİ (%{depositResult.withholdingTaxRate})</span>
                  <div className="text-lg font-mono font-bold text-rose-400 mt-1">
                    -{formatTL(depositResult.withholdingTaxAmount)} TL
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs font-mono text-slate-500 block">NET FAİZ GETİRİSİ</span>
                  <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
                    +{formatTL(depositResult.netInterest)} TL
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-xs font-mono text-slate-400 block">VADE SONU TOPLAM ELE GEÇEN TUTAR</span>
                  <div className="text-2xl font-mono font-bold text-amber-400 mt-1">
                    {formatTL(depositResult.totalPayout)} TL
                  </div>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  {depositResult.days} Günlük
                </span>
              </div>
            </div>
          </BentoCard>
        </div>
      )}
    </div>
  );
};
