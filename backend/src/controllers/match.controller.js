import { User } from "../models/User.model.js";
import { extractResumeProfile, normalizeResume } from "../utils/ai/extractResumeProfile.js";
import { retrieveCandidateJobs } from "../utils/ai/retrieveCandidateJobs.js";
import { scoreJob } from "../utils/ai/scoreJob.js";
import { rankJobs } from "../utils/ai/rankJobs.js";

const publicPhone = (id) => {
  const hash = [...id].reduce(
    (value, char) => (value * 31 + char.charCodeAt(0)) % 10000000000,
    0,
  );
  return `+91${String(hash).padStart(10, "0")}`;
};

const getPublicUser = async (req) => {
  const publicClientId = req.get("x-public-client-id");
  if (!publicClientId || publicClientId.length > 120) {
    const error = new Error("A valid public workspace ID is required");
    error.statusCode = 400;
    throw error;
  }

  return User.findOneAndUpdate(
    { publicClientId },
    {
      $setOnInsert: {
        publicClientId,
        userName: "Guest candidate",
        email: `public-${publicClientId}@workspace.local`,
        phoneNumber: publicPhone(publicClientId),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
};

export const matchResume = async (req, res, next) => {

  try {

    const user = await getPublicUser(req);

    if (!user?.resumeText) {
      return res.error(422, "Upload a resume before generating AI matches.");
    }

    //-------------------------------------
    // AI Resume Parsing
    //-------------------------------------

    const profile = normalizeResume(
      await extractResumeProfile(user.resumeText)
    );

    //-------------------------------------
    // Retrieve Jobs
    //-------------------------------------

    const jobs = await retrieveCandidateJobs(profile);

    //-------------------------------------
    // Local Scoring
    //-------------------------------------

    const scoredJobs = jobs
      .map(job => ({
        ...job,
        analysis: scoreJob(profile, job)
      }))
      .sort(
        (a,b)=>
        b.analysis.score-a.analysis.score
      );

    const highConfidenceJobs = scoredJobs.filter(job=>job.analysis.score>=45);
    const rankedJobs = (highConfidenceJobs.length ? highConfidenceJobs : scoredJobs)
      .slice(0,25);

    //-------------------------------------
    // AI Ranking
    //-------------------------------------

    const aiRanking = await rankJobs(
      profile,
      rankedJobs
    );

    //-------------------------------------
    // Merge AI response with DB data
    //-------------------------------------

    const topJobs = aiRanking.topJobs?.length
      ? aiRanking.topJobs
      : rankedJobs.map((job) => ({
        jobId: job._id.toString(),
        reason: `Local score indicates a ${job.analysis.score}% fit for this role.`,
        strengths: job.analysis.matchedSkills,
        missingSkills: job.analysis.missingSkills,
        interviewChance:
          job.analysis.score >= 75 ? "High" : job.analysis.score >= 60 ? "Medium" : "Low",
      }));

    const finalJobs = topJobs.map(aiJob=>{

      const dbJob = rankedJobs.find(
        job=>job._id.toString()===aiJob.jobId
      );

      if (!dbJob) return null;

      return{

        ...dbJob,

        ai:aiJob

      };

    }).filter(Boolean);

    user.atsScores = finalJobs.map((job) => ({
      job: job._id,
      jobRole: job.jobRole,
      companyName: job.companyName,
      matchPercentage: job.analysis.score,
      matchedSkills: job.analysis.matchedSkills,
      missingSkills: job.analysis.missingSkills,
      summary: job.ai?.reason || "",
    }));
    await user.save();

    return res.success(

      200,

      "Top matches found.",

      {

        profile,

        careerSummary:aiRanking.careerSummary,

        overallAdvice:aiRanking.overallAdvice,

        totalCandidates: jobs.length,

        scoredCandidates: scoredJobs.length,

        rankedCandidates: rankedJobs.length,

        jobs:finalJobs

      }

    );

  }

  catch(error){

    next(error);

  }

};
