
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from '@/hooks/use-currency';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Installment } from '@/lib/types';
import { Checkbox } from "@/components/ui/checkbox";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

interface UpcomingPaymentsProps {
    payments: Installment[];
}

export function UpcomingPayments({ payments: initialPayments }: UpcomingPaymentsProps) {
  const { data, setData } = useFinancialData();
  const { toast } = useToast();
  
  const getStatus = (dueDate: string) => {
      const today = new Date();
      const due = new Date(dueDate);
      const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return { className: 'text-red-700', text: `Overdue by ${-diffDays} days` };
      if (diffDays <= 30) return { className: 'text-amber-600', text: `${diffDays} days away` };
      if (diffDays <= 90) return { className: 'text-yellow-600', text: `${diffDays} days away` };
      return { className: 'text-gray-500', text: `${diffDays} days away` };
  }

  const handleMarkAsPaid = (paymentToMark: Installment) => {
    const originalData = JSON.parse(JSON.stringify(data)); // Deep copy for undo
    
    const updatedData = { ...data };
    const installment = updatedData.liabilities.installments.find(p => p.id === paymentToMark.id);

    if (installment) {
      installment.paid += installment.amount;
      setData(updatedData);

      toast({
        title: "Installment Paid",
        description: `Marked payment for ${installment.project} as paid.`,
        action: (
          <Button variant="secondary" size="sm" onClick={() => {
            setData(originalData);
            toast({ description: "Action undone." });
          }}>
            Undo
          </Button>
        ),
      });
    }
  };
  
  const sortedPayments = [...initialPayments].sort((a,b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime());

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Installments</CardTitle>
          <CardDescription>Next project installments due. Check to mark as paid.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-4">
              {sortedPayments.length > 0 ? (
                sortedPayments.map((payment) => {
                  const status = getStatus(payment.nextDueDate);
                  const isPaid = payment.paid >= payment.total;
                  return (
                  <div key={payment.id} className="flex items-center gap-4">
                    <Checkbox
                      id={`payment-${payment.id}`}
                      onCheckedChange={(checked) => {
                        if (checked) {
                            handleMarkAsPaid(payment);
                        }
                      }}
                      checked={false} // Always start unchecked
                      disabled={isPaid}
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
    </>
  );
}
