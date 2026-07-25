import React from 'react';
import { MarketAsset, StockItem } from '../types';
import { formatTL, formatPercent } from '../utils/calculators';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TickerProps {
  currencies: MarketAsset[];
  metals: MarketAsset[];
  indices: MarketAsset[];
  stocks: StockItem[];
  crypto: MarketAsset[];
  onSelectAsset?: (assetName: string) => void;
}

export const Ticker: React.FC<TickerProps> = ({
  currencies,
  metals,
  indices,
  stocks,
  crypto,
  onSelectAsset,
}) => {
  const tickerItems = [
    ...currencies.map((c) => ({
      key: c.id,
      name: c.code || c.name,
      value: `${formatTL(c.value, c.value < 10 ? 4 : 4)} ${c.unit}`,
      change: c.change,
    })),
    ...metals.slice(0, 3).map((m) => ({
      key: m.id,
      name: m.name,
      value: `${formatTL(m.value)} ${m.unit}`,
      change: m.change,
    })),
    ...indices.map((i) => ({
      key: i.id,
      name: i.code || i.name,
      value: `${formatTL(i.value)} ${i.unit}`,
      change: i.change,
    })),
    ...stocks.slice(0, 4).map((s) => ({
      key: s.code,
      name: s.code,
      value: `${formatTL(s.price)} TL`,
      change: s.change,
    })),
    ...crypto.slice(0, 2).map((k) => ({
      key: k.id,
      name: k.code || k.name,
      value: `$${formatTL(k.value, 0)}`,
      change: k.change,
    })),
  ];

  return (
    <div className="bg-slate-950/90 border-b border-slate-800/80 py-2 overflow-hidden whitespace-nowrap select-none group">
      <div className="inline-flex animate-ticker group-hover:[animation-play-state:paused] text-xs font-mono">
        {/* First Loop */}
        {tickerItems.map((item, idx) => (
          <TickerItem key={`a-${item.key}-${idx}`} item={item} onClick={() => onSelectAsset?.(item.name)} />
        ))}
        {/* Duplicate Loop for Infinite Seamless Scroll */}
        {tickerItems.map((item, idx) => (
          <TickerItem key={`b-${item.key}-${idx}`} item={item} onClick={() => onSelectAsset?.(item.name)} />
        ))}
      </div>
    </div>
  );
};

const TickerItem: React.FC<{ item: { key: string; name: string; value: string; change: number }; onClick: () => void }> = ({
  item,
  onClick,
}) => {
  const isUp = item.change >= 0;
  return (
    <div
      onClick={onClick}
      className="inline-flex items-center gap-2 px-5 py-0.5 border-r border-slate-800/60 hover:bg-slate-800/40 cursor-pointer transition-colors"
    >
      <span className="text-slate-400 font-medium">{item.name}</span>
      <span className="text-slate-200 font-semibold">{item.value}</span>
      <span
        className={`inline-flex items-center text-[11px] font-semibold ${
          isUp ? 'text-emerald-400' : 'text-rose-400'
        }`}
      >
        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {formatPercent(item.change)}
      </span>
    </div>
  );
};
