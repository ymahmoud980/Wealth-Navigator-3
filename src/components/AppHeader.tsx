
"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from "@/hooks/use-currency";
import type { Currency } from "@/lib/types";

const pageTitles: { [key: string]: string } = {
  "/": "Dashboard",
  "/assets": "Asset Tracking",
  "/liabilities": "Liability Tracking",
  "/cashflow": "Cash Flow Management",
  "/advisor": "AI Financial Advisor",
  "/insights": "AI Document Insights",
  "/calculator": "Currency Calculator",
  "/breakdown": "Calculation Breakdown",
  "/health": "Financial Health Analysis",
};

export function AppHeader() {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();
  
  const title = pageTitles[pathname] || "Wealth Navigator";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>

      <div className="ml-auto flex items-center gap-4">
        <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EGP">EGP</SelectItem>
            <SelectItem value="KWD">KWD</SelectItem>
            <SelectItem value="TRY">TRY</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
