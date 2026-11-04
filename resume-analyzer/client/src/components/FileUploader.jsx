import { useRef, useState } from 'react';
import { FileText, UploadCloud, X } from 'lucide-react';
import { MAX_FILE_SIZE_MB } from '../utils/constants';
import { formatFileSize } from '../utils/format';

// Client-side checks improve the experience only; the server repeats and enforces them.
export function validatePdf(file) {
  const looksLikePdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!looksLikePdf) return 'Only PDF files are supported.';
  if (file.size === 0) return 'This file is empty.';
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) return `The file is larger than ${MAX_FILE_SIZE_MB} MB.`;
  return '';
}

export default function FileUploader({ file, onSelect, onClear, onError, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    const selected = files?.[0];
    if (!selected) return;
    const problem = validatePdf(selected);
    if (problem) {
      onError(problem);
      return;
    }
    onError('');
    onSelect(selected);
  };

  if (file) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{file.name}</p>
          <p className="text-xs text-slate-500">{formatFileSize(file.size)} - PDF</p>
        </div>
        {!disabled && (
          <button type="button" onClick={onClear} aria-label="Remove selected file" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload your PDF resume. Press Enter to browse files."
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && (event.preventDefault(), inputRef.current?.click())}
      onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => { event.preventDefault(); setDragging(false); handleFiles(event.dataTransfer.files); }}
      className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
        dragging ? 'border-brand-600 bg-brand-50' : 'border-slate-300 bg-white hover:border-brand-600 hover:bg-brand-50/40'
      }`}
    >
      <UploadCloud className="h-10 w-10 text-brand-700" aria-hidden="true" />
      <p className="mt-4 text-base font-semibold text-ink">Upload your PDF resume</p>
      <p className="mt-1 text-sm text-slate-500">Drag and drop a file here, or click to browse</p>
      <p className="mt-3 text-xs text-slate-400">PDF only - up to {MAX_FILE_SIZE_MB} MB - text-based (not scanned)</p>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => { handleFiles(event.target.files); event.target.value = ''; }} />
    </div>
  );
}
