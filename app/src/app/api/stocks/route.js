const ALPACA_BASE = "https://data.alpaca.markets/v2";
const ALL_SYMBOLS = ["BND", "VTI", "VYM", "VXUS", "QQQ", "AVUV"];

const WINDOW_CONFIG = {
  "1D": { timeframe: "1Hour", limit: 24 },
  "1W": { timeframe: "1Day", limit: 7 },
  "1M": { timeframe: "1Day", limit: 30 },
  "3M": { timeframe: "1Day", limit: 65 },
};

function isMarketOpen() {
  const now = new Date();
  const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = et.getDay();
  if (day === 0 || day === 6) return false;
  const mins = et.getHours() * 60 + et.getMinutes();
  return mins >= 9 * 60 + 30 && mins < 16 * 60;
}

export async function GET(request) {
  const key = process.env.ALPACA_API_KEY;
  const secret = process.env.ALPACA_API_SECRET;

  if (!key || !secret) {
    return Response.json(
      { error: "ALPACA_API_KEY and ALPACA_API_SECRET must be set in .env.local" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const window = searchParams.get("window") || "1W";
  const cfg = WINDOW_CONFIG[window] ?? WINDOW_CONFIG["1W"];

  const headers = {
    "APCA-API-KEY-ID": key,
    "APCA-API-SECRET-KEY": secret,
  };

  const syms = ALL_SYMBOLS.join(",");

  try {
    const [snapRes, barsRes] = await Promise.all([
      fetch(
        `${ALPACA_BASE}/stocks/snapshots?symbols=${syms}`,
        { headers, next: { revalidate: 60 } }
      ),
      fetch(
        `${ALPACA_BASE}/stocks/bars?symbols=${syms}&timeframe=${cfg.timeframe}&limit=${cfg.limit}&adjustment=raw`,
        { headers, next: { revalidate: 60 } }
      ),
    ]);

    if (!snapRes.ok) {
      const body = await snapRes.text();
      console.error("Alpaca snapshots error:", snapRes.status, body);
      return Response.json(
        { error: `Alpaca snapshots failed (${snapRes.status})` },
        { status: 502 }
      );
    }
    if (!barsRes.ok) {
      const body = await barsRes.text();
      console.error("Alpaca bars error:", barsRes.status, body);
      return Response.json(
        { error: `Alpaca bars failed (${barsRes.status})` },
        { status: 502 }
      );
    }

    const [snapshots, barsPayload] = await Promise.all([
      snapRes.json(),
      barsRes.json(),
    ]);

    const bars = barsPayload.bars || {};

    const result = {};
    for (const sym of ALL_SYMBOLS) {
      const snap = snapshots[sym];
      const symBars = bars[sym] || [];

      const price = snap?.latestTrade?.p ?? snap?.dailyBar?.c ?? null;

      let changePercent = null;
      if (price !== null) {
        if (window === "1D") {
          // Compare to today's open
          const dayOpen = snap?.dailyBar?.o ?? null;
          if (dayOpen !== null && dayOpen !== 0) {
            changePercent = ((price - dayOpen) / dayOpen) * 100;
          }
        } else {
          // Compare to the first bar in the window
          const firstClose = symBars[0]?.c ?? null;
          if (firstClose !== null && firstClose !== 0) {
            changePercent = ((price - firstClose) / firstClose) * 100;
          }
        }
      }

      result[sym] = {
        price,
        changePercent,
        bars: symBars.map((b) => b.c),
      };
    }

    return Response.json({
      stocks: result,
      marketOpen: isMarketOpen(),
      lastUpdated: new Date().toISOString(),
      window,
    });
  } catch (err) {
    console.error("Stocks route failed:", err);
    return Response.json(
      { error: err?.message || "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
