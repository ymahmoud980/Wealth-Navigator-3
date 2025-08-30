
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, HeartPulse, HelpCircle, Info, Lightbulb, Loader2, ThumbsUp, TrendingDown } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useCurrency } from "@/hooks/use-currency";
import { useToast } from "@/hooks/use-toast";
import { getFinancialHealthAnalysis, type GetFinancialHealthAnalysisOutput } from "@/ai/flows/get-financial-health-analysis";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function HealthPage() {
  const { data } = useFinancialData();
  const { currency } = useCurrency();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<GetFinancialHealthAnalysisOutput | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await getFinancialHealthAnalysis({
        financialData: data,
        displayCurrency: currency,
      });
      setAnalysis(result);
    } catch (error) {
      console.error("Error getting analysis:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not perform the financial health analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!analysis) return;

    const reportContent = `
# Financial Health Analysis

**Date:** ${new Date().toLocaleDateString()}
**Display Currency:** ${currency}

---

## Financial Health Score: ${analysis.healthScore} / 100

---

## Summary
${analysis.summary}

---

## Strengths
${analysis.strengths.map(item => `- ${item}`).join('\n')}

---

## Potential Risks
${analysis.risks.map(item => `- ${item}`).join('\n')}

---

## Suggestions
${analysis.suggestions.map(item => `- ${item}`).join('\n')}
    `;

    const blob = new Blob([reportContent.trim()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Financial-Health-Analysis-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  }

  const ListItem = ({ text, icon }: { text: string, icon: React.ReactNode }) => (
    <li className="flex items-start gap-3">
        <div className="p-1 bg-secondary rounded-full mt-1">
            {icon}
        </div>
        <span className="flex-1">{text}</span>
    </li>
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Financial Health Analysis</CardTitle>
          <CardDescription>
            Get a comprehensive AI-powered analysis of your current financial situation. The AI will act as your personal financial advisor to assess your strengths, identify risks, and provide actionable suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HeartPulse className="mr-2 h-4 w-4" />}
            Analyze My Financial Health
          </Button>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-16 space-y-4">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="text-muted-foreground">Analyzing your financial data...</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Your Financial Health Score</CardTitle>
                     <Button variant="outline" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-center gap-4">
                        <div className={`text-6xl font-bold ${getScoreColor(analysis.healthScore)}`}>
                            {analysis.healthScore}
                            <span className="text-3xl text-muted-foreground">/100</span>
                        </div>
                        <Progress value={analysis.healthScore} className="h-4 flex-1" />
                    </div>
                     <Separator />
                    <div>
                         <p className="text-sm font-medium flex items-center gap-2 mb-2"><Info className="h-4 w-4 text-primary"/> Summary</p>
                         <p className="text-muted-foreground text-sm p-4 bg-secondary rounded-md">{analysis.summary}</p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ThumbsUp className="text-green-500" /> Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4 text-sm">
                            {analysis.strengths.map((item, index) => <ListItem key={index} text={item} icon={<CheckCircle className="h-4 w-4 text-green-600"/>} />)}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><TrendingDown className="text-red-500"/> Potential Risks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4 text-sm">
                           {analysis.risks.map((item, index) => <ListItem key={index} text={item} icon={<HelpCircle className="h-4 w-4 text-red-600"/>} />)}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb className="text-yellow-500"/> Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4 text-sm">
                             {analysis.suggestions.map((item, index) => <ListItem key={index} text={item} icon={<Lightbulb className="h-4 w-4 text-yellow-600"/>} />)}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
}
