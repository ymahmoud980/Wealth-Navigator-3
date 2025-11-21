"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrainCircuit, TrendingUp, ShieldAlert, Target, ArrowRight } from "lucide-react";

export default function AdvisorPage() {
  // In a real scenario, we would pull this from your 'metrics' context
  const mockRiskLevel = "Moderate"; 
  
  const recommendations = [
    {
      id: 1,
      type: "Opportunity",
      title: "Gold is trending up",
      desc: "Market analysis suggests a 5% increase in precious metals. Consider increasing your allocation in Gold.",
      icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
      action: "View Gold Assets"
    },
    {
      id: 2,
      type: "Warning",
      title: "High Cash Exposure",
      desc: "Inflation is currently 3.2%. Your cash holdings are losing purchasing power. Consider moving 20% to Bonds.",
      icon: <ShieldAlert className="h-5 w-5 text-amber-400" />,
      action: "Optimize Cash"
    },
    {
      id: 3,
      type: "Strategy",
      title: "Diversify Real Estate",
      desc: "90% of your net worth is in one property. This is high risk. Look into REITs to diversify.",
      icon: <Target className="h-5 w-5 text-blue-400" />,
      action: "Analyze Portfolio"
    }
  ];

  return (
    <div className="min-h-screen p-6 lg:p-12 space-y-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
          AI Wealth Advisor
        </h1>
        <p className="text-muted-foreground mt-2">
          Personalized strategy based on your real-time assets and market conditions.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Market Pulse Card */}
        <Card className="glass-panel border-primary/20 col-span-1 lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <CardTitle>Today's Market Pulse</CardTitle>
            </div>
            <CardDescription>Daily AI-generated financial insights</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50 border border-white/5">
              <p className="text-sm text-muted-foreground">S&P 500</p>
              <p className="text-xl font-bold text-emerald-400">+1.2%</p>
              <p className="text-xs mt-1">Tech sector leading the rally.</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 border border-white/5">
              <p className="text-sm text-muted-foreground">Gold (XAU)</p>
              <p className="text-xl font-bold text-red-400">-0.4%</p>
              <p className="text-xs mt-1">Correction after weekly high.</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 border border-white/5">
              <p className="text-sm text-muted-foreground">USD/EUR</p>
              <p className="text-xl font-bold text-blue-400">0.92</p>
              <p className="text-xs mt-1">Stable ahead of Fed meeting.</p>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations List */}
        {recommendations.map((rec) => (
          <Card key={rec.id} className="glass-panel hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-full bg-secondary/80">{rec.icon}</div>
                <Badge variant="outline">{rec.type}</Badge>
              </div>
              <CardTitle className="mt-4">{rec.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {rec.desc}
              </p>
              <Button className="w-full group" variant="ghost">
                {rec.action} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}