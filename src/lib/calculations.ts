import { MarketRates } from "./marketPrices";

export const convert = (
  amount: number, 
  fromCurrency: string, 
  toCurrency: string, 
  rates: MarketRates
): number => {
  // 1. If currencies are the same, no conversion needed
  if (fromCurrency === toCurrency) return amount;

  // 2. Handle Precious Metals (Weight in Grams -> Price in USD)
  // 1 Troy Ounce = 31.1035 Grams
  const GRAMS_PER_OUNCE = 31.1035;

  if (fromCurrency === 'GOLD_GRAM') {
    const pricePerGram = rates.Gold / GRAMS_PER_OUNCE;
    const valueInUSD = amount * pricePerGram;
    return convert(valueInUSD, 'USD', toCurrency, rates);
  }

  if (fromCurrency === 'SILVER_GRAM') {
    const pricePerGram = rates.Silver / GRAMS_PER_OUNCE;
    const valueInUSD = amount * pricePerGram;
    return convert(valueInUSD, 'USD', toCurrency, rates);
  }

  // 3. Handle Standard Currencies (via USD base)
  // Convert 'from' to USD, then USD to 'to'
  
  // Get rates relative to USD (Base)
  const fromRate = rates[fromCurrency as keyof MarketRates] || 1;
  const toRate = rates[toCurrency as keyof MarketRates] || 1;

  // Calculation: (Amount / FromRate) * ToRate
  // Example: 100 EUR -> USD: 100 / 0.92 = 108 USD
  return (amount / fromRate) * toRate;
};