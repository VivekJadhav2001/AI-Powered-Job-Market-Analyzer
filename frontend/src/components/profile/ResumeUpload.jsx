import { FiUploadCloud } from "react-icons/fi";

export default function ResumeUpload({
  uploading,
  fileInput,
}) {
  return (
    <button
      type="button"
      onClick={() => fileInput.current?.click()}
      disabled={uploading}
      className="mt-6 flex min-h-40 w-full flex-col items-center justify-center rounded-3xl border border-dashed border-violet-300/30 bg-violet-500/4 px-6 text-center transition hover:border-violet-300/65 hover:bg-violet-500/8 disabled:opacity-60"
    >
      <FiUploadCloud
        className="text-violet-200"
        size={28}
      />

      <span className="mt-3 text-sm font-medium text-white">
        {uploading ? "Uploading..." : "Upload Resume"}
      </span>

      <span className="mt-1 text-xs text-muted">
        PDF only · Maximum 10 MB
      </span>
    </button>
  );
}