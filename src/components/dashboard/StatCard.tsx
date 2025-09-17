
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/hooks/use-currency";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  isCurrency?: boolean;
}

export function StatCard({ title, value, icon, isCurrency = false }: StatCardProps) {
  const { format } = useCurrency();

  const getColor = () => {
    if (title === 'Liabilities') {
        return 'text-destructive';
    }
    if (title === 'Avg. Net Cash Flow') {
        return value >= 0 ? 'text-accent-foreground/90' : 'text-destructive';
    }
    return 'text-accent-foreground/90';
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={cn("text-3xl font-bold", getColor())}>{isCurrency ? format(value) : value}</div>
      </CardContent>
    </Card>
  );
}
