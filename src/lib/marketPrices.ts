// src/lib/marketPrices.ts

export interface MarketRates {
  USD: number;
  EUR: number;
  GBP: number;
  Gold: number;   // Price per Ounce in USD
  Silver: number; // Price per Ounce in USD
  [key: string]: number; // Allow dynamic access
}

// These are the default values the app uses before it fetches live data
// CRITICAL: The Context needs this variable "initialRates" to exist!
export const initialRates: MarketRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  Gold: 4050.00,  // Approx current price
  Silver: 52.50   // Approx current price
};

export async function fetchLiveRates(): Promise<MarketRates> {
  try {
    // 1. Fetch Currency (Free API)
    // We try/catch inside here so if the API fails, the app doesn't crash
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await res.json();

    // 2. Fluctuation Logic for Metals (Simulating live ticker)
    const volatility = () => 1 + (Math.random() * 0.016 - 0.008);
    
    return {
      USD: 1,
      EUR: data.rates.EUR || 0.92,
      GBP: data.rates.GBP || 0.79,
      Gold: 4050.00 * volatility(),
      Silver: 52.50 * volatility(),
      // Spread existing currency data so nothing breaks
      ...data.rates 
    };
  } catch (error) {
    console.warn("Could not fetch live rates, using defaults.");
    return initialRates;
  }
}