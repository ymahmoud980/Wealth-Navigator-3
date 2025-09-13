
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import type { Installment } from '@/lib/types';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface UpcomingPaymentsProps {
    payments: Installment[];
}

export function UpcomingPayments({ payments: initialPayments }: UpcomingPaymentsProps) {
  
  const getStatus = (dueDate: string) => {
      const today = new Date();
      // Handle non-standard date formats
      const dateParts = dueDate.split('-').map(part => parseInt(part, 10));
      const due = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

      const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return { className: 'text-red-700', text: `Overdue by ${-diffDays} days` };
      if (diffDays <= 30) return { className: 'text-amber-600', text: `${diffDays} days away` };
      if (diffDays <= 90) return { className: 'text-yellow-600', text: `${diffDays} days away` };
      return { className: 'text-gray-500', text: `${diffDays} days away` };
  }
  
  const sortedPayments = [...initialPayments].sort((a, b) => {
    const dateA = a.nextDueDate.split('-').map(Number);
    const dateB = b.nextDueDate.split('-').map(Number);
    return new Date(dateA[0], dateA[1] - 1, dateA[2]).getTime() - new Date(dateB[0], dateB[1] - 1, dateB[2]).getTime();
  });

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Installments</CardTitle>
            <CardDescription>A summary of your next project installments due.</CardDescription>
          </div>
           <Button asChild variant="outline" size="sm">
                <Link href="/liabilities">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
              {sortedPayments.length > 0 ? (
                sortedPayments.map((payment) => {
                  const status = getStatus(payment.nextDueDate);
                  const isPaid = payment.paid >= payment.total;
                  if (isPaid) return null;
                  return (
                  <div key={payment.id} className="flex items-center gap-4">
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
        </CardContent>
      </Card>
    </>
  );
}
