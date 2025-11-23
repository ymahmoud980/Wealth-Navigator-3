"use client";

import { useState, useEffect } from "react";
import { fetchLiveRates, initialRates, MarketRates } from "@/lib/marketPrices";

export function useCurrency() {
  // Default user preference (you could save this to localStorage later)
  const [currency, setCurrency] = useState("USD"); 
  const [rates, setRates] = useState<MarketRates>(initialRates);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRates() {
      const liveData = await fetchLiveRates();
      setRates(liveData);
      setLoading(false);
    }
    loadRates();
  }, []);

  const format = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return {
    currency,
    setCurrency,
    rates, // Now exposes the LIVE rates to the whole app
    format,
    loading
  };
}