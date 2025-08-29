"use client"

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { assets } from "@/lib/data"
import { useCurrency } from "@/hooks/use-currency"
import type { ExchangeRates } from "@/lib/types";

const rates: ExchangeRates = {
  USD: 1,
  EGP: 47.5,
  KWD: 0.31,
  TRY: 32.8,
};

const convertToUsd = (value: number, currency: keyof ExchangeRates) => {
  return value / rates[currency];
}

const data = assets.reduce((acc, asset) => {
  const existing = acc.find(item => item.name === asset.location);
  const valueInUsd = convertToUsd(asset.marketValue, asset.currency)
  if (existing) {
    existing.value += valueInUsd;
  } else {
    acc.push({ name: asset.location, value: valueInUsd });
  }
  return acc;
}, [] as { name: string; value: number }[]);

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];

export function AssetAllocationChart() {
  const { format } = useCurrency();
  
  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={{
              background: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
            }}
            formatter={(value: number) => [format(value, "USD"), "Value"]}
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
