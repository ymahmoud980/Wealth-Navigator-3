
"use client";

import { useFinancialData } from "@/contexts/FinancialDataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderKanban, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const DocumentRow = ({ item }: { item: { id: string; name: string } }) => {
  const openDocument = () => {
    // We try a few common extensions. User needs to name the file correctly.
    const extensions = ['pdf', 'png', 'jpg', 'jpeg', 'docx'];
    let found = false;
    // Check for file existence by trying to open it. A bit of a hack for client-side.
    // A better approach would be a server endpoint that checks for file existence.
    // For now, we just link to the most likely one (pdf).
    window.open(`/documents/${item.id}.pdf`, '_blank');
  };

  return (
    <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-xs text-muted-foreground">Required filename: <span className="font-mono bg-muted px-1 py-0.5 rounded">{item.id}.pdf</span></p>
      </div>
      <Button variant="outline" size="sm" onClick={openDocument}>
        <ExternalLink className="mr-2 h-4 w-4" />
        View Document
      </Button>
    </div>
  );
};


export default function DocumentsPage() {
  const { data } = useFinancialData();

  const allItems = [
    ...data.assets.realEstate.map(a => ({ id: a.id, name: `Asset: ${a.name}` })),
    ...data.assets.underDevelopment.map(a => ({ id: a.id, name: `Asset: ${a.name}` })),
    ...data.liabilities.installments.map(i => ({ id: i.id, name: `Liability: ${i.project}` })),
    ...data.liabilities.loans.map(l => ({ id: l.id, name: `Liability: ${l.lender} Loan` })),
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="bg-primary text-primary-foreground p-3 rounded-lg">
            <FolderKanban className="h-8 w-8" />
        </div>
        <div>
            <h1 className="text-3xl font-bold">Document Library</h1>
            <p className="text-muted-foreground">
                Access all your documents for assets and liabilities in one place.
            </p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How to Add Documents</AlertTitle>
        <AlertDescription>
          To add a document, find the required filename for an item below (e.g., <span className="font-mono bg-background px-1 rounded">ud1.pdf</span>). Then, place your file with that exact name inside the <span className="font-mono bg-background px-1 rounded">public/documents/</span> folder in your project. The "View Document" button will then open that file.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>All Assets & Liabilities</CardTitle>
          <CardDescription>
            Use the ID shown below to name your document file. Currently, only PDF files are supported.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            {allItems.map(item => (
                <DocumentRow key={item.id} item={item} />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
