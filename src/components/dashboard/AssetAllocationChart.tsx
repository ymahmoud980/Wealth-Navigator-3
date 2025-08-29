
"use client"

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from "recharts"
import { useCurrency } from "@/hooks/use-currency";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

interface AssetAllocationChartProps {
    assetsBreakdown: {
        existingRealEstate: number;
        offPlanRealEstate: number;
        cash: number;
        gold: number;
        other: number;
    };
    totalAssets: number;
}

export function AssetAllocationChart({ assetsBreakdown, totalAssets }: AssetAllocationChartProps) {
  const { format } = useCurrency();
  
  const data = [
      { name: "Real Estate", value: assetsBreakdown.existingRealEstate + assetsBreakdown.offPlanRealEstate },
      { name: "Cash", value: assetsBreakdown.cash },
      { name: "Gold", value: assetsBreakdown.gold },
      { name: "Other", value: assetsBreakdown.other },
  ];

  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={{
              background: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
            }}
            formatter={(value: number, name, props) => [format(value), name]}
          />
          <Legend />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
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
