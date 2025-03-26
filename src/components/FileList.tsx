
import React, { useState } from 'react';
import { 
  FileImage, FileVideo, FileAudio, File, Trash, Download 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import EmptyState from './EmptyState';

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  createdAt: Date;
}

interface FileListProps {
  files: FileItem[];
  onViewFile: (file: FileItem) => void;
  onDeleteFile: (id: string) => void;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) {
    return <FileImage className="w-8 h-8 text-blue-500" />;
  } else if (type.startsWith('video/')) {
    return <FileVideo className="w-8 h-8 text-purple-500" />;
  } else if (type.startsWith('audio/')) {
    return <FileAudio className="w-8 h-8 text-green-500" />;
  } else {
    return <File className="w-8 h-8 text-gray-500" />;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

const FileList: React.FC<FileListProps> = ({ files, onViewFile, onDeleteFile }) => {
  const { toast } = useToast();
  const [hoveredFileId, setHoveredFileId] = useState<string | null>(null);

  const handleDownload = (file: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create an anchor element and use it to download the file
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

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteFile(id);
    
    toast({
      title: "File deleted",
      description: "The file has been removed from your storage.",
      variant: "destructive",
    });
  };

  if (files.length === 0) {
    return (
      <EmptyState 
        title="No files yet" 
        description="Upload files to see them here."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4 animate-fade-in">
      {files.map((file) => (
        <div
          key={file.id}
          className="file-card animate-scale-up cursor-pointer"
          onClick={() => onViewFile(file)}
          onMouseEnter={() => setHoveredFileId(file.id)}
          onMouseLeave={() => setHoveredFileId(null)}
        >
          <div className="flex items-center p-4 pb-2">
            {getFileIcon(file.type)}
            <div className="ml-3 flex-1 truncate">
              <div className="font-medium text-sm truncate">{file.name}</div>
              <div className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => handleDownload(file, e as unknown as React.MouseEvent)}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => handleDelete(file.id, e as unknown as React.MouseEvent)}
                  className="text-destructive focus:bg-destructive/10"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="px-4 pb-4">
            <div className="h-2 bg-muted overflow-hidden rounded-full">
              <div className="bg-primary h-full w-full" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {formatDistanceToNow(file.createdAt, { addSuffix: true })}
            </div>
          </div>

          {file.type.startsWith('image/') && (
            <div 
              className="h-40 w-full bg-muted overflow-hidden" 
              style={{
                backgroundImage: `url(${file.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FileList;
