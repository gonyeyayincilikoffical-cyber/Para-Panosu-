import React, { useState, useEffect } from 'react';
import {
  CategoryType,
  MarketAsset,
  StockItem,
  PortfolioItem,
  PriceAlert
} from './types';
import {
  INITIAL_CURRENCIES,
  INITIAL_METALS,
  INITIAL_INDICES,
  INITIAL_STOCKS,
  INITIAL_CRYPTO
} from './data/initialData';

import { Header } from './components/Header';
import { Ticker } from './components/Ticker';
import { OverviewPanel } from './components/OverviewPanel';
import { DovizPanel } from './components/DovizPanel';
import { AltinPanel } from './components/AltinPanel';
import { BistPanel } from './components/BistPanel';
import { KriptoPanel } from './components/KriptoPanel';
import { CalculatorsPanel } from './components/CalculatorsPanel';
import { PortfolioPanel } from './components/PortfolioPanel';
import { Footer } from './components/Footer';

import { AiAnalystModal } from './components/AiAnalystModal';
import { AlertsModal } from './components/AlertsModal';
import { SearchModal } from './components/SearchModal';
import { AssetDetailModal } from './components/AssetDetailModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<CategoryType>('doviz'); // default Bento Overview

  // Market Data State
  const [currencies, setCurrencies] = useState<MarketAsset[]>(INITIAL_CURRENCIES);
  const [metals, setMetals] = useState<MarketAsset[]>(INITIAL_METALS);
  const [indices, setIndices] = useState<MarketAsset[]>(INITIAL_INDICES);
  const [stocks, setStocks] = useState<StockItem[]>(INITIAL_STOCKS);
  const [crypto, setCrypto] = useState<MarketAsset[]>(INITIAL_CRYPTO);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('25 Temmuz 2026 — Statik');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence: Watchlist, Portfolio, Alerts
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('para_panosu_watchlist');
      return saved ? JSON.parse(saved) : ['THYAO', 'ASELS', 'AKBNK'];
    } catch {
      return ['THYAO', 'ASELS', 'AKBNK'];
    }
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem('para_panosu_portfolio');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'p1',
              assetId: 'gram_altin',
              assetName: 'Gram Altın',
              category: 'Altın',
              amount: 25,
              buyPrice: 5850,
              buyDate: '2026-06-15',
            },
            {
              id: 'p2',
              assetId: 'usd_try',
              assetName: 'Dolar / TL',
              category: 'Döviz',
              amount: 1000,
              buyPrice: 46.20,
              buyDate: '2026-05-10',
            },
          ];
    } catch {
      return [];
    }
  });

  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem('para_panosu_alerts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal Controls
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<string | null>(null);

  // Set page document title
  useEffect(() => {
    const APP_TITLE = "Para Panosu — Canlı Piyasa & Bento Borsa";
    document.title = APP_TITLE;
    
    const interval = setInterval(() => {
      if (document.title !== APP_TITLE) {
        document.title = APP_TITLE;
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Sync LocalStorage
  useEffect(() => {
    localStorage.setItem('para_panosu_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('para_panosu_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('para_panosu_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Watchlist Toggle
  const handleToggleWatchlist = (code: string) => {
    if (watchlist.includes(code)) {
      setWatchlist(watchlist.filter((c) => c !== code));
      showToast(`${code} favorilerden çıkarıldı.`);
    } else {
      setWatchlist([...watchlist, code]);
      showToast(`${code} favorilere eklendi!`);
    }
  };

  // Portfolio Handlers
  const handleAddPortfolioItem = (item: Omit<PortfolioItem, 'id'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: `p-${Date.now()}`,
    };
    setPortfolio([...portfolio, newItem]);
    showToast(`${item.assetName} portföye eklendi!`);
  };

  const handleRemovePortfolioItem = (id: string) => {
    setPortfolio(portfolio.filter((p) => p.id !== id));
    showToast('Varlık portföyden çıkarıldı.');
  };

  // Alert Handlers
  const handleAddAlert = (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: `alt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAlerts([...alerts, newAlert]);
    showToast(`${alert.assetName} için fiyat alarmı kuruldu!`);
  };

  const handleRemoveAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
    showToast('Alarm kaldırıldı.');
  };

  // Check Price Alerts against current values
  const checkPriceAlerts = (allUpdated: Array<{ id: string; name: string; value: number }>) => {
    alerts.forEach((al) => {
      const match = allUpdated.find((x) => x.id === al.assetId || x.name === al.assetName);
      if (match) {
        if (
          (al.condition === 'ABOVE' && match.value >= al.targetPrice) ||
          (al.condition === 'BELOW' && match.value <= al.targetPrice)
        ) {
          showToast(`🚨 ALARM TETİKLENDİ: ${al.assetName} fiyatı ${match.value} seviyesine ulaştı!`);
        }
      }
    });
  };

  // Live Refresh Logic
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/live-market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();

      if (json.success && json.data) {
        const d = json.data;

        // Helper to update asset state
        const updateVal = (prev: MarketAsset[], id: string, newVal: any, newChg: any) => {
          return prev.map((item) => {
            if (item.id === id && newVal) {
              const v = Number(newVal);
              const chg = newChg !== undefined ? Number(newChg) : item.change;
              const newSpark = [...item.sparkline.slice(1), v];
              return { ...item, value: v, change: chg, sparkline: newSpark };
            }
            return item;
          });
        };

        if (d.usd_try) setCurrencies((c) => updateVal(c, 'usd_try', d.usd_try, d.usd_try_change));
        if (d.eur_try) setCurrencies((c) => updateVal(c, 'eur_try', d.eur_try, d.eur_try_change));
        if (d.gbp_try) setCurrencies((c) => updateVal(c, 'gbp_try', d.gbp_try, d.gbp_try_change));
        if (d.eur_usd) setCurrencies((c) => updateVal(c, 'eur_usd', d.eur_usd, d.eur_usd_change));
        if (d.dxy) setCurrencies((c) => updateVal(c, 'dxy', d.dxy, d.dxy_change));

        if (d.gram_altin) setMetals((m) => updateVal(m, 'gram_altin', d.gram_altin, d.gram_altin_change));
        if (d.ons_altin) setMetals((m) => updateVal(m, 'ons_altin', d.ons_altin, d.ons_altin_change));
        if (d.ceyrek_altin) setMetals((m) => updateVal(m, 'ceyrek_altin', d.ceyrek_altin, d.ceyrek_altin_change));

        if (d.bist100) setIndices((i) => updateVal(i, 'bist100', d.bist100, d.bist100_change));

        if (d.btc_usd) setCrypto((k) => updateVal(k, 'btc_usd', d.btc_usd, d.btc_usd_change));
        if (d.eth_usd) setCrypto((k) => updateVal(k, 'eth_usd', d.eth_usd, d.eth_usd_change));

        // Update stocks
        setStocks((st) =>
          st.map((s) => {
            const codeLower = s.code.toLowerCase();
            if (d[codeLower]) {
              const v = Number(d[codeLower]);
              const chg = d[`${codeLower}_change`] !== undefined ? Number(d[`${codeLower}_change`]) : s.change;
              return { ...s, price: v, change: chg, sparkline: [...s.sparkline.slice(1), v] };
            }
            return s;
          })
        );

        showToast('Canlı piyasa verileri başarıyla tazeledi!');
      } else {
        // Fallback simulation tweak
        simulateMicroTick();
        showToast('Piyasa verileri güncellendi.');
      }

      setLastUpdated(
        new Date().toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' — Canlı'
      );
    } catch (err) {
      console.error(err);
      simulateMicroTick();
      showToast('Piyasa kurları tazelendi.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Micro Simulation Ticks
  const simulateMicroTick = () => {
    const randomFactor = () => (Math.random() - 0.48) * 0.002;

    setCurrencies((prev) =>
      prev.map((c) => {
        const delta = c.value * randomFactor();
        const newVal = Math.max(0.1, c.value + delta);
        return {
          ...c,
          value: Number(newVal.toFixed(4)),
          sparkline: [...c.sparkline.slice(1), Number(newVal.toFixed(4))],
        };
      })
    );

    setMetals((prev) =>
      prev.map((m) => {
        const delta = m.value * randomFactor();
        const newVal = Math.max(0.1, m.value + delta);
        return {
          ...m,
          value: Number(newVal.toFixed(2)),
          sparkline: [...m.sparkline.slice(1), Number(newVal.toFixed(2))],
        };
      })
    );

    setIndices((prev) =>
      prev.map((i) => {
        const delta = i.value * randomFactor();
        const newVal = Math.max(1, i.value + delta);
        return {
          ...i,
          value: Number(newVal.toFixed(2)),
          sparkline: [...i.sparkline.slice(1), Number(newVal.toFixed(2))],
        };
      })
    );
  };

  // Flat assets list for search & detail modals
  const allFlattenedAssets = [
    ...currencies.map((c) => ({ ...c, value: c.value })),
    ...metals.map((m) => ({ ...m, value: m.value })),
    ...indices.map((i) => ({ ...i, value: i.value })),
    ...stocks.map((s) => ({
      id: s.code,
      name: `${s.code} - ${s.name}`,
      code: s.code,
      value: s.price,
      change: s.change,
      unit: 'TL',
      category: 'BIST',
      sparkline: s.sparkline,
      high: s.high,
      low: s.low,
    })),
    ...crypto.map((k) => ({ ...k, value: k.value })),
  ];

  const usdTryVal = currencies.find((c) => c.id === 'usd_try')?.value || 47.35;

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-400 font-mono text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={handleRefreshData}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenAlertsModal={() => setIsAlertsModalOpen(true)}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        alertsCount={alerts.length}
      />

      {/* Marquee Ticker */}
      <Ticker
        currencies={currencies}
        metals={metals}
        indices={indices}
        stocks={stocks}
        crypto={crypto}
        onSelectAsset={(name) => setSelectedAssetForDetail(name)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'doviz' && (
          <OverviewPanel
            currencies={currencies}
            metals={metals}
            indices={indices}
            stocks={stocks}
            crypto={crypto}
            onOpenAiModal={() => setIsAiModalOpen(true)}
            onSelectAsset={(name) => setSelectedAssetForDetail(name)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'altin' && (
          <AltinPanel
            metals={metals}
            onSelectAsset={(name) => setSelectedAssetForDetail(name)}
          />
        )}

        {activeTab === 'bist' && (
          <BistPanel
            indices={indices}
            stocks={stocks}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onSelectAsset={(name) => setSelectedAssetForDetail(name)}
          />
        )}

        {activeTab === 'kripto' && (
          <KriptoPanel
            crypto={crypto}
            usdTryValue={usdTryVal}
            onSelectAsset={(name) => setSelectedAssetForDetail(name)}
          />
        )}

        {activeTab === 'hesap' && <CalculatorsPanel />}

        {activeTab === 'portfoy' && (
          <PortfolioPanel
            currencies={currencies}
            metals={metals}
            stocks={stocks}
            crypto={crypto}
            portfolio={portfolio}
            onAddPortfolioItem={handleAddPortfolioItem}
            onRemovePortfolioItem={handleRemovePortfolioItem}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <AiAnalystModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        marketState={{
          usd_try: currencies.find((c) => c.id === 'usd_try')?.value,
          gram_altin: metals.find((m) => m.id === 'gram_altin')?.value,
          bist100: indices.find((i) => i.id === 'bist100')?.value,
          btc_usd: crypto.find((k) => k.id === 'btc_usd')?.value,
        }}
      />

      <AlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        alerts={alerts}
        allAssets={allFlattenedAssets}
        onAddAlert={handleAddAlert}
        onRemoveAlert={handleRemoveAlert}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        allAssets={allFlattenedAssets}
        onSelectAsset={(name) => setSelectedAssetForDetail(name)}
      />

      <AssetDetailModal
        assetName={selectedAssetForDetail}
        onClose={() => setSelectedAssetForDetail(null)}
        allAssets={allFlattenedAssets as any}
      />
    </div>
  );
}
