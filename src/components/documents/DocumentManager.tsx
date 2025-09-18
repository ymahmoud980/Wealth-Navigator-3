
"use client";

import { useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Trash2, ExternalLink, FileText } from "lucide-react";
import type { Document } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DocumentManagerProps {
  item: { id: string; documents?: Document[] };
  onUpdate: (newDocuments: Document[]) => void;
}

export function DocumentManager({ item, onUpdate }: DocumentManagerProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFileToUpload(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!fileToUpload) {
      toast({ title: "No file selected", variant: "destructive" });
      return;
    }
    setIsUploading(true);
    try {
      const filePath = `documents/${item.id}/${fileToUpload.name}`;
      const fileRef = ref(storage, filePath);
      
      const snapshot = await uploadBytes(fileRef, fileToUpload);
      const url = await getDownloadURL(snapshot.ref);

      const newDocument: Document = { name: fileToUpload.name, url };
      const updatedDocuments = [...(item.documents || []), newDocument];
      
      onUpdate(updatedDocuments);

      toast({ title: "Upload successful!", description: `${fileToUpload.name} has been saved.` });
      setFileToUpload(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Upload failed", description: "Could not upload the file. Please try again.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(deleteTarget.name);
    try {
      const fileRef = ref(storage, `documents/${item.id}/${deleteTarget.name}`);
      await deleteObject(fileRef);

      const updatedDocuments = (item.documents || []).filter(doc => doc.url !== deleteTarget.url);
      onUpdate(updatedDocuments);

      toast({ title: "Document deleted", description: `${deleteTarget.name} has been removed.` });
    } catch (error) {
      console.error("Delete error:", error);
      toast({ title: "Delete failed", description: "Could not delete the document. Please try again.", variant: "destructive" });
    } finally {
      setIsDeleting(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input type="file" onChange={handleFileChange} className="h-9 text-xs flex-1" />
        <Button size="sm" onClick={handleUpload} disabled={isUploading || !fileToUpload}>
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
      </div>

      <div className="space-y-2">
        {(item.documents && item.documents.length > 0) ? (
          item.documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-background rounded-md text-sm">
              <div className="flex items-center gap-2 truncate">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0"/>
                <span className="truncate">{doc.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                </Button>
                 <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/80 hover:text-destructive" onClick={() => setDeleteTarget(doc)} disabled={!!isDeleting}>
                    {isDeleting === doc.name ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                 </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground italic text-center py-2">No documents uploaded for this item.</p>
        )}
      </div>
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this document?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "{deleteTarget?.name}" from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
