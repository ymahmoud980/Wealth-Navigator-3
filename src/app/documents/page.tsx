
"use client";

import { useFinancialData } from "@/contexts/FinancialDataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { RealEstateAsset, UnderDevelopmentAsset, Installment, Loan } from "@/lib/types";
import { DocumentManager } from "@/components/documents/DocumentManager";

type DocumentedItem = (RealEstateAsset | UnderDevelopmentAsset | Installment | Loan) & { 
  name: string;
  type: 'asset' | 'liability';
};

export default function DocumentsPage() {
  const { data, setData } = useFinancialData();

  const allItems: DocumentedItem[] = [
    ...data.assets.realEstate.map(a => ({ ...a, name: `Asset: ${a.name}`, type: 'asset' as 'asset' })),
    ...data.assets.underDevelopment.map(a => ({ ...a, name: `Asset: ${a.name}`, type: 'asset' as 'asset' })),
    ...data.liabilities.installments.map(i => ({ ...i, name: `Liability: ${i.project}`, type: 'liability' as 'liability' })),
    ...data.liabilities.loans.map(l => ({ ...l, name: `Liability: ${l.lender} Loan`, type: 'liability' as 'liability' })),
  ];

  // This function will be passed to the DocumentManager to handle updates
  const handleUpdateDocuments = (itemId: string, itemType: 'asset' | 'liability', newDocuments: { name: string, url: string }[]) => {
      const updatedData = JSON.parse(JSON.stringify(data));

      let itemFound = false;
      if (itemType === 'asset') {
          for (const key in updatedData.assets) {
              const assetCategory = updatedData.assets[key as keyof typeof updatedData.assets];
              if (Array.isArray(assetCategory)) {
                  const item = assetCategory.find((i: any) => i.id === itemId);
                  if (item) {
                      item.documents = newDocuments;
                      itemFound = true;
                      break;
                  }
              }
          }
      } else { // liability
          for (const key in updatedData.liabilities) {
              const liabilityCategory = updatedData.liabilities[key as keyof typeof updatedData.liabilities];
              if (Array.isArray(liabilityCategory)) {
                  const item = liabilityCategory.find((i: any) => i.id === itemId);
                  if (item) {
                      item.documents = newDocuments;
                      itemFound = true;
                      break;
                  }
              }
          }
      }

      if (itemFound) {
          setData(updatedData);
      }
  };


  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="bg-primary text-primary-foreground p-3 rounded-lg">
            <FolderKanban className="h-8 w-8" />
        </div>
        <div>
            <h1 className="text-3xl font-bold">Document Library</h1>
            <p className="text-muted-foreground">
                Upload, view, and manage documents for your assets and liabilities.
            </p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Document Management powered by Firebase</AlertTitle>
        <AlertDescription>
         Your documents are securely stored in Firebase Storage. You can now upload, view, and delete files directly for each item below.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>All Assets & Liabilities</CardTitle>
          <CardDescription>
            Manage the documents linked to each item.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            {allItems.map(item => (
                <div key={item.id} className="p-3 bg-secondary rounded-md">
                    <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                        ID for reference: <span className="font-mono bg-muted px-1 py-0.5 rounded">{item.id}</span>
                        </p>
                    </div>
                    <div className="mt-2 pl-4 border-l-2 border-primary/20">
                        <DocumentManager 
                            item={item} 
                            onUpdate={(newDocs) => handleUpdateDocuments(item.id, item.type, newDocs)}
                        />
                    </div>
                </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
