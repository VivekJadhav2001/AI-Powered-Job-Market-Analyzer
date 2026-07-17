import { FiFileText } from "react-icons/fi";
import ResumeActions from "./ResumeActions";

export default function ResumeUploaded({
  resumeUrl,
  uploading,
  deleting,
  fileInput,
  onDelete,
}) {
  return (
    <div className="mt-6 rounded-2xl border border-mint/20 bg-mint/7 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-mint/15 text-mint">
            <FiFileText size={20} />
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              Resume uploaded successfully
            </p>

            <p className="mt-1 text-xs text-mint">
              Connected with AI analysis systems
            </p>
          </div>
        </div>

        <ResumeActions
          resumeUrl={resumeUrl}
          uploading={uploading}
          deleting={deleting}
          fileInput={fileInput}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}