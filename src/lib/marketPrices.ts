// src/lib/marketPrices.ts

export interface MarketRates {
  USD: number;
  EUR: number;
  GBP: number;
  Gold: number;   // Price per Ounce in USD
  Silver: number; // Price per Ounce in USD
  TRY: number;
  EGP: number;
  KWD: number;
  [key: string]: number;
}

// Fallback values (Updated to your observed values)
export const initialRates: MarketRates = {
  USD: 1,
  EUR: 0.95,
  GBP: 0.82,
  Gold: 4130.00,  // Your observed price
  Silver: 50.50,
  TRY: 45.0,
  EGP: 65.0,
  KWD: 0.31
};

export async function fetchLiveRates(): Promise<MarketRates> {
  try {
    // Fetch Data from TWO sources in parallel
    // 1. Currencies (ExchangeRate-API)
    // 2. Metals (CoinGecko - tracks Gold/Silver spot price via PAXG/XAG tokens)
    const [currencyRes, metalRes] = await Promise.all([
      fetch(`https://api.exchangerate-api.com/v4/latest/USD?t=${Date.now()}`),
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=pax-gold,kinesis-silver&vs_currencies=usd&t=${Date.now()}`)
    ]);

    const currencyData = await currencyRes.json();
    const metalData = await metalRes.json();

    // Extract Rates
    const rates = currencyData.rates || {};

    // Extract Metals
    // PAXG (Pax Gold) tracks 1 oz of Gold
    // KAG (Kinesis Silver) tracks 1 oz of Silver
    // We use these because they provide free, live JSON data for commodities
    const realGold = metalData["pax-gold"]?.usd || initialRates.Gold;
    const realSilver = metalData["kinesis-silver"]?.usd || initialRates.Silver;

    return {
      ...initialRates, // Safety defaults
      ...rates,        // Live Currencies
      
      // Live Metal Prices
      Gold: realGold,  
      Silver: realSilver
    };

  } catch (error) {
    console.warn("Market API Error, using fallbacks:", error);
    return initialRates;
  }
}