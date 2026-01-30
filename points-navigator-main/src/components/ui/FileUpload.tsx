import { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({ 
  onFileSelect, 
  accept = '.pdf,.png,.jpg,.jpeg',
  maxSize = 5,
  className 
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    setError(null);
    
    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`O arquivo deve ter no máximo ${maxSize}MB`);
      return;
    }

    // Check file type
    const allowedTypes = accept.split(',').map(t => t.trim());
    const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.some(type => fileExtension === type || selectedFile.type.includes(type.replace('.', '')))) {
      setError('Tipo de arquivo não permitido');
      return;
    }

    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!file) return null;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg'].includes(extension || '')) {
      return <ImageIcon className="w-8 h-8 text-primary" />;
    }
    return <FileText className="w-8 h-8 text-primary" />;
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50 hover:bg-muted/50",
            error && "border-destructive"
          )}
        >
          <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">
            Arraste um arquivo ou clique para selecionar
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF, PNG ou JPG (máx. {maxSize}MB)
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
          {getFileIcon()}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={removeFile}
            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-destructive" />
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  );
}
