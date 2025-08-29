"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/hooks/use-currency";
import type { ReactNode } from "react";
import type { Currency } from "@/lib/types";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  fromCurrency?: Currency;
}

export function StatCard({ title, value, icon, fromCurrency = 'USD' }: StatCardProps) {
  const { format } = useCurrency();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{format(value, fromCurrency)}</div>
      </CardContent>
    </Card>
  );
}
