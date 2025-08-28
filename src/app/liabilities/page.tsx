
"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2 } from "lucide-react"

import { liabilities as initialLiabilities } from "@/lib/data"
import { useCurrency } from "@/hooks/use-currency"
import { LiabilityUploader } from "@/components/liabilities/LiabilityUploader"
import type { Liability } from "@/lib/types"
import { AddLiabilityDialog } from "@/components/liabilities/AddLiabilityDialog"

export default function LiabilitiesPage() {
  const { format } = useCurrency()
  const [liabilities, setLiabilities] = useState<Liability[]>(initialLiabilities)
  const [isAddLiabilityDialogOpen, setIsAddLiabilityDialogOpen] = useState(false)

  const handleDelete = (id: string) => {
    setLiabilities(liabilities.filter((liability) => liability.id !== id))
  }

  const handleAddLiability = (newLiability: Omit<Liability, 'id'>) => {
    setLiabilities([...liabilities, { ...newLiability, id: crypto.randomUUID() }])
    setIsAddLiabilityDialogOpen(false)
  }

  return (
    <div className="space-y-8">
      <LiabilityUploader />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Liability Overview</CardTitle>
            <CardDescription>Track your installments and loans.</CardDescription>
          </div>
          <Button 
            size="sm" 
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => setIsAddLiabilityDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Liability
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project/Loan</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Remaining Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {liabilities.map((liability) => {
                const remaining = liability.totalAmount - liability.amountPaid
                const progress = (liability.amountPaid / liability.totalAmount) * 100
                return (
                  <TableRow key={liability.id}>
                    <TableCell className="font-medium">{liability.name}</TableCell>
                    <TableCell>{liability.type}</TableCell>
                    <TableCell>{new Date(liability.dueDate).toLocaleDateString('en-CA')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={progress} className="w-32" />
                        <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{format(remaining)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(liability.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AddLiabilityDialog
        isOpen={isAddLiabilityDialogOpen}
        onClose={() => setIsAddLiabilityDialogOpen(false)}
        onAddLiability={handleAddLiability}
      />
    </div>
  )
}
