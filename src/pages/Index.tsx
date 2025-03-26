
import React, { useState, useCallback, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import FileList, { FileItem } from '@/components/FileList';
import FileDetails from '@/components/FileDetails';
import { useToast } from '@/hooks/use-toast';
import MainNavbar from '@/components/MainNavbar';
import { SidebarInset } from '@/components/ui/sidebar';

const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const Index = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const { toast } = useToast();

  // Initialize or load saved files from localStorage
  useEffect(() => {
    try {
      const savedFiles = localStorage.getItem('fileStorage');
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles).map((file: any) => ({
          ...file,
          createdAt: new Date(file.createdAt),
        }));
        setFiles(parsedFiles);
      }
    } catch (error) {
      console.error('Error loading files from localStorage:', error);
    }
  }, []);

  // Save files to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('fileStorage', JSON.stringify(files));
    } catch (error) {
      console.error('Error saving files to localStorage:', error);
    }
  }, [files]);

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    const fileItems: FileItem[] = newFiles.map((file) => {
      const fileUrl = URL.createObjectURL(file);
      
      return {
        id: generateUniqueId(),
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        url: fileUrl,
        createdAt: new Date(),
      };
    });

    setFiles((prevFiles) => [...prevFiles, ...fileItems]);
  }, []);

  const handleViewFile = useCallback((file: FileItem) => {
    setSelectedFile(file);
  }, []);

  const handleCloseFileDetails = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const handleDeleteFile = useCallback((id: string) => {
    setFiles((prevFiles) => {
      const fileToDelete = prevFiles.find(file => file.id === id);
      
      // Revoke the object URL to avoid memory leaks
      if (fileToDelete) {
        URL.revokeObjectURL(fileToDelete.url);
      }
      
      return prevFiles.filter(file => file.id !== id);
    });
  }, []);

  const handleDeleteAll = useCallback(() => {
    if (files.length === 0) return;
    
    // Revoke all object URLs
    files.forEach(file => {
      URL.revokeObjectURL(file.url);
    });
    
    setFiles([]);
    
    toast({
      title: "All files deleted",
      description: "All files have been removed from your storage.",
      variant: "destructive",
    });
  }, [files, toast]);

  return (
    <div className="flex min-h-screen bg-background">
      <MainNavbar />
      <SidebarInset>
        <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="animate-slide-down">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                File Storage
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">文件管理</h1>
              <p className="text-muted-foreground mt-1">上传、管理和组织您的文件</p>
            </div>
            
            {files.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="text-sm text-destructive hover:text-destructive/80 transition-colors animate-fade-in"
              >
                Delete All Files
              </button>
            )}
          </div>
        </header>

        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid gap-6">
            <FileUpload onFilesAdded={handleFilesAdded} />
            
            <FileList 
              files={files} 
              onViewFile={handleViewFile} 
              onDeleteFile={handleDeleteFile} 
            />
          </div>
        </main>

        {selectedFile && (
          <FileDetails
            file={selectedFile}
            onClose={handleCloseFileDetails}
            onDeleteFile={handleDeleteFile}
          />
        )}
      </SidebarInset>
    </div>
  );
};

export default Index;
