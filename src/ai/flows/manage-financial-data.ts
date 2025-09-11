
'use server';

/**
 * @fileOverview A flow to manage financial data in Firestore.
 *
 * - getFinancialData - A function that retrieves the shared financial data document.
 * - setFinancialData - A function that saves the shared financial data document.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {db} from '@/lib/firebase';
import type {FinancialData} from '@/lib/types';
import {initialFinancialData} from '@/lib/data';

// Define a Zod schema for FinancialData for validation if needed, or use z.any() for simplicity.
// For this use case, we'll trust the input from our own front-end.
const FinancialDataSchema = z.any();

export const getFinancialDataFlow = ai.defineFlow(
  {
    name: 'getFinancialDataFlow',
    inputSchema: z.void(),
    outputSchema: FinancialDataSchema,
  },
  async () => {
    const docRef = doc(db, 'financialData', 'shared');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as FinancialData;
    } else {
      // If no document exists, create one with the initial data and return it
      await setDoc(docRef, initialFinancialData);
      return initialFinancialData;
    }
  }
);

export const setFinancialDataFlow = ai.defineFlow(
  {
    name: 'setFinancialDataFlow',
    inputSchema: FinancialDataSchema,
    outputSchema: z.object({success: z.boolean()}),
  },
  async (data) => {
    const docRef = doc(db, 'financialData', 'shared');
    await setDoc(docRef, data);
    return { success: true };
  }
);

export async function getFinancialData(): Promise<FinancialData> {
  return await getFinancialDataFlow();
}

export async function setFinancialData(data: FinancialData): Promise<{success: boolean}> {
    return await setFinancialDataFlow(data);
}
