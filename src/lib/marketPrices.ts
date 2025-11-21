// src/lib/marketPrices.ts

export interface MarketRates {
    USD: number; // Base
    EUR: number;
    GBP: number;
    Gold: number; // Per Ounce in USD
    Silver: number; // Per Ounce in USD
  }
  
  export const initialRates: MarketRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    Gold: 2035.50,
    Silver: 23.10
  };
  
  // Function to fetch real currency data
  export async function fetchLiveRates(): Promise<MarketRates> {
    try {
      // 1. Fetch Currency (Free API)
      const currencyResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const currencyData = await currencyResponse.json();
  
      // 2. Simulate Gold/Silver fluctuation (Real APIs require paid keys)
      // We add a random 0.5% fluctuation to base prices to make it feel "live"
      const randomFluctuation = () => 1 + (Math.random() * 0.01 - 0.005);
      
      return {
        USD: 1,
        EUR: currencyData.rates.EUR || 0.92,
        GBP: currencyData.rates.GBP || 0.79,
        Gold: 2350.00 * randomFluctuation(), // Approx current gold price
        Silver: 28.50 * randomFluctuation()  // Approx current silver price
      };
    } catch (error) {
      console.error("Failed to fetch market data", error);
      return initialRates;
    }
  }