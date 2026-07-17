import { useRef } from "react";
import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiBriefcase,
  FiCheckCircle,
  FiCpu,
  FiFileText,
  FiMapPin,
  FiRefreshCw,
  FiUploadCloud,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/ui/Card";
import PageIntro from "../components/ui/PageIntro";
import {
  generateAiMatches,
  uploadResumeForMatches,
} from "../features/aiMatchSlice";

const steps = [
  "Resume Upload",
  "AI Resume Parsing",
  "Candidate Retrieval",
  "Local Scoring",
  "LLM Re-ranking",
];

const scoreTone = (score = 0) => {
  if (score >= 75) return "text-mint bg-mint/10";
  if (score >= 60) return "text-cyan-200 bg-cyan-400/10";
  return "text-amber-200 bg-amber-400/10";
};

export default function MatchesPage() {
  const fileInput = useRef(null);
  const dispatch = useDispatch();
  const {
    resume,
    profile,
    jobs,
    careerSummary,
    overallAdvice,
    totalCandidates,
    scoredCandidates,
    rankedCandidates,
    uploading,
    matching,
    error,
  } = useSelector((state) => state.aiMatches);

  const hasResume = Boolean(resume?.resumeText || profile?.normalizedSkills);
  const busy = uploading || matching;
  const parsed = hasResume || Boolean(profile);
  const retrieved = totalCandidates > 0;
  const scored = scoredCandidates > 0 || rankedCandidates > 0 || jobs.length > 0;
  const reranked = rankedCandidates > 0 || jobs.length > 0 || Boolean(careerSummary || overallAdvice);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    dispatch(uploadResumeForMatches(file));
  };

  const handleGenerate = () => {
    dispatch(generateAiMatches());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <PageIntro
        eyebrow="AI match engine"
        title="Personalized job matches from your resume."
        description="Upload once, then generate ranked recommendations from the stored parsed resume."
        action={
          <button
            onClick={() => fileInput.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg bg-violet px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            <FiUploadCloud />
            {uploading ? "Parsing..." : "Upload resume"}
          </button>
        }
      />

      <input
        ref={fileInput}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="rounded-lg border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">
                  Matching pipeline
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                  Resume to ranked jobs
                </h2>
              </div>
              <FiCpu className="text-mint" size={22} />
            </div>

            <div className="mt-5 space-y-3">
              {steps.map((step, index) => {
                const active =
                  (index === 0 && hasResume) ||
                  (index === 1 && parsed) ||
                  (index === 2 && retrieved) ||
                  (index === 3 && scored) ||
                  (index === 4 && reranked);
                return (
                  <div key={step} className="flex items-center gap-3 text-sm">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border ${
                        active
                          ? "border-mint/35 bg-mint/10 text-mint"
                          : "border-white/10 text-muted"
                      }`}
                    >
                      {active ? <FiCheckCircle /> : index + 1}
                    </span>
                    <span className={active ? "text-white" : "text-muted"}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!hasResume || matching}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-mint px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiRefreshCw className={matching ? "animate-spin" : ""} />
              {matching ? "Ranking jobs..." : "Generate AI matches"}
            </button>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/8 text-violet">
                <FiFileText />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-medium text-white">
                  {hasResume ? "Resume parsed" : "No resume uploaded"}
                </h3>
                <p className="mt-1 text-xs text-muted">
                  {profile?.headline || "Upload a PDF resume to start."}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {(profile?.skills || profile?.normalizedSkills || [])
                .slice(0, 12)
                .map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {(careerSummary || overallAdvice) && (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="p-5">
                <p className="text-xs uppercase tracking-wider text-muted">
                  Career insight
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  {careerSummary}
                </p>
              </Card>
              <Card className="p-5">
                <p className="text-xs uppercase tracking-wider text-muted">
                  Next best move
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  {overallAdvice}
                </p>
              </Card>
            </div>
          )}

          <Card className="overflow-hidden p-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
              <div>
                <h2 className="font-medium text-white">
                  {jobs.length
                    ? `${jobs.length} AI-ranked recommendations`
                    : "AI-ranked recommendations"}
                </h2>
                <p className="mt-1 text-xs text-muted">
                  {totalCandidates
                    ? `${totalCandidates} candidate jobs retrieved from MongoDB`
                    : "Upload your resume and generate matches to populate this list."}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-lg bg-white/6 px-3 py-1.5 text-xs text-slate-200">
                <FiBriefcase /> Top ranked jobs
              </span>
            </div>

            <div className="divide-y divide-white/8">
              {jobs.map((job) => (
                <article key={job._id} className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-white">
                          {job.jobRole}
                        </h3>
                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${scoreTone(
                            job.analysis?.score,
                          )}`}
                        >
                          {job.analysis?.score || 0}% fit
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted">
                        {job.companyName} <span className="mx-1">-</span>
                        <FiMapPin className="inline" />{" "}
                        {job.location || "Location not listed"}
                      </p>
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        {job.ai?.reason || "Ranked by local score."}
                      </p>
                    </div>
                    {job.jobUrl && (
                      <a
                        href={job.jobUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/6"
                      >
                        Apply <FiArrowUpRight />
                      </a>
                    )}
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted">Strengths</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(job.ai?.strengths || job.analysis?.matchedSkills || [])
                          .slice(0, 5)
                          .map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-mint/10 px-2.5 py-1 text-xs text-mint"
                            >
                              {skill}
                            </span>
                          ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Skill gaps</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(job.ai?.missingSkills ||
                          job.analysis?.missingSkills ||
                          [])
                          .slice(0, 5)
                          .map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-white/6 px-2.5 py-1 text-xs text-slate-300"
                            >
                              {skill}
                            </span>
                          ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Interview chance</p>
                      <p className="mt-2 text-sm font-medium text-white">
                        {job.ai?.interviewChance || "Medium"}
                      </p>
                    </div>
                  </div>
                </article>
              ))}

              {!jobs.length && (
                <div className="px-5 py-12 text-center">
                  <FiCpu className="mx-auto text-violet" size={28} />
                  <p className="mt-3 text-sm text-white">
                    Your best-fit jobs will appear here.
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    The frontend only calls `/resume` for upload and `/matches`
                    for recommendations.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
