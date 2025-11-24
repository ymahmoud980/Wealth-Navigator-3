"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { FinancialData } from "@/lib/types";
import { calculateMetrics } from "@/lib/calculations";
import { fetchLiveRates, initialRates, MarketRates } from "@/lib/marketPrices";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// 1. Safe Default Data (Prevents "undefined" crashes)
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
  liabilities: { loans: [], installments: [] },
  monthlyExpenses: { household: [] }
};

// 2. Define Context Type
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
  const { user, loading: authLoading } = useAuth();
  
  const [data, setData] = useState<FinancialData>(SAFE_DEFAULT_DATA);
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState<MarketRates>(initialRates);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 3. DATA LOADING & MIGRATION LOGIC
  useEffect(() => {
    // Only try to load data if the user is actually logged in
    if (!authLoading && user) {
        const timer = setTimeout(() => {
            if (typeof window !== 'undefined') {
                const userId = user.uid;
                
                // Priority 1: Check if this specific user has saved data
                const savedUserV3 = localStorage.getItem(`wealth_navigator_data_v3_${userId}`);
                
                // Priority 2: Check the "Generic" V3 vault (from before we added Auth)
                const savedGenericV3 = localStorage.getItem("wealth_navigator_data_v3");
                
                // Priority 3: Check the Old V2 vault (from the very beginning)
                const savedOld = localStorage.getItem("wealth_navigator_data");

                if (savedUserV3) {
                    try { setData(JSON.parse(savedUserV3)); } catch (e) {}
                } 
                else if (savedGenericV3) {
                    // Recover data from the session before Auth was added
                    try { setData(JSON.parse(savedGenericV3)); } catch (e) {}
                }
                else if (savedOld) {
                    // Recover data from the old version
                    try { setData(JSON.parse(savedOld)); } catch (e) {}
                }

                // Unlock the app
                setIsDataLoaded(true);
            }
        }, 100);
        return () => clearTimeout(timer);
    }
  }, [user, authLoading]);

  // 4. Load Live Market Rates
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

  // 5. Save Data (To User-Specific Vault)
  useEffect(() => {
    if (isDataLoaded && user && typeof window !== 'undefined') {
      localStorage.setItem(`wealth_navigator_data_v3_${user.uid}`, JSON.stringify(data));
    }
  }, [data, isDataLoaded, user]);

  // 6. Calculate Metrics
  const metrics = useMemo(() => {
    const safeData = data || SAFE_DEFAULT_DATA;
    return calculateMetrics(safeData, currency, rates);
  }, [data, currency, rates]);

  // --- LOADING STATES ---

  // A. Waiting for Auth Check
  if (authLoading) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-[#020817] text-white">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
     );
  }

  // B. Not Logged In? (AuthContext handles the Login Screen, so just render children or null)
  if (!user) {
     return <>{children}</>; 
  }

  // C. Waiting for Data Decryption
  if (!isDataLoaded) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#020817] text-white">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                <p className="text-sm text-muted-foreground animate-pulse">Decrypting User Vault...</p>
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