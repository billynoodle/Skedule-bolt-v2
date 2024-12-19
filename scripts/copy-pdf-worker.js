import { copyFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Ensure target directories exist
mkdirSync(join(__dirname, '../public/assets'), { recursive: true });
mkdirSync(join(__dirname, '../public/assets/cmaps'), { recursive: true });
mkdirSync(join(__dirname, '../public/assets/standard_fonts'), { recursive: true });

// Copy PDF worker
copyFileSync(
  join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.js'),
  join(__dirname, '../public/assets/pdf.worker.js')
);