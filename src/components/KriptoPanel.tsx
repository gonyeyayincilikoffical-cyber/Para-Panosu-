import React from 'react';
import { MarketAsset } from '../types';
import { BentoCard } from './BentoCard';
import { Sparkline } from './Sparkline';
import { formatTL, formatPercent } from '../utils/calculators';
import { Bitcoin, ArrowUpRight, ArrowDownRight, Flame, ShieldAlert } from 'lucide-react';

interface KriptoPanelProps {
  crypto: MarketAsset[];
  usdTryValue: number;
  onSelectAsset: (name: string) => void;
}

export const KriptoPanel: React.FC<KriptoPanelProps> = ({ crypto, usdTryValue, onSelectAsset }) => {
  return (
    <div className="space-y-6">
      {/* Crypto Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {crypto.map((asset) => {
          const isUp = asset.change >= 0;
          const tryValue = asset.value * usdTryValue;

          return (
            <BentoCard
              key={asset.id}
              onClick={() => onSelectAsset(asset.name)}
              className="group"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-mono text-slate-400 block">{asset.name} ({asset.code})</span>
                  <div className="text-2xl font-mono font-bold text-amber-400 mt-1">
                    ${formatTL(asset.value, asset.value < 100 ? 2 : 0)}
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    ≈ {formatTL(tryValue, 0)} TL
                  </span>
                </div>

                <div
                  className={`flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isUp
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {formatPercent(asset.change)}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">24s Hacim: {asset.volume24h}</span>
                <Sparkline data={asset.sparkline} isPositive={isUp} width={80} height={24} />
              </div>
            </BentoCard>
          );
        })}
      </div>

      {/* Fear & Greed Index Meter */}
      <BentoCard
        title={
          <span className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            KRİPTO KORKU & HIRS ENDEKSİ (FEAR & GREED)
          </span>
        }
        subtitle="Piyasa Psikolojisi ve Duygu Durumu Ölçümü"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-mono font-bold text-emerald-400">72 / 100</span>
              <span className="ml-3 text-xs font-mono uppercase font-semibold text-emerald-400 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded">
                Aşırı Hırs (Extreme Greed)
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 max-w-sm text-right hidden sm:block">
              Yüksek hırs piyasada iyimserliğe işaret eder. Ancak düzeltme risklerine karşı dikkatli olunmalıdır.
            </p>
          </div>

          {/* Bar */}
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
            <div className="h-full w-1/4 bg-rose-600 rounded-l-full" title="Aşırı Korku (0-24)" />
            <div className="h-full w-1/4 bg-orange-500" title="Korku (25-49)" />
            <div className="h-full w-1/4 bg-yellow-500" title="Nötr (50-74)" />
            <div className="h-full w-1/4 bg-emerald-500 rounded-r-full" title="Aşırı Hırs (75-100)" />
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>0 - Aşırı Korku</span>
            <span>25 - Korku</span>
            <span>50 - Nötr</span>
            <span>75 - Hırs</span>
            <span>100 - Aşırı Hırs</span>
          </div>
        </div>
      </BentoCard>
    </div>
  );
};
