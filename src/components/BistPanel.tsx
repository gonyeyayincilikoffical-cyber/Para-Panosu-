import React, { useState } from 'react';
import { MarketAsset, StockItem } from '../types';
import { BentoCard } from './BentoCard';
import { Sparkline } from './Sparkline';
import { formatTL, formatPercent } from '../utils/calculators';
import {
  BarChart3,
  Search,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';

interface BistPanelProps {
  indices: MarketAsset[];
  stocks: StockItem[];
  watchlist: string[];
  onToggleWatchlist: (code: string) => void;
  onSelectAsset: (name: string) => void;
}

export const BistPanel: React.FC<BistPanelProps> = ({
  indices,
  stocks,
  watchlist,
  onToggleWatchlist,
  onSelectAsset,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);

  // Extract unique sectors
  const sectors = ['ALL', ...Array.from(new Set(stocks.map((s) => s.sector)))];

  // Filter stocks
  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch =
      stock.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'ALL' || stock.sector === selectedSector;
    const matchesWatchlist = !showWatchlistOnly || watchlist.includes(stock.code);

    return matchesSearch && matchesSector && matchesWatchlist;
  });

  return (
    <div className="space-y-6">
      {/* Indices Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indices.map((idx) => {
          const isUp = idx.change >= 0;
          return (
            <BentoCard key={idx.id} onClick={() => onSelectAsset(idx.name)}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-mono text-slate-400 block">{idx.name} ({idx.code})</span>
                  <div className="text-2xl font-mono font-bold text-slate-100 mt-1">
                    {formatTL(idx.value)} <span className="text-xs text-slate-400">Puan</span>
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
                  {formatPercent(idx.change)}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">24s Hacim: {idx.volume24h}</span>
                <Sparkline data={idx.sparkline} isPositive={isUp} width={80} height={24} />
              </div>
            </BentoCard>
          );
        })}
      </div>

      {/* Stock Table Bento */}
      <BentoCard
        title={
          <span className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-400" />
            BORSA İSTANBUL HİSSE TAKİP LİSTESİ
          </span>
        }
        subtitle="Hisse Fiyatları, Günlük Değişim ve Günlük Aralık Göstergesi"
      >
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative w-full max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Hisse kodu veya şirket ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec === 'ALL' ? 'Tüm Sektörler' : sec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowWatchlistOnly(!showWatchlistOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              showWatchlistOnly
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showWatchlistOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Favorilerim ({watchlist.length})</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                <th className="pb-2 pl-2">Fav</th>
                <th className="pb-2">Kod</th>
                <th className="pb-2">Şirket Adı</th>
                <th className="pb-2">Sektör</th>
                <th className="pb-2 text-right">Fiyat (TL)</th>
                <th className="pb-2 text-right">Değişim</th>
                <th className="pb-2 text-center">Günlük Aralık (Düşük - Yüksek)</th>
                <th className="pb-2 text-right">Hacim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                    Aranan kriterlere uygun hisse bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredStocks.map((stock) => {
                  const isFav = watchlist.includes(stock.code);
                  const isUp = stock.change >= 0;

                  // Calculate range bar percentage
                  const range = stock.high - stock.low || 1;
                  const posPercent = Math.min(100, Math.max(0, ((stock.price - stock.low) / range) * 100));

                  return (
                    <tr
                      key={stock.code}
                      className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                      onClick={() => onSelectAsset(stock.name)}
                    >
                      <td className="py-3 pl-2" onClick={(e) => { e.stopPropagation(); onToggleWatchlist(stock.code); }}>
                        <Star
                          className={`w-4 h-4 cursor-pointer transition-colors ${
                            isFav ? 'text-amber-400 fill-amber-400' : 'text-slate-600 hover:text-amber-400'
                          }`}
                        />
                      </td>
                      <td className="py-3 font-bold text-slate-100">{stock.code}</td>
                      <td className="py-3 text-slate-300 font-sans text-xs">{stock.name}</td>
                      <td className="py-3 text-slate-400 text-[11px]">{stock.sector}</td>
                      <td className="py-3 text-right font-bold text-slate-100">{formatTL(stock.price)} TL</td>
                      <td className={`py-3 text-right font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatPercent(stock.change)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span>{formatTL(stock.low)}</span>
                          <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden relative">
                            <div
                              className={`h-full rounded-full ${isUp ? 'bg-emerald-500' : 'bg-rose-500'}`}
                              style={{ width: `${posPercent}%` }}
                            />
                          </div>
                          <span>{formatTL(stock.high)}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right text-slate-400">{stock.volume}</td>
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
