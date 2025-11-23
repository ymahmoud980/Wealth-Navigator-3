"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import type { FinancialData, Loan } from '@/lib/types';
import { initialFinancialData } from '@/lib/data';
import { calculateMetrics } from '@/lib/calculations';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";

interface FinancialDataContextType {
  data: FinancialData;
  setData: (data: FinancialData) => void;
  metrics: ReturnType<typeof calculateMetrics>;
  loading: boolean;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export function FinancialDataProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { currency, rates } = useCurrency();
  const [data, setDataState] = useState<FinancialData>(initialFinancialData);
  const [loading, setLoading] = useState(true);

  // Load data from Firestore when user logs in
  useEffect(() => {
    if (user) {
      setLoading(true);
      const docRef = doc(db, 'users', user.uid);
      getDoc(docRef).then(docSnap => {
        if (docSnap.exists() && docSnap.data().financialData) {
          setDataState(docSnap.data().financialData);
        } else {
          // If no data, start with initial template
          setDataState(initialFinancialData);
        }
        setLoading(false);
      }).catch(error => {
        console.error("Error fetching user financial data:", error);
        setLoading(false);
      });
    } else if (!authLoading) {
      // If no user and auth is not loading, we are done.
      setDataState(initialFinancialData); // Reset to default if user logs out
      setLoading(false);
    }
  }, [user, authLoading]);

  const setData = useCallback((newData: FinancialData) => {
    setDataState(newData);
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      // Persist data to Firestore, merging it with existing document
      setDoc(userDocRef, { financialData: newData }, { merge: true }).catch(error => {
        console.error("Error saving financial data:", error);
      });
    }
  }, [user]);

  const metrics = useMemo(() => {
    return calculateMetrics(data, currency, rates);
  }, [data, currency, rates]);
  
  const isLoading = authLoading || loading;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#020817] text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Financial Data...</p>
        </div>
      </div>
    );
  }

  return (
    <FinancialDataContext.Provider value={{ data, setData, metrics, loading }}>
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
