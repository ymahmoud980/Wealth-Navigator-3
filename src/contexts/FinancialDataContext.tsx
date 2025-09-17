

"use client";

import { createContext, useState, useEffect, useContext, useMemo, type ReactNode, useCallback } from 'react';
import type { FinancialData, Installment } from '@/lib/types';
import { initialFinancialData } from '@/lib/data';

interface FinancialDataContextType {
  data: FinancialData;
  setData: (data: FinancialData) => void;
  loading: boolean;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'financialData';
const CORRECTION_FLAG_KEY_TYCOON = 'tycoon-h2222-correction-applied';

// This function performs a one-time correction on the user's saved data for a specific installment.
const applyOneTimeTycoonCorrection = (data: FinancialData): FinancialData => {
  try {
    const correctionApplied = localStorage.getItem(CORRECTION_FLAG_KEY_TYCOON);
    if (correctionApplied) {
      return data; // Correction already applied, do nothing.
    }

    const correctedData = JSON.parse(JSON.stringify(data)); // Deep copy to avoid mutation
    const installments = correctedData.liabilities.installments as Installment[];
    const tycoonInstallmentIndex = installments.findIndex(i => i.id === 'i3');

    if (tycoonInstallmentIndex !== -1) {
      const currentInstallment = installments[tycoonInstallmentIndex];
      const correctTotal = 10578141;
      const correctPaid = 4830267;

      // Only apply correction if the values are the old, incorrect ones.
      if (currentInstallment.total !== correctTotal || currentInstallment.paid !== correctPaid) {
        currentInstallment.total = correctTotal;
        currentInstallment.paid = correctPaid;
        console.log(`Applied one-time correction for Tycoon H2222 (i3) to set total to ${correctTotal} and paid to ${correctPaid}.`);
      }
    }
    
    // Mark that the correction has been run for this user's browser.
    localStorage.setItem(CORRECTION_FLAG_KEY_TYCOON, 'true');
    return correctedData;
    
  } catch (error) {
    console.error("Error applying one-time data correction:", error);
    // Return original data if correction fails to prevent data loss.
    return data;
  }
};


export function FinancialDataProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<FinancialData>(initialFinancialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      let savedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
      
      if (savedDataString) {
        let savedData = JSON.parse(savedDataString);
        // Apply the targeted correction here
        savedData = applyOneTimeTycoonCorrection(savedData);
        
        setDataState(savedData);
        // Save the corrected data back to local storage immediately
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedData));
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialFinancialData));
        setDataState(initialFinancialData);
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      setDataState(initialFinancialData);
    } finally {
      setLoading(false);
    }
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
