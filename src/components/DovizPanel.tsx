import React, { useState } from 'react';
import { MarketAsset } from '../types';
import { BentoCard } from './BentoCard';
import { Sparkline } from './Sparkline';
import { formatTL, formatPercent } from '../utils/calculators';
import { DollarSign, ArrowUpRight, ArrowDownRight, Building2, HelpCircle } from 'lucide-react';

interface DovizPanelProps {
  currencies: MarketAsset[];
  onSelectAsset: (name: string) => void;
}

export const DovizPanel: React.FC<DovizPanelProps> = ({ currencies, onSelectAsset }) => {
  const [bankSpreadPercent, setBankSpreadPercent] = useState<number>(1.5); // %1.5 Bank spread
  const [testAmount, setTestAmount] = useState<number>(1000);

  const usd = currencies.find((c) => c.id === 'usd_try') || currencies[0];
  const eur = currencies.find((c) => c.id === 'eur_try') || currencies[1];

  return (
    <div className="space-y-6">
      {/* Top Cards: Currencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currencies.map((curr) => {
          const isUp = curr.change >= 0;
          return (
            <BentoCard
              key={curr.id}
              onClick={() => onSelectAsset(curr.name)}
              className="group"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-mono text-slate-400 block">{curr.name}</span>
                  <div className="text-2xl font-mono font-bold text-slate-100 mt-1">
                    {formatTL(curr.value, curr.value < 10 ? 4 : 4)} <span className="text-xs text-slate-400">{curr.unit}</span>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isUp
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {formatPercent(curr.change)}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <div className="text-[11px] font-mono text-slate-500">
                  Kod: <span className="text-slate-300 font-bold">{curr.code}</span>
                </div>
                <Sparkline data={curr.sparkline} isPositive={isUp} width={90} height={28} />
              </div>
            </BentoCard>
          );
        })}
      </div>

      {/* Bank Spread & Free Market Difference Simulator */}
      <BentoCard
        title={
          <span className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            BANKA ALIŞ / SATIŞ & MAKAS HESAPLAYICI
          </span>
        }
        subtitle="Serbest piyasa gösterge kuru ile bankalar arasındaki ortalama makas farkı simülasyonu"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Tahmini Banka Makas Oranı (%)
              </label>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={bankSpreadPercent}
                onChange={(e) => setBankSpreadPercent(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-amber-400 font-bold mt-1">
                <span>%0.5 (Düşük Makas)</span>
                <span>%{bankSpreadPercent.toFixed(1)}</span>
                <span>%5.0 (Yüksek Makas)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Döviz Tutarı (USD)
              </label>
              <input
                type="number"
                value={testAmount}
                onChange={(e) => setTestAmount(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
              />
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-[11px] font-mono text-slate-500 block">SERBEST PİYASA (GÖSTERGE)</span>
              <div className="text-sm font-mono font-bold text-slate-200 mt-1">
                {formatTL(usd.value * testAmount)} TL
              </div>
              <span className="text-[10px] font-mono text-slate-500">Kambiyo vergisiz</span>
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-500 block">ESTIMATED BANKA ALIŞ</span>
              <div className="text-sm font-mono font-bold text-emerald-400 mt-1">
                {formatTL(usd.value * (1 - bankSpreadPercent / 100) * testAmount)} TL
              </div>
              <span className="text-[10px] font-mono text-slate-500">Bankaya satarsanız</span>
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-500 block">ESTIMATED BANKA SATIŞ</span>
              <div className="text-sm font-mono font-bold text-rose-400 mt-1">
                {formatTL(usd.value * (1 + bankSpreadPercent / 100) * testAmount)} TL
              </div>
              <span className="text-[10px] font-mono text-slate-500">Bankadan alırsanız</span>
            </div>
          </div>
        </div>
      </BentoCard>
    </div>
  );
};
