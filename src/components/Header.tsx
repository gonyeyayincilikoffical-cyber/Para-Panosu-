import React, { useState, useEffect } from 'react';
import { CategoryType } from '../types';
import {
  TrendingUp,
  Sparkles,
  RefreshCw,
  Bell,
  Search,
  PieChart,
  DollarSign,
  Coins,
  BarChart3,
  Bitcoin,
  Calculator,
  LayoutGrid
} from 'lucide-react';

interface HeaderProps {
  activeTab: CategoryType;
  setActiveTab: (tab: CategoryType) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: string;
  onOpenAiModal: () => void;
  onOpenAlertsModal: () => void;
  onOpenSearchModal: () => void;
  alertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRefresh,
  isRefreshing,
  lastUpdated,
  onOpenAiModal,
  onOpenAlertsModal,
  onOpenSearchModal,
  alertsCount,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          weekday: 'short',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: Array<{ id: CategoryType; label: string; icon: React.ReactNode }> = [
    { id: 'doviz', label: 'GENEL BENTO', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'altin', label: 'ALTIN & MADEN', icon: <Coins className="w-4 h-4" /> },
    { id: 'bist', label: 'BIST 100', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'kripto', label: 'KRİPTO', icon: <Bitcoin className="w-4 h-4" /> },
    { id: 'hesap', label: 'HESAPLAMA', icon: <Calculator className="w-4 h-4" /> },
    { id: 'portfoy', label: 'PORTFÖYÜM', icon: <PieChart className="w-4 h-4" /> },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold shadow-lg shadow-amber-500/5">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-space text-slate-100 tracking-tight">
                PARA PANOSU
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium uppercase tracking-wider">
                CANLI
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Piyasa Takip & Bento Borsa Panosu
            </p>
          </div>
        </div>

        {/* Quick Tools & Clock */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onOpenSearchModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-700 text-xs font-mono transition-all"
            title="Varlık Ara (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Ara...</span>
          </button>

          <button
            onClick={onOpenAlertsModal}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/30 text-xs font-mono transition-all"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Alarmlar</span>
            {alertsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-amber-500 text-slate-950 font-bold rounded-full">
                {alertsCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/20 to-amber-500/20 border border-purple-500/30 hover:border-purple-400 text-purple-300 hover:text-purple-200 text-xs font-space font-semibold transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Yapay Zeka Analizi</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-space font-bold text-xs transition-all disabled:opacity-50 shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'GETİRİLİYOR...' : 'CANLI VERİ'}</span>
          </button>

          {/* Clock */}
          <div className="hidden lg:block text-right border-l border-slate-800 pl-4 font-mono text-xs text-slate-400">
            <div className="text-slate-200 font-semibold">{timeStr || '--:--:--'}</div>
            <div className="text-[11px] text-slate-500">{dateStr || '---'}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto no-scrollbar scroll-smooth border-t border-slate-800/60 pt-1">
        <nav className="flex space-x-1 min-w-max py-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-space text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-slate-500 py-2">
          <span>GÜNCELLEME:</span>
          <span className="text-slate-400 font-medium">{lastUpdated}</span>
        </div>
      </div>
    </header>
  );
};
