
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from '@/components/ui/scroll-area';
import type { RealEstateAsset } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface UpcomingRentsProps {
    rents: RealEstateAsset[];
}

export function UpcomingRents({ rents: initialRents }: UpcomingRentsProps) {
  
   const getStatus = (dueDate: string) => {
      const today = new Date();
      const due = new Date(dueDate);
      const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return { className: 'text-red-700', text: `Overdue by ${-diffDays} days` };
      if (diffDays <= 7) return { className: 'text-amber-600', text: `Due in ${diffDays} days` };
      return { className: 'text-gray-500', text: `Due in ${diffDays} days` };
  }
  
  const sortedRents = [...initialRents].filter(r => r.monthlyRent > 0).sort((a,b) => new Date(a.nextRentDueDate).getTime() - new Date(b.nextRentDueDate).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Rents</CardTitle>
        <CardDescription>Next rental payments to be received.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            {sortedRents.length > 0 ? (
              sortedRents.map((rent) => {
                  const status = getStatus(rent.nextRentDueDate);
                  return (
                    <div key={rent.id} className="flex items-center gap-4">
                      <div className="flex-1 grid grid-cols-3 gap-2 items-center text-sm">
                        <div className='col-span-2'>
                            <p className="font-medium truncate">{rent.name}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(rent.nextRentDueDate), 'MMM yyyy')}</p>
                            <p className={cn("text-xs", status.className)}>{status.text}</p>
                        </div>
                        <span className="font-semibold text-right text-green-600">
                            {rent.monthlyRent.toLocaleString()} {rent.rentCurrency || rent.currency}
                        </span>
                      </div>
                    </div>
                  )
              })
            ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No upcoming rents.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
