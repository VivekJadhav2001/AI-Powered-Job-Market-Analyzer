import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiBriefcase, FiCpu, FiMapPin, FiRefreshCw } from "react-icons/fi";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import PageIntro from "../components/ui/PageIntro";
import ResumeCard from "../components/profile/ResumeCard";
import Card from "../components/ui/Card";
import api from "../utils/api";
import {
  calculateAtsScores,
  fetchCurrentUser,
  setProfileUser,
} from "../features/profileSlice";

const initials = (name = "You") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function ProfilePage() {
  const fileInput = useRef(null);
  const dispatch = useDispatch();
  const { user, loading, scoring, error } = useSelector(
    (state) => state.profile,
  );
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fileError, setFileError] = useState("");
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf")
      return setFileError("Only PDF files are allowed");
    if (file.size > 5 * 1024 * 1024)
      return setFileError("Resume must be smaller than 5 MB");
    setFileError("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("resume", file);
      const response = await api.post("/user/resume", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(setProfileUser(response.data.data));
    } catch (requestError) {
      setFileError(
        requestError.response?.data?.message ||
          "Failed to upload and analyze resume",
      );
    } finally {
      setUploading(false);
    }
  };
  const handleDeleteResume = async () => {
    setDeleting(true);
    try {
      const response = await api.delete("/user/resume");
      dispatch(setProfileUser(response.data.data));
    } catch (requestError) {
      setFileError(
        requestError.response?.data?.message || "Failed to remove resume",
      );
    } finally {
      setDeleting(false);
    }
  };
  if (loading && !user)
    return (
      <div className="grid min-h-[55vh] place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet/25 border-t-violet" />
      </div>
    );
  const scores = user?.atsScores || [];
  const qualified = scores.filter((score) => score.matchPercentage >= 60);
  const average = scores.length
    ? Math.round(
        scores.reduce((sum, score) => sum + score.matchPercentage, 0) /
          scores.length,
      )
    : 0;
  const chart = [
    { name: "Match", value: average },
    { name: "Remaining", value: 100 - average },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <PageIntro
        eyebrow="Your candidate profile"
        title={user ? `${user.userName}'s profile` : "Profile"}
        description="Your resume powers a tailored skills profile and role-fit analysis."
      />
      {error && (
        <p className="rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="relative overflow-hidden p-6 xl:col-span-2">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-violet/15 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-linear-to-br from-violet to-cyan-400 text-2xl font-bold text-slate-950">
              {initials(user?.userName)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user?.userName || "Your profile"}
              </h2>
              <p className="mt-1 text-sm text-violet-200">
                {user?.headline ||
                  "Upload a resume to generate your professional snapshot."}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1">
                  <FiMapPin />
                  {user?.location || "Location not found"}
                </span>
                <span>{user?.email}</span>
              </div>
            </div>
          </div>
          <div className="relative mt-6 flex flex-wrap gap-2">
            {(user?.skills || []).slice(0, 12).map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-violet/25 bg-violet/10 px-3 py-1 text-xs text-violet-100"
              >
                {skill}
              </span>
            ))}
            {!user?.skills?.length && (
              <span className="text-sm text-muted">
                Skills will appear after your resume is analyzed.
              </span>
            )}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Average ATS fit
              </p>
              <p className="mt-1 text-3xl font-semibold text-white">
                {average}%
              </p>
            </div>
            <FiCpu className="text-mint" size={22} />
          </div>
          <div className="h-28">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chart}
                  dataKey="value"
                  innerRadius={34}
                  outerRadius={48}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {chart.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={index ? "rgba(255,255,255,.09)" : "#55e6ba"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#171430",
                    border: "1px solid rgba(255,255,255,.12)",
                    borderRadius: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted">
            Across {scores.length} available roles
          </p>
        </Card>
      </div>
      <ResumeCard
        fileInput={fileInput}
        resumeUrl={user?.resumeUrl}
        uploading={uploading}
        deleting={deleting}
        fileError={fileError}
        onUpload={handleResumeUpload}
        onDelete={handleDeleteResume}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <FiBriefcase className="text-violet" size={20} />
          <p className="mt-4 text-3xl font-semibold">{qualified.length}</p>
          <p className="mt-1 text-sm text-muted">roles with 60%+ fit</p>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-medium text-white">Role compatibility</h2>
              <p className="mt-1 text-xs text-muted">
                Calculate a fresh score against every job in the database.
              </p>
            </div>
            <button
              onClick={() => dispatch(calculateAtsScores())}
              disabled={!user?.resumeText || scoring}
              className="inline-flex items-center gap-2 rounded-xl bg-violet px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              <FiRefreshCw className={scoring ? "animate-spin" : ""} />
              {scoring ? "Calculating…" : "Refresh matches"}
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {scores
              .slice()
              .sort((a, b) => b.matchPercentage - a.matchPercentage)
              .slice(0, 3)
              .map((score) => (
                <div
                  key={score._id || score.job}
                  className="flex items-center gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="truncate text-white">
                        {score.jobRole}{" "}
                        <span className="text-muted">
                          · {score.companyName}
                        </span>
                      </span>
                      <span className="text-mint">
                        {score.matchPercentage}%
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-violet to-mint"
                        style={{ width: `${score.matchPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            {!scores.length && (
              <p className="text-sm text-muted">
                Upload your resume, then calculate matches to see your best
                opportunities.
              </p>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
