import { PDFDocumentProxy } from 'pdfjs-dist';

export const validatePDFFile = async (file: File): Promise<boolean> => {
  if (file.type !== 'application/pdf') {
    return false;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const firstBytes = new Uint8Array(arrayBuffer.slice(0, 5));
    const pdfHeader = String.fromCharCode(...firstBytes);
    return pdfHeader === '%PDF-';
  } catch (error) {
    console.error('PDF validation error:', error);
    return false;
  }
};

export const getPageDimensions = (page: PDFDocumentProxy): { width: number; height: number } => {
  const viewport = page.getViewport({ scale: 1.0 });
  return {
    width: viewport.width,
    height: viewport.height
  };
};