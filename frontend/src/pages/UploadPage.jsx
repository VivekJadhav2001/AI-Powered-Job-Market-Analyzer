import { motion } from "framer-motion";
import { FiCheckCircle, FiFileText, FiUploadCloud } from "react-icons/fi";
import Card from "../components/ui/Card";
import PageIntro from "../components/ui/PageIntro";
import { useApp } from "../hooks/useApp";

export default function UploadPage() {
  const { uploadedFile, setUploadedFile } = useApp();
  const handleFile = (event) =>
    setUploadedFile(event.target.files?.[0] ?? null);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageIntro
        eyebrow="Data studio"
        title="Bring your data to life."
        description="Upload job listings or candidate profiles and let Nexora discover the patterns."
      />
      <Card className="p-6 md:p-10">
        <label className="flex min-h-75 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-violet-300/30 bg-violet-400/4 px-6 text-center transition hover:border-violet-300/70 hover:bg-violet-400/8">
          <input
            onChange={handleFile}
            type="file"
            accept=".csv,.xlsx,.json"
            className="sr-only"
          />
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/15 text-violet-300">
            <FiUploadCloud size={25} />
          </span>
          <span className="mt-5 text-base font-medium text-white">
            Drop your dataset here
          </span>
          <span className="mt-2 text-sm text-muted">
            or click to browse · CSV, XLSX, JSON up to 25 MB
          </span>
        </label>
        {uploadedFile && (
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-mint/8 p-4 text-sm">
            <FiCheckCircle className="text-mint" />
            <FiFileText className="text-muted" />
            <span className="text-white">{uploadedFile.name}</span>
            <span className="ml-auto text-muted">Ready to analyze</span>
          </div>
        )}
      </Card>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {["Clean automatically", "Map your columns", "Generate insights"].map(
          (title, index) => (
            <Card key={title} className="p-5">
              <span className="text-xs text-violet-300">0{index + 1}</span>
              <h2 className="mt-3 font-medium text-white">{title}</h2>
              <p className="mt-2 text-sm text-muted">
                A guided workspace that keeps your data structured and useful.
              </p>
            </Card>
          ),
        )}
      </div>
    </motion.div>
  );
}
