import React, { useState, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, RefreshCw, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AiAnalystModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketState: any;
}

export const AiAnalystModal: React.FC<AiAnalystModalProps> = ({ isOpen, onClose, marketState }) => {
  const [analysisText, setAnalysisText] = useState<string>('');
  const [sources, setSources] = useState<Array<{ uri: string; title: string }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const fetchInitialAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketState }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAnalysisText(data.analysis);
        setSources(data.sources || []);
      } else {
        setAnalysisText('Piyasa analizi şu an oluşturulamadı. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      console.error(err);
      setAnalysisText('Piyasa analizi alınırken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !analysisText) {
      fetchInitialAnalysis();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim() || isLoading) return;

    const q = userQuestion;
    setUserQuestion('');
    setMessages((prev) => [...prev, { role: 'user', content: q }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuestion: q, marketState }),
      });
      const data = await res.json();
      if (data.analysis) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.analysis }]);
        if (data.sources && data.sources.length) {
          setSources(data.sources);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Cevap alınırken bir sorun oluştu.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-space font-bold text-slate-100 text-base">
                YAPAY ZEKA PİYASA & FİNANS ANALİSTİ
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Gemini AI Destekli Anlık Piyasa Özeti ve Soru-Cevap
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading && !analysisText && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
              <p className="text-xs font-mono text-slate-400">
                Yapay Zeka canlı piyasa verilerini ve haberlerini analiz ediyor...
              </p>
            </div>
          )}

          {/* Initial Analysis Report */}
          {analysisText && (
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5">
                  <Bot className="w-4 h-4" /> GÜNLÜK PİYASA RAPORU
                </span>
                <button
                  onClick={fetchInitialAnalysis}
                  disabled={isLoading}
                  className="text-[11px] font-mono text-slate-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} /> Yenile
                </button>
              </div>

              <div className="prose prose-invert prose-xs max-w-none font-sans text-slate-300 leading-relaxed">
                <ReactMarkdown>{analysisText}</ReactMarkdown>
              </div>

              {sources.length > 0 && (
                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                    Kaynaklar & Grounding:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-mono text-purple-400 hover:underline flex items-center gap-1 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20"
                      >
                        <span>{s.title || 'Web Kaynağı'}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat Messages */}
          {messages.length > 0 && (
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Soru & Cevap Geçmişi
              </h4>
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl text-xs font-sans leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-amber-500/10 border border-amber-500/20 text-slate-200 ml-8'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 mr-8'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 font-mono font-bold text-[11px]">
                    {m.role === 'user' ? (
                      <>
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400">Siz</span>
                      </>
                    ) : (
                      <>
                        <Bot className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-purple-400">Finans Analisti AI</span>
                      </>
                    )}
                  </div>
                  <div className="prose prose-invert prose-xs max-w-none">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Question Input Form */}
        <form onSubmit={handleAskQuestion} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Finans veya piyasalar hakkında soru sorun (örn: Kredi çekip altın almak mantıklı mı?)..."
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={isLoading || !userQuestion.trim()}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-space font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Sor</span>
          </button>
        </form>
      </div>
    </div>
  );
};
