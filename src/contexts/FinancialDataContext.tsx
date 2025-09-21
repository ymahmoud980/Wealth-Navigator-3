
"use client";

import { createContext, useState, useEffect, useContext, useMemo, type ReactNode, useCallback } from 'react';
import type { FinancialData } from '@/lib/types';
import { initialFinancialData } from '@/lib/data';
import { calculateMetrics } from '@/lib/calculations';
import { useCurrency } from '@/hooks/use-currency';

interface FinancialDataContextType {
  data: FinancialData;
  setData: (data: FinancialData) => void;
  loading: boolean;
  metrics: ReturnType<typeof calculateMetrics>;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'financialData';

export function FinancialDataProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<FinancialData>(initialFinancialData);
  const [loading, setLoading] = useState(true);
  const { currency } = useCurrency();

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      setDataState(JSON.parse(savedData));
    }
    setLoading(false);
  }, []);

  const setData = useCallback((newData: FinancialData) => {
    try {
      const updatedData = { ...newData, lastUpdated: new Date().toISOString() };
      setDataState(updatedData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error("Failed to save data to localStorage:", error);
    }
  }, []);

  const metrics = useMemo(() => calculateMetrics(data, currency), [data, currency]);

  const value = useMemo(() => ({
    data,
    setData,
    loading,
    metrics,
  }), [data, loading, setData, metrics]);

  return (
    <FinancialDataContext.Provider value={value}>
      {children}
    </FinancialDataContext.Provider>
  );
}

export const useFinancialData = () => {
    const context = useContext(FinancialDataContext);
    if (context === undefined) {
        throw new Error('useFinancialData must be used within a FinancialDataProvider');
    }
    return context;
};
