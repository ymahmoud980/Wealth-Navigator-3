
"use client";

import { createContext, useState, useEffect, useContext, useMemo, type ReactNode, useCallback } from 'react';
import type { FinancialData } from '@/lib/types';
import { initialFinancialData } from '@/lib/data';
import { calculateMetrics } from '@/lib/calculations';
import { useCurrency } from '@/hooks/use-currency';
import { getFinancialDataFromFirestore, saveFinancialDataToFirestore } from '@/lib/firebase';

interface FinancialDataContextType {
  data: FinancialData;
  setData: (data: FinancialData) => void;
  loading: boolean;
  metrics: ReturnType<typeof calculateMetrics>;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export function FinancialDataProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<FinancialData>(initialFinancialData);
  const [loading, setLoading] = useState(true);
  const { currency } = useCurrency(); // Get the currency to calculate metrics

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            let firestoreData = await getFinancialDataFromFirestore();
            
            if (firestoreData) {
                 // The saved data is up-to-date or newer.
                setDataState(firestoreData);
            } else {
                // No saved data, use the initial default data and save it to Firestore.
                await saveFinancialDataToFirestore(initialFinancialData);
                setDataState(initialFinancialData);
            }
        } catch (error) {
            console.error("Error reading from Firestore:", error);
            // Fallback to initial data if Firestore fails
            setDataState(initialFinancialData);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const setData = useCallback((newData: FinancialData) => {
    try {
      const updatedData = { ...newData, lastUpdated: new Date().toISOString() };
      setDataState(updatedData);
      saveFinancialDataToFirestore(updatedData); // Save to Firestore instead of localStorage
    } catch (error) {
      console.error("Failed to save data to Firestore:", error);
    }
  }, []);

  // Memoize the metrics calculation
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
