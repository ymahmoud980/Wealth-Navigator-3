
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit, Save } from "lucide-react"

import { initialFinancialData } from "@/lib/data"
import { useCurrency } from "@/hooks/use-currency"
import type { FinancialData, RealEstateAsset, CashAsset, GoldAsset, OtherAsset } from "@/lib/types"

export default function AssetsPage() {
  const { format } = useCurrency()
  const [data, setData] = useState<FinancialData>(initialFinancialData);

  // In a real app, editing would involve more robust state management and API calls.
  // For this prototype, we are just displaying the data from your model.
  
  const { realEstate, cash, gold, otherAssets } = data.assets;
  const offPlanAssets = data.liabilities.installments;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Asset Overview</CardTitle>
          <CardDescription>Detailed breakdown of all your assets.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Real Estate (Existing)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {realEstate.map(p => (
                      <div key={p.id} className="p-4 bg-secondary rounded-lg">
                          <p className="font-bold">{p.name}</p>
                          <p className="text-sm text-muted-foreground">{p.location}</p>
                          <p className="text-sm font-semibold mt-2">Value: {p.currentValue.toLocaleString()} {p.currency}</p>
                          {p.monthlyRent > 0 && <p className="text-sm mt-1">Rent: {p.monthlyRent.toLocaleString()} {p.rentCurrency || p.currency} ({p.rentFrequency})</p>}
                      </div>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Real Estate (Under Development)</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {offPlanAssets.map(p => (
                      <div key={p.id} className="p-4 bg-secondary rounded-lg">
                          <p className="font-bold">{p.project}</p>
                           <p className="text-sm font-semibold mt-2">Current Asset Value: {(p.paid * 2).toLocaleString()} {p.currency}</p>
                           <p className="text-xs text-muted-foreground mt-1">(Calculated as 2x amount paid)</p>
                      </div>
                  ))}
              </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Cash, Gold & Other Assets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cash.map(c => (
                        <div key={c.id} className="p-4 bg-secondary rounded-lg">
                           <p className="font-bold">Cash <span className="font-normal text-muted-foreground">- {c.location}</span></p>
                           <p className="text-sm mt-1">Amount: {c.amount.toLocaleString()} {c.currency}</p>
                        </div>
                    ))}
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="font-bold">Gold Bars</p>
                        <p className="text-sm mt-1">Grams: {gold[0].grams.toLocaleString()}</p>
                    </div>
                    {otherAssets.map(o => (
                         <div key={o.id} className="p-4 bg-secondary rounded-lg">
                            <p className="font-bold">{o.description}</p>
                            <p className="text-sm mt-1">Value: {o.value.toLocaleString()} {o.currency}</p>
                        </div>
                    ))}
                </div>
            </div>
        </CardContent>
      </Card>
    </>
  )
}
