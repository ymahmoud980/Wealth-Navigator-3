
"use client";

import { createContext, useState, useEffect, useContext, useMemo, type ReactNode, useCallback } from 'react';
import type { FinancialData } from '@/lib/types';
import { initialFinancialData } from '@/lib/data';
import { getFinancialData, setFinancialData } from '@/ai/flows/manage-financial-data';

interface FinancialDataContextType {
  data: FinancialData;
  setData: (data: FinancialData) => void;
  loading: boolean;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export function FinancialDataProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<FinancialData>(initialFinancialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const result = await getFinancialData();
        setDataState(result);
      } catch (error) {
        console.error("Error fetching financial data:", error);
        // Fallback to initial data if the flow fails
        setDataState(initialFinancialData);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const setData = useCallback(async (newData: FinancialData) => {
    try {
      // Optimistic update for better UX
      setDataState(newData); 
      const updatedData = { ...newData, lastUpdated: new Date().toISOString() };
      await setFinancialData(updatedData);
      // No need to set state again as the optimistic update already handled it
    } catch (error) {
      console.error("Failed to save data:", error);
      // Optionally, revert the state if the save fails
    }
  }, []);

  const value = useMemo(() => ({
    data,
    setData,
    loading,
  }), [data, loading, setData]);

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
