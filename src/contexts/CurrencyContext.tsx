
"use client";

import { createContext, useState, useMemo, type ReactNode, useEffect } from 'react';
import type { Currency, ExchangeRates } from '@/lib/types';
import { rates as defaultRates } from '@/lib/calculations';
import { useToast } from '@/hooks/use-toast';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rates: ExchangeRates;
  format: (value: number) => string;
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [rates, setRates] = useState<ExchangeRates>(defaultRates);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
        if (!apiKey) {
            console.warn("Exchange rate API key not found. Using default rates.");
            return;
        }
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        const data = await response.json();
        
        if (data.result === 'success') {
            const newRates: ExchangeRates = {
                ...defaultRates, // Keep GOLD/SILVER rates
                ...data.conversion_rates
            };
            setRates(newRates);
        } else {
            console.error("Failed to fetch latest exchange rates. Using default rates.");
            toast({
                title: "Live Rate Error",
                description: "Could not fetch live currency rates. Using default values.",
                variant: "destructive"
            })
        }
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
        toast({
            title: "Live Rate Error",
            description: "Could not fetch live currency rates. Using default values.",
            variant: "destructive"
        })
      }
    };
    fetchRates();
  }, [toast]);


  const format = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const value = useMemo(() => ({
    currency,
    setCurrency,
    rates,
    format,
  }), [currency, rates, format]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}
