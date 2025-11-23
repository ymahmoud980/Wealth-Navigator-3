"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { FinancialData } from "@/lib/types";
import { calculateMetrics } from "@/lib/calculations";
import { fetchLiveRates, initialRates, MarketRates } from "@/lib/marketPrices";

// --- 1. DEFINE SAFE DEFAULTS INLINE (Prevents crash if import fails) ---
const SAFE_DEFAULT_DATA: FinancialData = {
  assets: {
    realEstate: [],
    underDevelopment: [],
    cash: [],
    gold: [],
    silver: [],
    otherAssets: [],
    salary: { amount: 0, currency: 'USD' }
  },
  liabilities: {
    loans: [],
    installments: []
  },
  monthlyExpenses: {
    household: []
  }
};

interface FinancialDataContextType {
  data: FinancialData;
  setData: (data: FinancialData) => void;
  metrics: ReturnType<typeof calculateMetrics>;
  loading: boolean;
  currency: string;
  setCurrency: (currency: string) => void;
  rates: MarketRates;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export function FinancialDataProvider({ children }: { children: React.ReactNode }) {
  // Use the inline safe default
  const [data, setData] = useState<FinancialData>(SAFE_DEFAULT_DATA);
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState<MarketRates>(initialRates || { USD: 1, EUR: 0.92, GBP: 0.79, Gold: 2000, Silver: 25 });
  const [loading, setLoading] = useState(true);

  // 1. Load Live Rates
  useEffect(() => {
    async function loadRates() {
      try {
        const liveData = await fetchLiveRates();
        if (liveData && liveData.USD) {
          setRates(liveData);
        }
      } catch (e) {
        console.warn("Using default rates");
      }
      setLoading(false);
    }
    loadRates();
    const interval = setInterval(loadRates, 60000); 
    return () => clearInterval(interval);
  }, []);

  // 2. Load User Data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("wealth_navigator_data_v3");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Safety check: ensure it has the main keys
          if (parsed && parsed.assets) {
            setData(parsed);
          }
        } catch (e) {
          console.error("Data load error", e);
        }
      }
    }
  }, []);

  // 3. Save User Data
  useEffect(() => {
    if (typeof window !== 'undefined' && data) {
      localStorage.setItem("wealth_navigator_data_v3", JSON.stringify(data));
    }
  }, [data]);

  // 4. Calculate Metrics
  const metrics = useMemo(() => {
    // Double safety check
    const safeData = data || SAFE_DEFAULT_DATA;
    return calculateMetrics(safeData, currency, rates);
  }, [data, currency, rates]);

  return (
    <FinancialDataContext.Provider 
      value={{ 
        data, 
        setData, 
        metrics, 
        loading,
        currency,
        setCurrency,
        rates 
      }}
    >
      {children}
    </FinancialDataContext.Provider>
  );
}

export function useFinancialData() {
  const context = useContext(FinancialDataContext);
  if (context === undefined) {
    throw new Error("useFinancialData must be used within a FinancialDataProvider");
  }
  return context;
}