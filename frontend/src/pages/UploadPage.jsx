import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheck,
  FiFile,
  FiFileText,
  FiGrid,
  FiInfo,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import Card from "../components/ui/Card";
import PageIntro from "../components/ui/PageIntro";
import { useApp } from "../hooks/useApp";

const MAX_FILE_SIZE = 25 * 1024 * 1024;

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadPage() {
  const { uploadedFile, setUploadedFile } = useApp();
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sheetName, setSheetName] = useState("");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const resetUpload = () => {
    setUploadedFile(null);
    setRows([]);
    setColumns([]);
    setSheetName("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const processFile = (file) => {
    if (!file) return;
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!["xlsx", "xls", "csv"].includes(extension)) {
      setError("Choose an Excel workbook or CSV file to continue.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("This file is larger than 25 MB. Please choose a smaller file.");
      return;
    }

    setError("");
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: "array" });
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        const parsedRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        const parsedColumns = parsedRows.length
          ? Object.keys(parsedRows[0])
          : [];

        setUploadedFile(file);
        setSheetName(firstSheet);
        setRows(parsedRows);
        setColumns(parsedColumns);
      } catch {
        setError("We couldn't read this file. Check that it is a valid spreadsheet.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setIsLoading(false);
      setError("The file could not be opened. Please try again.");
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    processFile(event.dataTransfer.files?.[0]);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageIntro
        eyebrow="Analytics workspace"
        title="Upload your team data."
        description="Bring in your latest Excel sheet and turn raw team data into a clear market view."
      />

      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="p-5 sm:p-7 xl:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white">New data source</p>
              <p className="mt-1 text-xs leading-5 text-muted">One spreadsheet at a time. Your upload stays in this workspace.</p>
            </div>
            <span className="rounded-lg bg-violet-500/12 px-2.5 py-1 text-xs text-violet-200">Step 1 of 3</span>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(event) => event.key === "Enter" && inputRef.current?.click()}
            onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`mt-6 flex min-h-70 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center transition ${isDragging ? "border-mint bg-mint/8" : "border-violet-300/25 bg-violet-500/4 hover:border-violet-300/60 hover:bg-violet-500/8"}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="sr-only"
              onChange={(event) => processFile(event.target.files?.[0])}
            />
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/15 text-violet-200">
              <FiUploadCloud size={27} />
            </span>
            <p className="mt-5 text-base font-medium text-white">Drop your Excel sheet here</p>
            <p className="mt-2 text-sm text-muted">or <span className="text-violet-200">browse files</span> from your computer</p>
            <p className="mt-5 text-xs text-muted">XLSX, XLS, or CSV · Maximum file size 25 MB</p>
          </div>

          {error && <p className="mt-3 flex items-center gap-2 text-sm text-rose-300"><FiInfo />{error}</p>}
          {isLoading && <p className="mt-3 text-sm text-violet-200">Reading your spreadsheet…</p>}

          {uploadedFile && !isLoading && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-mint/15 bg-mint/7 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mint/15 text-mint"><FiFileText size={19} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{uploadedFile.name}</p>
                <p className="mt-1 text-xs text-muted">{formatFileSize(uploadedFile.size)} · {sheetName || "First worksheet"}</p>
              </div>
              <span className="hidden items-center gap-1.5 text-xs text-mint sm:flex"><FiCheck /> Ready</span>
              <button onClick={(event) => { event.stopPropagation(); resetUpload(); }} className="rounded-lg p-2 text-muted transition hover:bg-white/8 hover:text-white" aria-label="Remove uploaded file"><FiX /></button>
            </div>
          )}
        </Card>

        <Card className="relative overflow-hidden p-6 xl:col-span-2">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-violet-500/18 blur-3xl" />
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/7 text-violet-200"><FiGrid /></span>
          <h2 className="mt-5 text-lg font-medium text-white">Prepared for analysis</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Your data will be checked for usable columns before it reaches your team dashboard.</p>
          <div className="mt-6 space-y-3">
            {["Detect headers and data types", "Preview rows before import", "Map fields to your metrics"].map((item) => (
              <p key={item} className="flex items-center gap-3 text-sm text-violet-100"><span className="grid h-5 w-5 place-items-center rounded-full bg-violet-400/15 text-violet-200"><FiCheck size={12} /></span>{item}</p>
            ))}
          </div>
        </Card>
      </div>

      {uploadedFile && !isLoading && (
        <Card className="mt-4 overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-white/8 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-sm font-medium text-white">Data preview</p>
              <p className="mt-1 text-xs text-muted">{rows.length} {rows.length === 1 ? "row" : "rows"} detected · Showing the first 5</p>
            </div>
            <button className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-violet-100">Continue to mapping <FiArrowRight /></button>
          </div>
          {columns.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-150 text-left text-sm">
                <thead className="bg-white/3 text-xs uppercase tracking-wider text-muted">
                  <tr>{columns.map((column) => <th key={column} className="whitespace-nowrap px-6 py-4 font-medium">{column}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {rows.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex} className="text-violet-50/90">
                      {columns.map((column) => <td key={column} className="max-w-56 truncate px-6 py-4">{String(row[column] ?? "—")}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-6 text-sm text-muted"><FiFile /> We found no populated rows in this worksheet.</div>
          )}
        </Card>
      )}
    </motion.div>
  );
}
