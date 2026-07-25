import React, { useState } from 'react';
import { MarketAsset } from '../types';
import { BentoCard } from './BentoCard';
import { Sparkline } from './Sparkline';
import { formatTL, formatPercent } from '../utils/calculators';
import { Coins, ArrowUpRight, ArrowDownRight, Gem } from 'lucide-react';

interface AltinPanelProps {
  metals: MarketAsset[];
  onSelectAsset: (name: string) => void;
}

export const AltinPanel: React.FC<AltinPanelProps> = ({ metals, onSelectAsset }) => {
  const [laborPercent, setLaborPercent] = useState<number>(3.0); // %3 Labor cost / Kuyumcu farkı
  const [gramAmount, setGramAmount] = useState<number>(50);

  const gramAltin = metals.find((m) => m.id === 'gram_altin') || metals[0];

  return (
    <div className="space-y-6">
      {/* Metals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metals.map((metal) => {
          const isUp = metal.change >= 0;
          return (
            <BentoCard
              key={metal.id}
              onClick={() => onSelectAsset(metal.name)}
              className="group"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-mono text-slate-400 block">{metal.name}</span>
                  <div className="text-2xl font-mono font-bold text-amber-400 mt-1">
                    {formatTL(metal.value)} <span className="text-xs text-slate-400">{metal.unit}</span>
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
                  {formatPercent(metal.change)}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <div className="text-[11px] font-mono text-slate-500">
                  Sembol: <span className="text-slate-300 font-bold">{metal.code}</span>
                </div>
                <Sparkline data={metal.sparkline} isPositive={isUp} width={90} height={28} />
              </div>
            </BentoCard>
          );
        })}
      </div>

      {/* Jewelry Labor & Buyback Estimator */}
      <BentoCard
        title={
          <span className="flex items-center gap-2">
            <Gem className="w-4 h-4 text-amber-400" />
            KUYUMCU İŞÇİLİK & BOZDURMA MAKASI SİMÜLATÖRÜ
          </span>
        }
        subtitle="Gram altın bazında fiziki altın alma / bozdurma ve işçilik maliyeti tahmini"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Tahmini Kuyumcu Kar/İşçilik Payı (%)
              </label>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.5"
                value={laborPercent}
                onChange={(e) => setLaborPercent(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-amber-400 font-bold mt-1">
                <span>%1.0 (Has Altın / Paket)</span>
                <span>%{laborPercent.toFixed(1)}</span>
                <span>%10.0 (Bilezik / Takı)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Altın Miktarı (Gram)
              </label>
              <input
                type="number"
                value={gramAmount}
                onChange={(e) => setGramAmount(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
              />
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-[11px] font-mono text-slate-500 block">SERBEST PİYASA (HAS)</span>
              <div className="text-sm font-mono font-bold text-slate-200 mt-1">
                {formatTL(gramAltin.value * gramAmount)} TL
              </div>
              <span className="text-[10px] font-mono text-slate-500">Saf değer</span>
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-500 block">ESTIMATED KUYUMCU ALIŞ</span>
              <div className="text-sm font-mono font-bold text-emerald-400 mt-1">
                {formatTL(gramAltin.value * (1 - laborPercent / 100) * gramAmount)} TL
              </div>
              <span className="text-[10px] font-mono text-slate-500">Kuyumcuya satarken</span>
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-500 block">ESTIMATED KUYUMCU SATIŞ</span>
              <div className="text-sm font-mono font-bold text-amber-400 mt-1">
                {formatTL(gramAltin.value * (1 + laborPercent / 100) * gramAmount)} TL
              </div>
              <span className="text-[10px] font-mono text-slate-500">Kuyumcudan alırken</span>
            </div>
          </div>
        </div>
      </BentoCard>
    </div>
  );
};
