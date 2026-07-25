import React from 'react';
import { MarketAsset, StockItem } from '../types';
import { Sparkline } from './Sparkline';
import { formatTL, formatPercent } from '../utils/calculators';
import { X, ArrowUpRight, ArrowDownRight, TrendingUp, BarChart2 } from 'lucide-react';

interface AssetDetailModalProps {
  assetName: string | null;
  onClose: () => void;
  allAssets: Array<MarketAsset | (StockItem & { id: string; category: string; value: number; unit: string })>;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  assetName,
  onClose,
  allAssets,
}) => {
  if (!assetName) return null;

  const asset = allAssets.find((a) => a.name === assetName || a.code === assetName);
  if (!asset) return null;

  const isUp = asset.change >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">VARLIK DETAYI</span>
            <h3 className="text-2xl font-space font-bold text-slate-100 mt-1">{asset.name}</h3>
            {asset.code && <span className="text-xs font-mono text-amber-400 font-bold">{asset.code}</span>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Value Box */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
          <div>
            <span className="text-xs font-mono text-slate-500 block">ANLIK FİYAT</span>
            <div className="text-3xl font-mono font-bold text-slate-100 mt-1">
              {formatTL(asset.value)} <span className="text-sm font-normal text-slate-400">{asset.unit || 'TL'}</span>
            </div>
          </div>

          <div
            className={`flex items-center gap-1 text-sm font-mono font-bold px-3 py-1 rounded-lg ${
              isUp
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {formatPercent(asset.change)}
          </div>
        </div>

        {/* Trend Graph */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
          <span className="text-xs font-mono text-slate-400 block">7 GÜNLÜK FİYAT TRENDİ</span>
          <div className="pt-2 flex justify-center">
            <Sparkline data={asset.sparkline} isPositive={isUp} width={380} height={80} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <span className="text-slate-500 block text-[11px]">24S EN YÜKSEK</span>
            <span className="text-slate-200 font-bold mt-0.5 block">
              {formatTL(asset.high24h || asset.high || asset.value * 1.02)} {asset.unit || 'TL'}
            </span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <span className="text-slate-500 block text-[11px]">24S EN DÜŞÜK</span>
            <span className="text-slate-200 font-bold mt-0.5 block">
              {formatTL(asset.low24h || asset.low || asset.value * 0.98)} {asset.unit || 'TL'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-space font-bold text-xs"
        >
          Kapat
        </button>
      </div>
    </div>
  );
};
