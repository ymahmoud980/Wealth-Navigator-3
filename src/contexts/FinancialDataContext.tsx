
"use client";

import { createContext, useState, useEffect, useContext, useMemo, type ReactNode } from 'react';
import type { FinancialData } from '@/lib/types';
import { initialFinancialData } from '@/lib/data';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

interface FinancialDataContextType {
  data: FinancialData;
  setData: (data: FinancialData) => void;
  loading: boolean;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export function FinancialDataProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<FinancialData>(initialFinancialData);
  const [loading, setLoading] = useState(true);

  const docRef = useMemo(() => doc(db, 'financialData', 'shared'), []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDataState(docSnap.data() as FinancialData);
        } else {
          // If no document exists, create one with the initial data
          await setDoc(docRef, initialFinancialData);
          setDataState(initialFinancialData);
        }
      } catch (error) {
        console.error("Error fetching initial financial data from Firestore:", error);
        // Fallback to initial data if Firestore is unreachable
        setDataState(initialFinancialData);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Set up a listener for real-time updates
    const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            setDataState(doc.data() as FinancialData);
        }
    }, (error) => {
        console.error("Error with Firestore snapshot listener:", error);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, [docRef]);

  const setData = async (newData: FinancialData) => {
    try {
        setLoading(true);
        const updatedData = { ...newData, lastUpdated: new Date().toISOString() };
        await setDoc(docRef, updatedData);
        // The onSnapshot listener will update the state, but we can update it here for quicker UI response
        setDataState(updatedData);
    } catch (error) {
      console.error("Failed to save data to Firestore:", error);
    } finally {
        setLoading(false);
    }
  };

  const value = useMemo(() => ({
    data,
    setData,
    loading,
  }), [data, loading]);

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
