
'use server';

/**
 * @fileOverview An AI agent that analyzes a user's complete financial status.
 *
 * - getFinancialHealthAnalysis - A function that provides a comprehensive financial analysis.
 * - GetFinancialHealthAnalysisInput - The input type for the function.
 * - GetFinancialHealthAnalysisOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {FinancialData} from '@/lib/types';


// We don't define a Zod schema for the input here because the FinancialData type is complex
// and already well-defined in TypeScript. We will pass it directly to the flow.
export type GetFinancialHealthAnalysisInput = {
  financialData: FinancialData,
  displayCurrency: string,
};

const FinancialHealthAnalysisOutputSchema = z.object({
    healthScore: z.number().describe('A financial health score from 0 to 100, where 100 is excellent.'),
    summary: z.string().describe('A brief, one-paragraph summary of the overall financial situation.'),
    strengths: z.array(z.string()).describe('A list of key financial strengths.'),
    risks: z.array(z.string()).describe('A list of potential risks or areas for improvement.'),
    suggestions: z.array(z.string()).describe('A list of actionable suggestions for the user.'),
});

export type GetFinancialHealthAnalysisOutput = z.infer<typeof FinancialHealthAnalysisOutputSchema>;

export async function getFinancialHealthAnalysis(input: GetFinancialHealthAnalysisInput): Promise<GetFinancialHealthAnalysisOutput> {
  return getFinancialHealthAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialHealthAnalysisPrompt',
  input: {schema: z.any()},
  output: {schema: FinancialHealthAnalysisOutputSchema},
  prompt: `You are an expert financial advisor and wealth manager with deep accounting knowledge. Your task is to conduct a comprehensive analysis of a user's financial health based on the data they provide.

The user's data is provided as a JSON object. All calculations and the final analysis should be presented in the user's preferred display currency: {{{displayCurrency}}}.

Analyze the provided financial data:
\`\`\`json
{{{financialData}}}
\`\`\`

Based on your analysis, provide the following in JSON format:
1.  **healthScore**: An overall financial health score from 0 to 100. Consider factors like asset-to-liability ratio, cash flow positivity, diversification of assets, and debt levels.
2.  **summary**: A concise, one-paragraph summary of the user's financial situation.
3.  **strengths**: A list of 2-4 key financial strengths.
4.  **risks**: A list of 2-4 primary financial risks or areas needing attention.
5.  **suggestions**: A list of 2-4 clear, actionable suggestions for improvement.
`,
});

const getFinancialHealthAnalysisFlow = ai.defineFlow(
  {
    name: 'getFinancialHealthAnalysisFlow',
    inputSchema: z.any(),
    outputSchema: FinancialHealthAnalysisOutputSchema,
  },
  async (input: GetFinancialHealthAnalysisInput) => {
    // Stringify the complex object to pass it into the prompt context.
    const {output} = await prompt({
        financialData: JSON.stringify(input.financialData, null, 2),
        displayCurrency: input.displayCurrency,
    });
    return output!;
  }
);
