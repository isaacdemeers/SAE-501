"use client";

import * as React from "react";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import API_BASE_URL from "../../../utils/apiConfig";
import { editUser } from "@/lib/request";

interface ProfilePhotoUploadProps {
  userId?: number;
  onUpload: (file: File) => void;
  onCancel: () => void;
}

export function ProfilePhotoUpload({
  userId,
  onUpload,
  onCancel,
}: ProfilePhotoUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    if (!["image/svg+xml", "image/png", "image/jpeg"].includes(file.type)) {
      alert("Veuillez télécharger uniquement des fichiers SVG, PNG ou JPEG");
      return;
    }

    // Revoke the previous URL if any
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Create a temporary URL for preview
    const tempUrl = URL.createObjectURL(file);

    // Create image to check dimensions
    const img = new window.Image();
    img.src = tempUrl;
    img.onload = () => {
      if (img.width > 800 || img.height > 800) {
        alert(
          "Les dimensions de l'image ne doivent pas dépasser 800x800 pixels"
        );
        URL.revokeObjectURL(tempUrl); // Revoke the invalid URL
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(tempUrl); // Set the valid preview URL
    };
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) return;

    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      console.log('Starting upload with formData:', {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size
      });

      const response = await editUser(userId, formData);
      console.log('Upload response:', response);

      if (response && (response.photo || response.success)) {
        console.log('Upload successful, photo URL:', response.photo);
        onUpload(selectedFile);
      } else {
        console.error('Invalid response format:', response);
        throw new Error(response.error || 'Erreur lors de l\'upload de la photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert(`Erreur lors de l'upload de la photo: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    onCancel();
  };

  // Cleanup preview URL on component unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardHeader>
          <CardTitle>Changer photo de profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {previewUrl ? (
            <div className="relative w-full h-64">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          ) : (
            <div
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-colors
                ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25"
                }
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".svg,.png,.jpg,.jpeg"
                onChange={handleChange}
              />
              <UploadCloud className="w-10 h-10 mb-2 text-muted-foreground" />
              <p className="text-sm text-center text-muted-foreground">
                Cliquez pour télécharger ou faites glisser et déposez
                <br />
                SVG, PNG ou JPEG (max. 800 × 800)
              </p>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile}>
              Enregistrer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
