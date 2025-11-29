"use client";

import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { useCurrency } from "@/hooks/use-currency";

interface AssetAllocationChartProps {
  assetsBreakdown?: any;
  totalAssets?: number;
}

export function AssetAllocationChart({ assetsBreakdown, totalAssets = 0 }: AssetAllocationChartProps) {
  const { format } = useCurrency();
  const [isMounted, setIsMounted] = useState(false);

  // 1. SSR PROTECTION: Don't render ANYTHING until we are in the browser
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[350px] flex items-center justify-center text-muted-foreground">Loading...</div>;

  // 2. DATA PROTECTION: If data is missing, show empty state
  if (!assetsBreakdown) {
    return <div className="h-[350px] flex items-center justify-center text-muted-foreground">No asset data available</div>;
  }

  const data = [
    { name: "Real Estate", value: Number(assetsBreakdown.existingRealEstate) || 0, color: "#10b981" },
    { name: "Off-Plan", value: Number(assetsBreakdown.offPlanRealEstate) || 0, color: "#34d399" },
    { name: "Gold", value: Number(assetsBreakdown.gold) || 0, color: "#fbbf24" },
    { name: "Silver", value: Number(assetsBreakdown.silver) || 0, color: "#94a3b8" },
    { name: "Cash", value: Number(assetsBreakdown.cash) || 0, color: "#3b82f6" },
    { name: "Other", value: Number(assetsBreakdown.other) || 0, color: "#a855f7" },
  ].filter(item => item.value > 0);

  if (data.length === 0) {
    return <div className="h-[350px] flex items-center justify-center text-muted-foreground">Start adding assets to see the chart</div>;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const safeTotal = totalAssets || 1; 
      const percentage = ((item.value / safeTotal) * 100).toFixed(1);
      return (
        <div className="bg-[#0f172a]/95 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl">
          <p className="font-bold text-white mb-1">{item.name}</p>
          <p className="text-emerald-400 font-mono text-lg">{format(item.value)}</p>
          <p className="text-xs text-muted-foreground mt-1">{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[350px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ top: 0, right: 30, left: 20, bottom: 0 }} barSize={32}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" width={140} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}