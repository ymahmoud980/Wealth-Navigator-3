"use client";

import { useFinancialData } from "@/contexts/FinancialDataContext";

export function useCurrency() {
  // 1. Safe Context Access with try/catch fallback
  let context = null;
  try {
    context = useFinancialData();
  } catch (e) {
    // If context fails, we simply ignore it and use defaults below
  }

  // 2. Default Values (If context is missing/loading)
  const currency = context?.currency || "USD";
  const setCurrency = context?.setCurrency || (() => {});
  const rates = context?.rates || {};
  const loading = context?.loading || false;

  // 3. Crash-Proof Formatter
  const format = (value: any) => {
    // Return "0.00" for invalid inputs instead of crashing
    if (value === null || value === undefined || isNaN(Number(value))) {
      return "0.00";
    }

    try {
      // Try standard formatting
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 0,
      }).format(Number(value));
    } catch (error) {
      // If currency code is invalid (e.g. "XYZ"), fallback to simple string
      return `${currency} ${Number(value).toFixed(0)}`;
    }
  };

  return {
    currency,
    setCurrency,
    rates,
    format,
    loading
  };
}