import React, { useState } from 'react';
import { MarketAsset, StockItem, PortfolioItem } from '../types';
import { BentoCard } from './BentoCard';
import { formatTL, formatPercent } from '../utils/calculators';
import {
  PieChart,
  Plus,
  Trash2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from 'lucide-react';

interface PortfolioPanelProps {
  currencies: MarketAsset[];
  metals: MarketAsset[];
  stocks: StockItem[];
  crypto: MarketAsset[];
  portfolio: PortfolioItem[];
  onAddPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => void;
  onRemovePortfolioItem: (id: string) => void;
}

export const PortfolioPanel: React.FC<PortfolioPanelProps> = ({
  currencies,
  metals,
  stocks,
  crypto,
  portfolio,
  onAddPortfolioItem,
  onRemovePortfolioItem,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedAssetKey, setSelectedAssetKey] = useState('gram_altin');
  const [amount, setAmount] = useState<number>(10);
  const [buyPrice, setBuyPrice] = useState<number>(5800);
  const [notes, setNotes] = useState<string>('');

  const allAssets = [
    ...currencies.map((c) => ({ id: c.id, name: c.name, price: c.value, unit: c.unit, category: 'Döviz' })),
    ...metals.map((m) => ({ id: m.id, name: m.name, price: m.value, unit: m.unit, category: 'Altın' })),
    ...stocks.map((s) => ({ id: s.code, name: `${s.code} - ${s.name}`, price: s.price, unit: 'TL', category: 'BIST' })),
    ...crypto.map((k) => ({ id: k.id, name: `${k.code} (${k.name})`, price: k.value, unit: '$', category: 'Kripto' })),
  ];

  // Get current price of an asset
  const getCurrentPrice = (assetId: string) => {
    const found = allAssets.find((a) => a.id === assetId);
    if (!found) return 0;
    // If USD price for crypto, multiply by USD/TRY
    if (found.unit === '$') {
      const usdTry = currencies.find((c) => c.id === 'usd_try')?.value || 47.35;
      return found.price * usdTry;
    }
    return found.price;
  };

  // Calculate total portfolio values
  let totalCostTL = 0;
  let totalCurrentValTL = 0;

  const portfolioWithMetrics = portfolio.map((item) => {
    const currentPrice = getCurrentPrice(item.assetId);
    const totalCost = item.amount * item.buyPrice;
    const currentVal = item.amount * currentPrice;
    const profitTL = currentVal - totalCost;
    const profitPct = totalCost > 0 ? (profitTL / totalCost) * 100 : 0;

    totalCostTL += totalCost;
    totalCurrentValTL += currentVal;

    return {
      ...item,
      currentPrice,
      totalCost,
      currentVal,
      profitTL,
      profitPct,
    };
  });

  const overallProfitTL = totalCurrentValTL - totalCostTL;
  const overallProfitPct = totalCostTL > 0 ? (overallProfitTL / totalCostTL) * 100 : 0;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assetObj = allAssets.find((a) => a.id === selectedAssetKey);
    if (!assetObj) return;

    onAddPortfolioItem({
      assetId: selectedAssetKey,
      assetName: assetObj.name,
      category: assetObj.category,
      amount,
      buyPrice,
      buyDate: new Date().toISOString().split('T')[0],
      notes,
    });

    setIsAdding(false);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BentoCard>
          <span className="text-xs font-mono text-slate-400 block">TOPLAM PORTFÖY DEĞERİ</span>
          <div className="text-3xl font-mono font-bold text-amber-400 mt-2">
            {formatTL(totalCurrentValTL)} <span className="text-sm font-normal text-slate-400">TL</span>
          </div>
          <span className="text-xs font-mono text-slate-500 mt-1 block">
            Mevcut piyasa kurlarıyla
          </span>
        </BentoCard>

        <BentoCard>
          <span className="text-xs font-mono text-slate-400 block">TOPLAM MALIYET (ALIS)</span>
          <div className="text-3xl font-mono font-bold text-slate-100 mt-2">
            {formatTL(totalCostTL)} <span className="text-sm font-normal text-slate-400">TL</span>
          </div>
          <span className="text-xs font-mono text-slate-500 mt-1 block">
            Varlık alış maliyetleri toplamı
          </span>
        </BentoCard>

        <BentoCard>
          <span className="text-xs font-mono text-slate-400 block">TOPLAM KAR / ZARAR</span>
          <div
            className={`text-3xl font-mono font-bold mt-2 flex items-center gap-2 ${
              overallProfitTL >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            <span>{formatTL(overallProfitTL)} TL</span>
            <span className="text-sm px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
              {formatPercent(overallProfitPct)}
            </span>
          </div>
          <span className="text-xs font-mono text-slate-500 mt-1 block">
            Realize edilmemiş anlık kar/zarar
          </span>
        </BentoCard>
      </div>

      {/* Main Portfolio List & Add Form */}
      <BentoCard
        title={
          <span className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-400" />
            VARLIK PORTFÖYÜM & YATIRIM TAKİBİ
          </span>
        }
        subtitle="Portföyünüzdeki Varlıkları Ekleyin ve Canlı Kar/Zarar Durumunu İzleyin"
        action={
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-space font-bold text-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Varlık Ekle</span>
          </button>
        }
      >
        {/* Add Form */}
        {isAdding && (
          <form onSubmit={handleAddSubmit} className="mb-6 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
            <h4 className="font-space font-bold text-sm text-amber-400">Yeni Varlık Ekle</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Varlık Seçin</label>
                <select
                  value={selectedAssetKey}
                  onChange={(e) => {
                    setSelectedAssetKey(e.target.value);
                    const p = getCurrentPrice(e.target.value);
                    if (p) setBuyPrice(Math.round(p * 100) / 100);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                >
                  {allAssets.map((a) => (
                    <option key={a.id} value={a.id}>
                      [{a.category}] {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Adet / Miktar</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  min="0.001"
                  step="any"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Alış Fiyatı (Birim TL)</label>
                <input
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(Number(e.target.value) || 0)}
                  min="0"
                  step="any"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Not (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="örn: Garanti bankasından alındı"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs font-mono"
              >
                Kaydet & Ekle
              </button>
            </div>
          </form>
        )}

        {/* Holdings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                <th className="pb-2">Varlık</th>
                <th className="pb-2">Kategori</th>
                <th className="pb-2 text-right">Miktar</th>
                <th className="pb-2 text-right">Alış Fiyatı</th>
                <th className="pb-2 text-right">Mevcut Fiyat</th>
                <th className="pb-2 text-right">Güncel Değer</th>
                <th className="pb-2 text-right">Kar / Zarar</th>
                <th className="pb-2 text-center">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {portfolioWithMetrics.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 italic">
                    Henüz portföyünüze varlık eklemediniz. Sağ üstteki "Varlık Ekle" butonuna basarak ekleyebilirsiniz.
                  </td>
                </tr>
              ) : (
                portfolioWithMetrics.map((item) => {
                  const isProfit = item.profitTL >= 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-bold text-slate-100">{item.assetName}</td>
                      <td className="py-3 text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-slate-200">{item.amount}</td>
                      <td className="py-3 text-right text-slate-400">{formatTL(item.buyPrice)} TL</td>
                      <td className="py-3 text-right font-bold text-slate-200">{formatTL(item.currentPrice)} TL</td>
                      <td className="py-3 text-right font-bold text-amber-400">{formatTL(item.currentVal)} TL</td>
                      <td className={`py-3 text-right font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatTL(item.profitTL)} TL ({formatPercent(item.profitPct)})
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => onRemovePortfolioItem(item.id)}
                          className="p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </BentoCard>
    </div>
  );
};
