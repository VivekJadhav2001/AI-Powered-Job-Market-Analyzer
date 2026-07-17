import Card from "../ui/Card";
import ResumeUpload from "./ResumeUpload";
import ResumeUploaded from "./ResumeUploaded";

export default function ResumeCard({
  fileInput,
  resumeUrl,
  uploading,
  deleting,
  fileError,
  onUpload,
  onDelete,
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-5">
      <Card className="p-5 sm:p-6 xl:col-span-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-medium text-white">
              Resume
            </h2>

            <p className="mt-1 text-xs text-muted">
              Upload a PDF resume to improve job recommendations.
            </p>
          </div>
        </div>

        <input
          ref={fileInput}
          type="file"
          accept=".pdf"
          className="sr-only"
          onChange={onUpload}
        />

        {resumeUrl ? (
          <ResumeUploaded
            resumeUrl={resumeUrl}
            uploading={uploading}
            deleting={deleting}
            fileInput={fileInput}
            onDelete={onDelete}
          />
        ) : (
          <ResumeUpload
            uploading={uploading}
            fileInput={fileInput}
          />
        )}

        {fileError && (
          <p className="mt-4 text-xs text-rose-300">
            {fileError}
          </p>
        )}
      </Card>
    </div>
  );
}