import React, { useState } from 'react';
import { Search, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatTL, formatPercent } from '../utils/calculators';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allAssets: Array<{
    id: string;
    name: string;
    code?: string;
    value: number;
    change: number;
    unit: string;
    category: string;
  }>;
  onSelectAsset: (name: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  allAssets,
  onSelectAsset,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = allAssets.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      (a.code && a.code.toLowerCase().includes(query.toLowerCase())) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Input */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-400" />
          <input
            type="text"
            autoFocus
            placeholder="Döviz, Altın, BIST Hissesi veya Kripto ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-mono text-slate-100 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-slate-500">
              Aramanıza uygun finansal varlık bulunamadı.
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectAsset(item.name);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-slate-800/60 flex items-center justify-between cursor-pointer transition-colors font-mono text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{item.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  {item.code && <span className="text-[11px] text-slate-500">{item.code}</span>}
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-100">
                    {formatTL(item.value)} {item.unit}
                  </div>
                  <div
                    className={`text-[11px] font-bold ${
                      item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatPercent(item.change)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
