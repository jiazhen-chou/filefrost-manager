
import React, { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFilesAdded: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesAdded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        onFilesAdded(droppedFiles);
        toast({
          title: `${droppedFiles.length} ${droppedFiles.length === 1 ? 'file' : 'files'} added`,
          description: "Your files have been added successfully.",
        });
        e.dataTransfer.clearData();
      }
    },
    [onFilesAdded, toast]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFiles = Array.from(e.target.files);
        onFilesAdded(selectedFiles);
        toast({
          title: `${selectedFiles.length} ${selectedFiles.length === 1 ? 'file' : 'files'} added`,
          description: "Your files have been added successfully.",
        });
        
        // Reset the input value so the same file can be uploaded again if needed
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [onFilesAdded, toast]
  );

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`upload-zone ${isDragging ? 'upload-zone-dragging' : 'upload-zone-idle'} animate-scale-up`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInput}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="icon-wrapper mb-4">
          <Upload className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-medium mb-2">Upload Files</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Drag and drop files here, or click to select files
        </p>
      </div>

      {isDragging && (
        <div className="absolute inset-0 bg-primary/5 flex items-center justify-center rounded-xl">
          <div className="text-primary font-medium">Drop files to upload</div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
