
"use client";

import { createContext, useState, useEffect, useContext, useMemo, type ReactNode, useCallback } from 'react';
import type { FinancialData } from '@/lib/types';
import { initialFinancialData } from '@/lib/data';
import { calculateMetrics } from '@/lib/calculations';
import { useCurrency } from '@/hooks/use-currency';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface FinancialDataContextType {
  data: FinancialData;
  setData: (data: FinancialData) => void;
  loading: boolean;
  metrics: ReturnType<typeof calculateMetrics>;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export function FinancialDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [data, setDataState] = useState<FinancialData>(initialFinancialData);
  const [loading, setLoading] = useState(true);
  const { currency, rates } = useCurrency();

  const fetchData = useCallback(async () => {
    if (!user) {
        setLoading(false);
        return;
    }
    setLoading(true);
    const userDocRef = doc(db, 'userFinancialData', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      setDataState(docSnap.data() as FinancialData);
    } else {
      // If no data, set initial data for the new user
      await setDoc(userDocRef, initialFinancialData);
      setDataState(initialFinancialData);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setData = useCallback(async (newData: FinancialData) => {
    setDataState(newData);
    if (user) {
      try {
        const userDocRef = doc(db, 'userFinancialData', user.uid);
        await setDoc(userDocRef, newData, { merge: true });
      } catch (error) {
        console.error("Failed to save data to Firestore:", error);
      }
    }
  }, [user]);

  const metrics = useMemo(() => calculateMetrics(data, currency, rates), [data, currency, rates]);

  const value = useMemo(() => ({
    data,
    setData,
    loading: loading || !user,
    metrics,
  }), [data, setData, loading, user, metrics]);

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
