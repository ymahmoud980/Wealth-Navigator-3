
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, ArrowRightLeft } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { AssetAllocationChart } from "@/components/dashboard/AssetAllocationChart";
import { UpcomingPayments } from "@/components/dashboard/UpcomingPayments";
import { UpcomingRents } from "@/components/dashboard/UpcomingRents";
import { assets, liabilities, cashFlowItems } from "@/lib/data";
import { ExchangeRates } from "@/lib/types";

const rates: ExchangeRates = {
  USD: 1,
  EGP: 47.5,
  KWD: 0.31,
  TRY: 32.8,
};

const convertToUsd = (value: number, currency: keyof ExchangeRates) => {
  return value / rates[currency];
}

export default function DashboardPage() {
  const assetValue = assets.reduce((acc, asset) => {
    return acc + convertToUsd(asset.marketValue, asset.currency);
  }, 0);

  const liabilitiesValue = liabilities.reduce((acc, liability) => {
    const remaining = liability.totalAmount - liability.amountPaid;
    // Only count liabilities with a defined total amount
    if (liability.totalAmount > 0) {
      return acc + convertToUsd(remaining, liability.currency);
    }
    return acc;
  }, 0);

  const netWorth = assetValue - liabilitiesValue;

  const monthlyIncome = cashFlowItems
    .filter(item => item.type === 'Income')
    .reduce((sum, item) => sum + convertToUsd(item.amount, item.currency), 0);
  
  const monthlyRentalIncome = assets.reduce((sum, asset) => {
    return sum + convertToUsd(asset.rentalIncome, asset.currency);
  }, 0);

  const monthlyExpenses = cashFlowItems
    .filter(item => item.type === 'Expense')
    .reduce((sum, item) => sum + convertToUsd(item.amount, item.currency), 0);

  const monthlyInstallments = liabilities.reduce((sum, liability) => {
    return sum + convertToUsd(liability.monthlyInstallment, liability.currency);
  }, 0);

  const totalIncome = monthlyIncome + monthlyRentalIncome;
  const totalExpenses = monthlyExpenses + monthlyInstallments;
  const cashFlow = totalIncome - totalExpenses;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Net Worth" value={netWorth} icon={<DollarSign className="text-primary" />} />
        <StatCard title="Asset Value" value={assetValue} icon={<TrendingUp className="text-green-500" />} />
        <StatCard title="Liabilities" value={liabilitiesValue} icon={<TrendingDown className="text-red-500" />} />
        <StatCard title="Avg. Net Cash Flow" value={cashFlow} icon={<ArrowRightLeft className="text-blue-500" />} />
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Distribution of your assets by location.</CardDescription>
          </CardHeader>
          <CardContent>
            <AssetAllocationChart />
          </CardContent>
        </Card>

        <div className="lg:col-span-3 grid gap-8">
          <UpcomingPayments />
          <UpcomingRents />
        </div>
      </div>
    </div>
  );
}
