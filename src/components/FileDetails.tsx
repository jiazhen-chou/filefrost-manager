
import React from 'react';
import { X, Download, Trash, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileItem } from './FileList';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface FileDetailsProps {
  file: FileItem;
  onClose: () => void;
  onDeleteFile: (id: string) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

const FileDetails: React.FC<FileDetailsProps> = ({ file, onClose, onDeleteFile }) => {
  const { toast } = useToast();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: `${file.name} will be downloaded to your device.`,
    });
  };

  const handleDelete = () => {
    onDeleteFile(file.id);
    onClose();
    
    toast({
      title: "File deleted",
      description: "The file has been removed from your storage.",
      variant: "destructive",
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in flex items-center justify-center p-4">
      <div 
        className="glass-panel rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-scale-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="font-medium truncate">{file.name}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hidden md:flex"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {file.type.startsWith('image/') ? (
            <div className="flex items-center justify-center h-full">
              <img 
                src={file.url} 
                alt={file.name} 
                className="max-w-full max-h-[60vh] rounded-lg object-contain"
              />
            </div>
          ) : file.type.startsWith('video/') ? (
            <div className="flex items-center justify-center h-full">
              <video 
                src={file.url} 
                controls 
                className="max-w-full max-h-[60vh] rounded-lg"
              />
            </div>
          ) : file.type.startsWith('audio/') ? (
            <div className="flex items-center justify-center h-full">
              <audio 
                src={file.url} 
                controls 
                className="w-full"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <div className="text-6xl mb-4">📄</div>
                <div className="text-muted-foreground">
                  Preview not available for this file type
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm font-medium">File Type</div>
              <div className="text-sm text-muted-foreground">{file.type}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Size</div>
              <div className="text-sm text-muted-foreground">{formatFileSize(file.size)}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Created</div>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(file.createdAt, { addSuffix: true })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-9"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="h-9"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetails;
