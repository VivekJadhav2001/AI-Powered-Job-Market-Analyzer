import Job from "../models/Job.model.js";
import { extractResumeProfile, normalizeResume } from "../utils/ai/extractResumeProfile.js";
import { scoreJob } from "../utils/ai/scoreJob.js";

export const retrieveJobsForResume = async (resumeText) => {

  //-----------------------------------
  // AI Resume Parsing
  //-----------------------------------

  const profile = normalizeResume(
    await extractResumeProfile(resumeText)
  );

  //-----------------------------------
  // Candidate Retrieval
  //-----------------------------------

  const jobs = await retrieveCandidateJobs(profile);

  //-----------------------------------
  // Local Ranking
  //-----------------------------------

  const rankedJobs = jobs
    .map(job => ({
      ...job,
      analysis: scoreJob(profile, job)
    }))
    .sort(
      (a, b) =>
        b.analysis.score -
        a.analysis.score
    );

  //-----------------------------------
  // Keep Best Jobs
  //-----------------------------------

  return {
    profile,

    jobs: rankedJobs
      .filter(job => job.analysis.score >= 45)
      .slice(0, 25)
  };

};