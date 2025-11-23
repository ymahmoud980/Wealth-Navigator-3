"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { FinancialData } from "@/lib/types";
import { calculateMetrics } from "@/lib/calculations";
import { fetchLiveRates, initialRates, MarketRates } from "@/lib/marketPrices";
import { Loader2 } from "lucide-react";

// Safe Default (Empty)
const SAFE_DEFAULT_DATA: FinancialData = {
  assets: {
    realEstate: [], underDevelopment: [], cash: [], gold: [], silver: [], otherAssets: [],
    salary: { amount: 0, currency: 'USD' }
  },
  liabilities: { loans: [], installments: [] },
  monthlyExpenses: { household: [] }
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
  const [data, setData] = useState<FinancialData>(SAFE_DEFAULT_DATA);
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState<MarketRates>(initialRates);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 1. Load Data (Migration Logic)
  useEffect(() => {
    const timer = setTimeout(() => {
        if (typeof window !== 'undefined') {
            // Check V3 (New) first
            const savedV3 = localStorage.getItem("wealth_navigator_data_v3");
            // Check Original (Old) second
            const savedOld = localStorage.getItem("wealth_navigator_data");

            if (savedV3) {
                // Scenario A: We have V3 data, load it.
                try {
                    const parsed = JSON.parse(savedV3);
                    if (parsed && parsed.assets) setData(parsed);
                } catch (e) { console.error("Error parsing V3"); }
            } 
            else if (savedOld) {
                // Scenario B: No V3 data, but Old data exists. MIGRATE IT.
                try {
                    console.log("Migrating old data to V3...");
                    const parsed = JSON.parse(savedOld);
                    if (parsed && parsed.assets) setData(parsed);
                } catch (e) { console.error("Error migrating old data"); }
            }

            // UNLOCK THE APP
            setIsDataLoaded(true);
        }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 2. Load Rates
  useEffect(() => {
    async function loadRates() {
      try {
        const liveData = await fetchLiveRates();
        if (liveData && liveData.USD) setRates(liveData);
      } catch (e) {}
    }
    loadRates();
    const interval = setInterval(loadRates, 60000);
    return () => clearInterval(interval);
  }, []);

  // 3. Save Data (Always save to V3)
  useEffect(() => {
    if (isDataLoaded && typeof window !== 'undefined') {
      localStorage.setItem("wealth_navigator_data_v3", JSON.stringify(data));
    }
  }, [data, isDataLoaded]);

  // 4. Calculate Metrics
  const metrics = useMemo(() => {
    return calculateMetrics(data, currency, rates);
  }, [data, currency, rates]);

  // --- LOADING SCREEN ---
  if (!isDataLoaded) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#020817] text-white">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                <p className="text-sm text-muted-foreground animate-pulse">Migrating Secure Vault...</p>
            </div>
        </div>
    );
  }

  return (
    <FinancialDataContext.Provider 
      value={{ data, setData, metrics, loading: !isDataLoaded, currency, setCurrency, rates }}
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