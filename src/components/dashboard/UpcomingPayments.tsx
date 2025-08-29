
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useCurrency } from '@/hooks/use-currency';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Installment } from '@/lib/types';
import { useFinancialData } from '@/contexts/FinancialDataContext';

interface UpcomingPaymentsProps {
    payments: Installment[];
}

export function UpcomingPayments({ payments: initialPayments }: UpcomingPaymentsProps) {
  const { data, setData } = useFinancialData();

  const handleCheckChange = (id: string) => {
    // In a real app, this would trigger a database update.
    // For now, we'll just update the state.
    const newData = JSON.parse(JSON.stringify(data));
    const installment = newData.liabilities.installments.find((i: Installment) => i.id === id);
    if (installment) {
      const currentDueDate = new Date(installment.nextDueDate);
      if (installment.frequency === 'Annual') {
        currentDueDate.setFullYear(currentDueDate.getFullYear() + 1);
      } else if (installment.frequency === 'Semi-Annual') {
        currentDueDate.setMonth(currentDueDate.getMonth() + 6);
      } else if (installment.frequency === 'Quarterly') {
        currentDueDate.setMonth(currentDueDate.getMonth() + 3);
      }
      installment.paid += installment.amount;
      installment.nextDueDate = currentDueDate.toISOString().split('T')[0];
      setData(newData);
    }
  };
  
  const getStatus = (dueDate: string) => {
      const today = new Date();
      const due = new Date(dueDate);
      const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return { className: 'text-red-700', text: `Overdue by ${-diffDays} days` };
      if (diffDays <= 30) return { className: 'text-amber-600', text: `${diffDays} days away` };
      if (diffDays <= 90) return { className: 'text-yellow-600', text: `${diffDays} days away` };
      return { className: 'text-gray-500', text: `${diffDays} days away` };
  }
  
  const sortedPayments = [...initialPayments].sort((a,b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Installments</CardTitle>
        <CardDescription>Next project installments due.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            {sortedPayments.length > 0 ? (
              sortedPayments.map((payment) => {
                const status = getStatus(payment.nextDueDate);
                return (
                <div key={payment.id} className="flex items-center gap-4">
                  <Checkbox
                    id={`payment-${payment.id}`}
                    onCheckedChange={() => handleCheckChange(payment.id)}
                  />
                  <div className={cn("flex-1 grid grid-cols-3 gap-2 items-center text-sm")}>
                    <div className="col-span-2">
                        <p className="font-medium truncate">{payment.project}</p>
                        <p className={cn("text-xs", status.className)}>{status.text}</p>
                    </div>
                    <span className="font-semibold text-right">{payment.amount.toLocaleString()} {payment.currency}</span>
                  </div>
                </div>
              )})
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">All payments cleared!</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
