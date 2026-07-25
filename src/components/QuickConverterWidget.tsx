import React, { useState } from 'react';
import { MarketAsset } from '../types';
import { formatTL } from '../utils/calculators';
import { ArrowRightLeft, Calculator } from 'lucide-react';

interface QuickConverterWidgetProps {
  currencies: MarketAsset[];
  metals: MarketAsset[];
  crypto: MarketAsset[];
}

export const QuickConverterWidget: React.FC<QuickConverterWidgetProps> = ({
  currencies,
  metals,
  crypto,
}) => {
  const [amount, setAmount] = useState<number>(1000);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('usd_try');
  const [direction, setDirection] = useState<'BUY' | 'SELL'>('BUY'); // BUY = Asset -> TL, SELL = TL -> Asset

  const allAssets = [...currencies, ...metals, ...crypto];
  const currentAsset = allAssets.find((a) => a.id === selectedAssetId) || currencies[0];

  // Calculate conversion
  let resultValue = 0;
  if (currentAsset) {
    if (direction === 'BUY') {
      resultValue = amount * currentAsset.value;
    } else {
      resultValue = currentAsset.value > 0 ? amount / currentAsset.value : 0;
    }
  }

  return (
    <div className="space-y-4">
      {/* Selector & Direction Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-5">
          <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Varlık Seçin
          </label>
          <select
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <optgroup label="Döviz">
              {currencies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code}) - {formatTL(c.value, 4)} TL
                </option>
              ))}
            </optgroup>
            <optgroup label="Altın & Maden">
              {metals.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {formatTL(m.value)} {m.unit}
                </option>
              ))}
            </optgroup>
            <optgroup label="Kripto">
              {crypto.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name} - ${formatTL(k.value, 0)}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="sm:col-span-2 flex justify-center pt-3 sm:pt-4">
          <button
            onClick={() => setDirection(direction === 'BUY' ? 'SELL' : 'BUY')}
            className="p-2 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-amber-400 border border-slate-700 transition-colors"
            title="Yön Değiştir"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="sm:col-span-5">
          <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            {direction === 'BUY' ? `Miktar (${currentAsset?.code || currentAsset?.name})` : 'Miktar (TL)'}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            min="0"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Result Display Box */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-slate-400 block uppercase">
            {direction === 'BUY' ? 'TL Karşılığı' : `${currentAsset?.name} Karşılığı`}
          </span>
          <div className="text-xl font-mono font-bold text-amber-400 mt-1">
            {direction === 'BUY'
              ? `${formatTL(resultValue)} TL`
              : `${formatTL(resultValue, currentAsset.category === 'kripto' ? 4 : 2)} ${currentAsset.unit}`}
          </div>
        </div>

        <div className="text-right font-mono text-xs text-slate-500">
          <div>Birim Fiyat:</div>
          <div className="text-slate-300 font-medium">
            1 {currentAsset.code || currentAsset.name} = {formatTL(currentAsset.value, currentAsset.value < 10 ? 4 : 2)} {currentAsset.unit}
          </div>
        </div>
      </div>
    </div>
  );
};
