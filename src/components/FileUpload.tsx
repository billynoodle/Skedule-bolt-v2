import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image } from 'lucide-react';
import { validatePDFFile } from '../utils/pdf';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onError?: (error: string) => void;
}

export function FileUpload({ onFileSelect, onError }: FileUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    if (file.type === 'application/pdf') {
      const isValid = await validatePDFFile(file);
      if (!isValid) {
        onError?.('Invalid or corrupted PDF file');
        return;
      }
    }
    onFileSelect(file);
  }, [onFileSelect, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Upload Construction Plan
        </h1>
        <p className="text-gray-600">
          Import your construction plans for viewing
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200 cursor-copy
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]' 
            : 'border-gray-300 hover:border-gray-400 bg-white shadow-md hover:shadow-lg'
          }`}
      >
        <input {...getInputProps()} />
        
        <div className="mb-8">
          <div className={`mx-auto w-20 h-20 mb-6 rounded-full bg-gradient-to-tr from-blue-50 to-blue-100 flex items-center justify-center shadow-inner transition-transform duration-200 ${isDragActive ? 'scale-110' : 'group-hover:scale-110'}`}>
            <Upload 
              className={`w-10 h-10 transition-colors duration-200 ${isDragActive ? 'text-blue-600' : 'text-blue-500'}`} 
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isDragActive ? 'Drop your file here' : 'Upload your plan'}
          </h3>
          <p className="text-gray-600">
            Drag and drop your file here, or click to browse
          </p>
        </div>

        <div className="max-w-xs mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
              <FileText className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <span className="text-xs font-medium text-gray-700">PDF</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
              <Image className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <span className="text-xs font-medium text-gray-700">PNG</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
              <Image className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <span className="text-xs font-medium text-gray-700">JPEG</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Maximum file size: 50MB
          </p>
        </div>
      </div>
    </div>
  );
}