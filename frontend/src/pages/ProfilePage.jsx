import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

import PageIntro from "../components/ui/PageIntro";
import ResumeCard from "../components/profile/ResumeCard";
import api from "../utils/api";

export default function ProfilePage() {
  const fileInput = useRef(null);

  const user = useSelector((state) => state.auth.user);

  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || "");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fileError, setFileError] = useState("");

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!/\.(pdf)$/i.test(file.name)) {
      setFileError("Only PDF files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError("Resume must be smaller than 10 MB");
      return;
    }

    setFileError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await api.post(`/user/upload/${user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const url = response.data?.data?.resumeUrl;

      if (url) setResumeUrl(url);
    } catch {
      setFileError("Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    try {
      setDeleting(true);

      // await api.delete(`/user/resume/${user._id}`);

      setResumeUrl("");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageIntro
        eyebrow="Your candidate profile"
        title="Resume"
        description="Upload your latest resume for AI-powered job matching."
      />

      <ResumeCard
        fileInput={fileInput}
        resumeUrl={resumeUrl}
        uploading={uploading}
        deleting={deleting}
        fileError={fileError}
        onUpload={handleResumeUpload}
        onDelete={handleDeleteResume}
      />
    </motion.div>
  );
}
