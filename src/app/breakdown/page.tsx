
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, TrendingDown, Wallet, DollarSign } from "lucide-react"
import { useCurrency } from "@/hooks/use-currency";
import { calculateMetrics, convert, rates } from "@/lib/calculations";
import { useFinancialData } from "@/contexts/FinancialDataContext";

export default function BreakdownPage() {
  const { currency, format } = useCurrency();
  const { data } = useFinancialData();

  const metrics = calculateMetrics(data, currency);

  const Row = ({ label, value, isSub = false, isNegative = false, isTotal = false, isGrandTotal = false }: { label: string, value: number, isSub?: boolean, isNegative?: boolean, isTotal?: boolean, isGrandTotal?: boolean }) => (
      <div className={`flex justify-between items-center text-sm ${isSub ? 'pl-4 text-xs' : ''} ${isTotal ? 'font-semibold pt-2 mt-2 border-t' : ''} ${isGrandTotal ? 'font-bold text-lg pt-2 border-t' : ''}`}>
          <span className={isTotal || isGrandTotal ? '' : 'text-muted-foreground'}>{label}</span>
          <span className={`${isGrandTotal ? 'text-primary' : ''} ${isNegative ? 'text-destructive' : ''}`}>{isNegative && '- '}{format(value)}</span>
      </div>
  )

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Calculation Breakdown</h1>
      <p className="text-muted-foreground">This section shows the math behind your key financial figures. It provides a transparent, line-by-line calculation of your total assets, liabilities, and cash flow, all converted to your selected currency ({currency}).</p>
      
      <div className="grid gap-8 md:grid-cols-2">

        {/* Net Worth Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign className="h-6 w-6 text-primary" /><span>Net Worth Calculation</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="Total Asset Value" value={metrics.totalAssets} />
            <Row label="Total Liabilities" value={metrics.totalLiabilities} isNegative={true} />
            <Separator />
            <Row label="Net Worth" value={metrics.netWorth} isGrandTotal={true} />
          </CardContent>
        </Card>
        
        {/* Net Cash Flow Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wallet className="h-6 w-6 text-blue-500" /><span>Avg. Net Cash Flow Calculation</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="Total Monthly Income" value={metrics.totalIncome} />
            <Row label="Total Monthly Expenses" value={metrics.totalExpenses} isNegative={true}/>
            <Separator />
            <Row label="Avg. Net Cash Flow" value={metrics.netCashFlow} isGrandTotal={true} />
          </CardContent>
        </Card>

        {/* Asset Value Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-6 w-6 text-green-500" /><span>Asset Value Details</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Row label="Existing Real Estate" value={metrics.assets.existingRealEstate} isTotal />
            {data.assets.realEstate.map(asset => <Row key={asset.id} label={asset.name} value={convert(asset.currentValue, asset.currency, currency, rates)} isSub />)}

            <Row label="Off-Plan Real Estate (Paid*2)" value={metrics.assets.offPlanRealEstate} isTotal />
            {data.liabilities.installments.map(asset => <Row key={asset.id} label={asset.project} value={convert(asset.paid * 2, asset.currency, currency, rates)} isSub />)}
            
            <Row label="Cash Holdings" value={metrics.assets.cash} isTotal />
            {data.assets.cash.map(asset => <Row key={asset.id} label={`Cash - ${asset.location}`} value={convert(asset.amount, asset.currency, currency, rates)} isSub />)}

            <Row label="Gold" value={metrics.assets.gold} isTotal />
            {data.assets.gold.map(asset => <Row key={asset.id} label={asset.description} value={convert(asset.grams, 'GOLD_GRAM', currency, rates)} isSub />)}

            <Row label="Other Assets" value={metrics.assets.other} isTotal />
            {data.assets.otherAssets.map(asset => <Row key={asset.id} label={asset.description} value={convert(asset.value, asset.currency, currency, rates)} isSub />)}
            
            <Separator className="my-4"/>
            <Row label="Total Asset Value" value={metrics.totalAssets} isGrandTotal={true} />
          </CardContent>
        </Card>

        {/* Liabilities Breakdown */}
        <Card>
           <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingDown className="h-6 w-6 text-red-500" /><span>Liabilities Details</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Row label="Loans" value={metrics.liabilities.loans} isTotal isNegative />
            {data.liabilities.loans.map(l => <Row key={l.id} label={`${l.lender} Loan`} value={convert(l.remaining, l.currency, currency, rates)} isSub isNegative />)}

            <Row label="Installments Remaining" value={metrics.liabilities.installments} isTotal isNegative />
            {data.liabilities.installments.map(i => <Row key={i.id} label={i.project} value={convert(i.total - i.paid, i.currency, currency, rates)} isSub isNegative />)}

            <Separator className="my-4" />
            <Row label="Total Liabilities" value={metrics.totalLiabilities} isGrandTotal={true} isNegative/>
          </CardContent>
        </Card>

         {/* Income Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Row label="Salary" value={metrics.income.salary} isTotal />
            <Row label="Property Rentals" value={metrics.income.rent} isTotal />
            {data.assets.realEstate.filter(r => r.monthlyRent > 0).map(r => <Row key={r.id} label={r.name} value={convert(r.monthlyRent, r.rentCurrency || r.currency, currency, rates)} isSub />)}

            <Separator className="my-4" />
            <Row label="Total Monthly Income" value={metrics.totalIncome} isGrandTotal={true} />
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
             <Row label="Loan Payments" value={metrics.expenses.loans} isTotal isNegative />
             {data.liabilities.loans.map(l => <Row key={l.id} label={`${l.lender} Loan`} value={convert(l.monthlyPayment, l.currency, currency, rates)} isSub isNegative />)}
            
            <Row label="Household Expenses" value={metrics.expenses.household} isTotal isNegative />
            {data.monthlyExpenses.household.map(h => <Row key={h.id} label={h.description} value={convert(h.amount, h.currency, currency, rates)} isSub isNegative />)}

            <Row label="Avg. Project Installments" value={metrics.expenses.installmentsAvg} isTotal isNegative />
             {data.liabilities.installments.map(p => {
                let monthlyCost = 0;
                if (p.frequency === 'Annual') monthlyCost = p.amount / 12;
                else if (p.frequency === 'Semi-Annual') monthlyCost = p.amount / 6;
                else if (p.frequency === 'Quarterly') monthlyCost = p.amount / 3;
                return <Row key={p.id} label={p.project} value={convert(monthlyCost, p.currency, currency, rates)} isSub isNegative />
             })}

            <Separator className="my-4" />
            <Row label="Total Monthly Expenses" value={metrics.totalExpenses} isGrandTotal={true} isNegative />
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
