import React from 'react';
import { MarketAsset, StockItem } from '../types';
import { BentoCard } from './BentoCard';
import { Sparkline } from './Sparkline';
import { QuickConverterWidget } from './QuickConverterWidget';
import { formatTL, formatPercent } from '../utils/calculators';
import {
  DollarSign,
  Coins,
  BarChart3,
  Bitcoin,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Globe2,
  Flame,
  ArrowRight
} from 'lucide-react';

interface OverviewPanelProps {
  currencies: MarketAsset[];
  metals: MarketAsset[];
  indices: MarketAsset[];
  stocks: StockItem[];
  crypto: MarketAsset[];
  onOpenAiModal: () => void;
  onSelectAsset: (name: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const OverviewPanel: React.FC<OverviewPanelProps> = ({
  currencies,
  metals,
  indices,
  stocks,
  crypto,
  onOpenAiModal,
  onSelectAsset,
  onNavigateTab,
}) => {
  const usd = currencies.find((c) => c.id === 'usd_try') || currencies[0];
  const eur = currencies.find((c) => c.id === 'eur_try') || currencies[1];
  const gramAltin = metals.find((m) => m.id === 'gram_altin') || metals[0];
  const onsAltin = metals.find((m) => m.id === 'ons_altin') || metals[1];
  const bist100 = indices.find((i) => i.id === 'bist100') || indices[0];
  const btc = crypto.find((k) => k.id === 'btc_usd') || crypto[0];
  const eth = crypto.find((k) => k.id === 'eth_usd') || crypto[1];

  // Top Stock Gainers/Losers
  const topGainer = [...stocks].sort((a, b) => b.change - a.change)[0];
  const topLoser = [...stocks].sort((a, b) => a.change - b.change)[0];

  return (
    <div className="space-y-6">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* HERO CARD 1: Döviz (USD & EUR) */}
        <BentoCard
          className="lg:col-span-2"
          title={
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              DÖVİZ KURLARI & PARİTELER
            </span>
          }
          subtitle="Serbest Piyasa Gösterge Kurları"
          action={
            <button
              onClick={() => onNavigateTab('doviz')}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              Tüm Kurlar <ArrowRight className="w-3 h-3" />
            </button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* USD Box */}
            <div
              onClick={() => onSelectAsset(usd.name)}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 cursor-pointer transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-slate-400 block">{usd.name}</span>
                  <div className="text-2xl font-mono font-bold text-slate-100 mt-1">
                    {formatTL(usd.value, 4)} <span className="text-xs text-slate-400">TL</span>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    usd.change >= 0
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {usd.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {formatPercent(usd.change)}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/50 flex items-center justify-between">
                <div className="text-[11px] font-mono text-slate-500">
                  Aralık: {formatTL(usd.low24h || usd.value * 0.99, 2)} - {formatTL(usd.high24h || usd.value * 1.01, 2)}
                </div>
                <Sparkline data={usd.sparkline} isPositive={usd.change >= 0} width={80} height={24} />
              </div>
            </div>

            {/* EUR Box */}
            <div
              onClick={() => onSelectAsset(eur.name)}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 cursor-pointer transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-slate-400 block">{eur.name}</span>
                  <div className="text-2xl font-mono font-bold text-slate-100 mt-1">
                    {formatTL(eur.value, 4)} <span className="text-xs text-slate-400">TL</span>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    eur.change >= 0
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {eur.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {formatPercent(eur.change)}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/50 flex items-center justify-between">
                <div className="text-[11px] font-mono text-slate-500">
                  Aralık: {formatTL(eur.low24h || eur.value * 0.99, 2)} - {formatTL(eur.high24h || eur.value * 1.01, 2)}
                </div>
                <Sparkline data={eur.sparkline} isPositive={eur.change >= 0} width={80} height={24} />
              </div>
            </div>
          </div>
        </BentoCard>

        {/* HERO CARD 2: Altın & Madenler */}
        <BentoCard
          className="lg:col-span-2"
          title={
            <span className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              ALTIN & KIYMETLİ MADENLER
            </span>
          }
          subtitle="Gram & Ons Altın Piyasa Değerleri"
          action={
            <button
              onClick={() => onNavigateTab('altin')}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              Altın Detay <ArrowRight className="w-3 h-3" />
            </button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gram Altin */}
            <div
              onClick={() => onSelectAsset(gramAltin.name)}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 cursor-pointer transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-slate-400 block">{gramAltin.name}</span>
                  <div className="text-2xl font-mono font-bold text-amber-400 mt-1">
                    {formatTL(gramAltin.value)} <span className="text-xs text-slate-400">TL</span>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    gramAltin.change >= 0
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {gramAltin.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {formatPercent(gramAltin.change)}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/50 flex items-center justify-between">
                <div className="text-[11px] font-mono text-slate-500">
                  Çeyrek Altın: <span className="text-slate-300 font-semibold">{formatTL(gramAltin.value * 1.63)} TL</span>
                </div>
                <Sparkline data={gramAltin.sparkline} isPositive={gramAltin.change >= 0} width={80} height={24} />
              </div>
            </div>

            {/* Ons Altin */}
            <div
              onClick={() => onSelectAsset(onsAltin.name)}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 cursor-pointer transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-slate-400 block">{onsAltin.name}</span>
                  <div className="text-2xl font-mono font-bold text-amber-400 mt-1">
                    ${formatTL(onsAltin.value, 0)} <span className="text-xs text-slate-400">USD</span>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    onsAltin.change >= 0
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {onsAltin.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {formatPercent(onsAltin.change)}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/50 flex items-center justify-between">
                <div className="text-[11px] font-mono text-slate-500">
                  Tam Altın: <span className="text-slate-300 font-semibold">{formatTL(gramAltin.value * 6.54)} TL</span>
                </div>
                <Sparkline data={onsAltin.sparkline} isPositive={onsAltin.change >= 0} width={80} height={24} />
              </div>
            </div>
          </div>
        </BentoCard>

        {/* CARD 3: BIST 100 Pulse */}
        <BentoCard
          className="lg:col-span-2"
          title={
            <span className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              BORSA İSTANBUL (BIST 100)
            </span>
          }
          subtitle="Günün Borsa Hareketleri & Öne Çıkan Hisseler"
          action={
            <button
              onClick={() => onNavigateTab('bist')}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              Tüm Hisseler <ArrowRight className="w-3 h-3" />
            </button>
          }
        >
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            {/* Index Main Card */}
            <div className="flex-1 bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-slate-400">{bist100.code}</span>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      bist100.change >= 0
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {formatPercent(bist100.change)}
                  </span>
                </div>
                <div className="text-2xl font-mono font-bold text-slate-100 mt-2">
                  {formatTL(bist100.value)} <span className="text-xs text-slate-400">Puan</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">Hacim: {bist100.volume24h}</span>
                <Sparkline data={bist100.sparkline} isPositive={bist100.change >= 0} width={90} height={26} />
              </div>
            </div>

            {/* Top Movers */}
            <div className="flex-1 space-y-2">
              {topGainer && (
                <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-200">{topGainer.code}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400">EN ÇOK YÜKSELEN</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{topGainer.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-emerald-400">{formatPercent(topGainer.change)}</div>
                    <div className="text-[11px] font-mono text-slate-300">{formatTL(topGainer.price)} TL</div>
                  </div>
                </div>
              )}

              {topLoser && (
                <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-200">{topLoser.code}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400">EN ÇOK DÜŞEN</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{topLoser.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-rose-400">{formatPercent(topLoser.change)}</div>
                    <div className="text-[11px] font-mono text-slate-300">{formatTL(topLoser.price)} TL</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </BentoCard>

        {/* CARD 4: Crypto Overview */}
        <BentoCard
          className="lg:col-span-1"
          title={
            <span className="flex items-center gap-2">
              <Bitcoin className="w-4 h-4 text-orange-400" />
              KRİPTO PARALAR
            </span>
          }
          subtitle="Bitcoin & Altkoinler"
        >
          <div className="space-y-3">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex justify-between items-center">
              <div>
                <span className="text-xs font-mono font-bold text-slate-200 block">{btc.code}</span>
                <span className="text-sm font-mono font-bold text-amber-400">${formatTL(btc.value, 0)}</span>
              </div>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  btc.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {formatPercent(btc.change)}
              </span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex justify-between items-center">
              <div>
                <span className="text-xs font-mono font-bold text-slate-200 block">{eth.code}</span>
                <span className="text-sm font-mono font-bold text-amber-400">${formatTL(eth.value, 0)}</span>
              </div>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  eth.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {formatPercent(eth.change)}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Kripto Korku Endeksi:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">72 (AŞIRI HIRS)</span>
            </div>
          </div>
        </BentoCard>

        {/* CARD 5: AI Insights Teaser */}
        <BentoCard
          className="lg:col-span-1 bg-gradient-to-br from-purple-900/30 via-slate-900/90 to-amber-900/20 border-purple-500/30"
          title={
            <span className="flex items-center gap-2 text-purple-300">
              <Sparkles className="w-4 h-4 text-purple-400" />
              YAZAY ZEKA PİYASA YORUMU
            </span>
          }
          subtitle="Gemini AI Günlük Analiz"
        >
          <div className="flex flex-col justify-between h-[130px]">
            <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
              "Küresel faiz beklentileri ve enflasyon verileri ışığında döviz kurlarında dengeli seyir izlenirken, ons altın ve kripto piyasalarında alımlar ivme kazanıyor..."
            </p>

            <button
              onClick={onOpenAiModal}
              className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-space font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-600/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tam Piyasa Analizini Oku</span>
            </button>
          </div>
        </BentoCard>

        {/* CARD 6: Quick Converter (Span 2) */}
        <BentoCard
          className="lg:col-span-2"
          title="HIZLI DÖVİZ & ALTIN ÇEVİRİCİ"
          subtitle="Anlık Canlı Serbest Piyasa Kurlarıyla Dönüştür"
        >
          <QuickConverterWidget currencies={currencies} metals={metals} crypto={crypto} />
        </BentoCard>

        {/* CARD 7: Market Watch Matrix (Span 2) */}
        <BentoCard
          className="lg:col-span-2"
          title="BİST HİSSE TAKİP MATRİSİ"
          subtitle="En Çok İşlem Gören Türk Hisseleri"
          action={
            <button
              onClick={() => onNavigateTab('bist')}
              className="text-xs font-mono text-amber-400 hover:text-amber-300"
            >
              Hisse Detayları
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                  <th className="pb-2">Kod</th>
                  <th className="pb-2">Şirket</th>
                  <th className="pb-2">Sektör</th>
                  <th className="pb-2 text-right">Fiyat</th>
                  <th className="pb-2 text-right">Değişim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {stocks.slice(0, 5).map((stock) => (
                  <tr key={stock.code} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 font-bold text-slate-200">{stock.code}</td>
                    <td className="py-2.5 text-slate-400 text-ellipsis max-w-[140px] truncate">{stock.name}</td>
                    <td className="py-2.5 text-slate-500 text-[11px]">{stock.sector}</td>
                    <td className="py-2.5 text-right font-bold text-slate-200">{formatTL(stock.price)} TL</td>
                    <td className={`py-2.5 text-right font-bold ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatPercent(stock.change)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BentoCard>
      </div>
    </div>
  );
};
