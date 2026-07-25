import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-slate-500 font-mono text-xs leading-relaxed">
      <div className="max-w-7xl mx-auto space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-space font-bold text-slate-200 text-sm">PARA PANOSU</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              v2.5 Bento Edition
            </span>
          </div>
          <div className="text-slate-400 text-xs">
            © 2026 PARA PANOSU — Bireysel Piyasa Takip & Bento Borsa Platformu
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          <strong className="text-slate-400">Yasal Uyarı:</strong> Bu platformda sunulan tüm döviz, altın, BIST 100, kripto paralar ve hesaplama verileri bilgi ve gösterge amaçlıdır. Yatırım tavsiyesi niteliği taşımaz. Serbest piyasa ve banka kurları arasında farklılıklar oluşabilir. "CANLI VERİYİ GETİR" butonu, yapay zeka arama entegrasyonu kullanarak anlık web araştırması gerçekleştirir.
        </p>
      </div>
    </footer>
  );
};
