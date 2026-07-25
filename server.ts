import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// API Route: Live Market Data grounded via Gemini Search
app.post("/api/live-market", async (req, res) => {
  try {
    if (!ai) {
      return res.json({
        success: false,
        message: "Gemini API Key missing, returning benchmark simulated data",
        data: null,
      });
    }

    const prompt = `Aşağıdaki finansal varlıkların GÜNCEL Piyasa Değerlerini ve Günlük Yüzde Değişimlerini web'den araştır ve SADECE geçerli bir JSON nesnesi olarak döndür:
{
  "usd_try": number, "usd_try_change": number,
  "eur_try": number, "eur_try_change": number,
  "gbp_try": number, "gbp_try_change": number,
  "eur_usd": number, "eur_usd_change": number,
  "dxy": number, "dxy_change": number,
  "gram_altin": number, "gram_altin_change": number,
  "ons_altin": number, "ons_altin_change": number,
  "ceyrek_altin": number, "ceyrek_altin_change": number,
  "gumus_gram": number, "gumus_gram_change": number,
  "bist100": number, "bist100_change": number,
  "thyao": number, "thyao_change": number,
  "asels": number, "asels_change": number,
  "sasa": number, "sasa_change": number,
  "akbnk": number, "akbnk_change": number,
  "garani": number, "garani_change": number,
  "btc_usd": number, "btc_usd_change": number,
  "eth_usd": number, "eth_usd_change": number,
  "sol_usd": number, "sol_usd_change": number,
  "brent_petrol": number, "brent_petrol_change": number
}
Önemli: Yalnızca JSON verisi döndür. Sayılarda virgül kullanma, nokta kullan. Değişim yüzdeleri eksi veya artı olabilir (örn: -0.85 veya 1.25).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const match = cleanJson.match(/\{[\s\S]*\}/);
    const data = JSON.parse(match ? match[0] : cleanJson);

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error: any) {
    console.error("Live market search error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch live market data",
    });
  }
});

// API Route: AI Market Analysis & Q&A
app.post("/api/ai-analysis", async (req, res) => {
  try {
    const { userQuestion, marketState } = req.body;

    if (!ai) {
      return res.status(400).json({
        error: "GEMINI_API_KEY environment variable is missing.",
      });
    }

    const marketContextStr = marketState
      ? `Anlık Piyasa Verileri:\nUSD/TRY: ${marketState.usd_try || 47.35} (%\n${marketState.usd_try_change || 0.17})\nGram Altın: ${marketState.gram_altin || 6168} TL\nOns Altın: ${marketState.ons_altin || 4050} USD\nBIST 100: ${marketState.bist100 || 13943}\nBTC/USD: $${marketState.btc_usd || 118450}`
      : "Güncel piyasa benchmark verileri.";

    const systemInstruction = `Sen "Para Panosu" uygulamasının uzman Türkçe Piyasa ve Finans Analistisin. 
Yatırımcılara ve bireysel kullanıcılara Türkiye ve Dünya piyasaları, döviz, altın, BIST 100, enflasyon, merkez bankası politikaları ve borç/mevduat yönetimi konularında anlaşılır, profesyonel, şeffaf ve yapıcı değerlendirmeler sunarsın.
Cevaplarında teknik terimleri basitçe açıklarsın. Cevap formatında markdown başlıklar, listeler ve vurgular kullan.
Sonuna "Yatırım tavsiyesi değildir" uyarısı eklemeyi unutma.`;

    const prompt = userQuestion
      ? `Kullanıcı Sorduğu Soru: "${userQuestion}"\n\n${marketContextStr}\nLütfen bu soruyu piyasa şartlarına göre detaylı ve anlaşılır şekilde cevapla.`
      : `Lütfen bugünün piyasa şartlarını genel olarak analiz et (${marketContextStr}).\n1. Döviz ve Altın Trendleri\n2. BIST 100 ve Hisselerdeki Durum\n3. Küresel Piyasa Rüzgarları ve Kripto\n4. Bireysel Yatırımcılar İçin Dikkat Edilmesi Gereken Riskler.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return res.json({
      analysis: response.text,
      sources: groundingChunks
        .map((c: any) => c.web)
        .filter(Boolean),
    });
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    return res.status(500).json({
      error: error.message || "Yapay zeka analizi oluşturulamadı.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
