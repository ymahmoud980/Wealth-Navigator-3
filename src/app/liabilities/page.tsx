
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { initialFinancialData } from "@/lib/data"
import { useCurrency } from "@/hooks/use-currency"
import type { FinancialData } from "@/lib/types"

export default function LiabilitiesPage() {
  const { format } = useCurrency()
  const [data, setData] = useState<FinancialData>(initialFinancialData)

  const { loans, installments } = data.liabilities;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Liability Overview</CardTitle>
          <CardDescription>Track your installments and loans.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Project Installments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {installments.map(p => {
                    const progress = (p.paid / p.total) * 100;
                    const remaining = p.total - p.paid;
                    return (
                    <div key={p.id} className="p-4 bg-secondary rounded-lg">
                        <div className="flex justify-between items-center">
                            <p className="font-bold">{p.project} <span className="font-normal text-muted-foreground">- {p.developer}</span></p>
                            <span className="text-sm font-semibold text-green-700">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="my-2 h-2" />
                        <div className="grid grid-cols-2 text-sm gap-x-4 gap-y-1 mt-2">
                            <div><p className="text-muted-foreground">Total</p><p className="font-medium">{p.total.toLocaleString()} {p.currency}</p></div>
                            <div><p className="text-muted-foreground">Paid</p><p className="font-medium">{p.paid.toLocaleString()} {p.currency}</p></div>
                            <div><p className="text-muted-foreground">Remaining</p><p className="font-medium text-destructive">{remaining.toLocaleString()}</p></div>
                            <div><p className="text-muted-foreground">Next Installment</p><p className="font-medium">{p.amount.toLocaleString()} {p.currency}</p></div>
                            <div className="col-span-2"><p className="text-muted-foreground">Next Due Date</p><p className="font-medium">{new Date(p.nextDueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} ({p.frequency})</p></div>
                        </div>
                    </div>)
                })}
              </div>
            </div>
            
            <div>
                <h3 className="text-xl font-semibold mb-4">Loans</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loans.map(l => {
                    const paid = l.initial - l.remaining;
                    const progress = (paid / l.initial) * 100;
                    return (
                    <div key={l.id} className="p-4 bg-secondary rounded-lg">
                        <div className="flex justify-between items-center">
                            <p className="font-bold">{l.lender} Loan</p>
                            <span className="text-sm font-semibold text-green-700">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="my-2 h-2" />
                         <div className="grid grid-cols-2 text-sm gap-1 mt-2">
                            <p className="text-muted-foreground">Remaining:</p><p className="font-medium text-destructive">{l.remaining.toLocaleString()} {l.currency}</p>
                            <p className="text-muted-foreground">Monthly:</p><p className="font-medium">{l.monthlyPayment.toLocaleString()} {l.currency}</p>
                        </div>
                    </div>)
                })}
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
