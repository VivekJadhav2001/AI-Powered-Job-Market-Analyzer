import { FiX } from "react-icons/fi";

export default function ResumeActions({
  resumeUrl,
  uploading,
  deleting,
  fileInput,
  onDelete,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={resumeUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white transition hover:border-violet-300/40 hover:bg-white/5"
      >
        View Resume
      </a>

      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        disabled={uploading}
        className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-400 disabled:opacity-60"
      >
        {uploading ? "Uploading..." : "Replace"}
      </button>

      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        className="inline-flex items-center gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-200 transition hover:bg-rose-500/15 disabled:opacity-60"
      >
        <FiX size={16} />
        {deleting ? "Removing..." : "Remove"}
      </button>
    </div>
  );
}
