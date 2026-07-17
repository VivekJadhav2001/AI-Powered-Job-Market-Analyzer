import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import { FiCheckCircle, FiFileText, FiUploadCloud } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Card from "../components/ui/Card";
import PageIntro from "../components/ui/PageIntro";
import { useApp } from "../hooks/useApp";
import axios from "axios"
import api from "../utils/api";
export default function UploadPage() {
  const { uploadedFile, setUploadedFile } = useApp();

  const [jsonData, setJsonData] = useState([]);

  const handleFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      toast.warning("Please select a file.");
      return;
    }

    const extension = file.name.split(".").pop().toLowerCase();

    if (!["csv", "xlsx"].includes(extension)) {
      toast.error("Only CSV and XLSX files are supported.");
      return;
    }

    setUploadedFile(file);

    // ---------------- CSV ----------------
    if (extension === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,

        complete: (results) => {
          console.clear();
          console.log("========== CSV DATA ==========");
          console.table(results.data);
          console.log(results.data);

          setJsonData(results.data);

          toast.success("CSV uploaded successfully!");
        },

        error: () => {
          toast.error("Unable to parse CSV file.");
        },
      });
    }

    // ---------------- XLSX ----------------
    if (extension === "xlsx") {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);

          const workbook = XLSX.read(data, {
            type: "array",
          });

          const sheetName = workbook.SheetNames[0];

          const worksheet = workbook.Sheets[sheetName];

          const json = XLSX.utils.sheet_to_json(worksheet, {
            defval: "",
          });

          console.clear();
          console.log("========== XLSX DATA ==========");
          console.table(json);
          console.log(json);

          setJsonData(json);

          toast.success("Excel file uploaded successfully!");
        } catch (err) {
          console.error(err);
          toast.error("Unable to parse Excel file.");
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  async function uploadJsonJobsToBackend(){
    try {
      const res = await api.post('/daTeam/uploadJobListing',{
  jobListings: jsonData,
})

      console.log(res,"RESPONSE FOMR API UPLOAD")
    } catch (error) {
      console.log(error,"UPLOAD JOBS DB")
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        toastStyle={{
          background: "#111827",
          color: "#fff",
          border: "1px solid rgba(139,92,246,.4)",
          borderRadius: "14px",
        }}
        progressStyle={{
          background: "#8b5cf6",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PageIntro
          eyebrow="Data studio"
          title="Bring your data to life."
          description="Upload job listings or candidate profiles and let Nexora discover the patterns."
        />

        <Card className="p-6 md:p-10">
          <label className="flex min-h-75 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-violet-300/30 bg-violet-400/4 px-6 text-center transition hover:border-violet-300/70 hover:bg-violet-400/8">
            <input
              type="file"
              accept=".csv,.xlsx"
              className="sr-only"
              onChange={handleFile}
            />

            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/15 text-violet-300">
              <FiUploadCloud size={26} />
            </span>

            <span className="mt-5 text-base font-medium text-white">
              Drop your dataset here
            </span>

            <span className="mt-2 text-sm text-muted">
              or click to browse · CSV or XLSX up to 25 MB
            </span>
          </label>

          <button onClick={uploadJsonJobsToBackend}>UPLOAD</button>

          {uploadedFile && (
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-mint/8 p-4 text-sm">
              <FiCheckCircle className="text-mint" />
              <FiFileText className="text-muted" />

              <span className="text-white">
                {uploadedFile.name}
              </span>

              <span className="ml-auto text-muted">
                Ready to analyze
              </span>
            </div>
          )}

          {jsonData.length > 0 && (
            <div className="mt-6 rounded-xl bg-black/30 p-4">
              <h3 className="mb-3 text-white font-semibold">
                Parsed JSON Preview
              </h3>

              <pre className="max-h-80 overflow-auto text-xs text-green-300">
                {JSON.stringify(jsonData.slice(0, 5), null, 2)}
              </pre>

              <p className="mt-3 text-xs text-muted">
                Showing first 5 records. Full data is available in the browser
                console.
              </p>
            </div>
          )}
        </Card>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            "Clean automatically",
            "Map your columns",
            "Generate insights",
          ].map((title, index) => (
            <Card key={title} className="p-5">
              <span className="text-xs text-violet-300">
                0{index + 1}
              </span>

              <h2 className="mt-3 font-medium text-white">
                {title}
              </h2>

              <p className="mt-2 text-sm text-muted">
                A guided workspace that keeps your data structured and useful.
              </p>
            </Card>
          ))}
        </div>
      </motion.div>
    </>
  );
}