import React, { useState } from 'react';
import { PriceAlert, MarketAsset, StockItem } from '../types';
import { formatTL } from '../utils/calculators';
import { Bell, X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: PriceAlert[];
  allAssets: Array<{ id: string; name: string; value: number }>;
  onAddAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  onRemoveAlert: (id: string) => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  allAssets,
  onAddAlert,
  onRemoveAlert,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState(allAssets[0]?.id || 'usd_try');
  const [targetPrice, setTargetPrice] = useState<number>(48.0);
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = allAssets.find((a) => a.id === selectedAssetId);
    if (!asset) return;

    onAddAlert({
      assetId: selectedAssetId,
      assetName: asset.name,
      targetPrice,
      condition,
      active: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-space font-bold text-slate-100 text-base">FİYAT ALARMLARI</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Add Alarm Form */}
          <form onSubmit={handleSubmit} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <h4 className="font-space font-bold text-xs text-amber-400 uppercase">Yeni Alarm Kur</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Varlık</label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => {
                    setSelectedAssetId(e.target.value);
                    const a = allAssets.find((item) => item.id === e.target.value);
                    if (a) setTargetPrice(a.value);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200"
                >
                  {allAssets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({formatTL(a.value)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Şart</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200"
                >
                  <option value="ABOVE">Fiyat Yükselince (&gt;=)</option>
                  <option value="BELOW">Fiyat Düşünce (&lt;=)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Hedef Fiyat</label>
              <input
                type="number"
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-colors"
            >
              Alarmı Ekle & Başlat
            </button>
          </form>

          {/* Active Alarms List */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono text-slate-400 uppercase">Aktif Alarmlar ({alerts.length})</h4>
            {alerts.length === 0 ? (
              <p className="text-xs font-mono text-slate-500 italic py-3 text-center">
                Henüz kayıtlı bir fiyat alarmı bulunmuyor.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {alerts.map((al) => (
                  <div
                    key={al.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between font-mono text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-200 block">{al.assetName}</span>
                      <span className="text-[11px] text-amber-400">
                        {al.condition === 'ABOVE' ? '≥ Yükselince' : '≤ Düşünce'} {formatTL(al.targetPrice)}
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveAlert(al.id)}
                      className="p-1 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
