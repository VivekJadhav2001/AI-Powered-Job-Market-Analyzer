import Groq from "groq-sdk";

function jsonFromResponse(content) {
  const match =
    content.match(/```json([\s\S]*?)```/) ||
    content.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("Invalid JSON returned by AI.");
  }

  return JSON.parse(match[1] || match[0]);
}

export async function rankJobs(profile, jobs) {
  const fallbackRanking = {
    careerSummary:
      profile.headline || "Profile parsed successfully. Recommendations are ranked by local role-fit scoring.",
    overallAdvice:
      "Prioritize roles with the highest skill overlap and close the listed missing skills before applying.",
    topJobs: jobs.slice(0, 10).map((job) => ({
      jobId: job._id.toString(),
      reason: `Local score indicates a ${job.analysis.score}% fit for this role.`,
      strengths: job.analysis.matchedSkills.slice(0, 6),
      missingSkills: job.analysis.missingSkills.slice(0, 6),
      interviewChance:
        job.analysis.score >= 75 ? "High" : job.analysis.score >= 60 ? "Medium" : "Low",
    })),
  };

  if (!process.env.GROQ_API_KEY) {
    return fallbackRanking;
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const simplifiedJobs = jobs.map((job) => ({
    jobId: job._id.toString(),
    company: job.companyName,
    role: job.jobRole,
    location: job.location,
    experience: job.experience,
    score: job.analysis.score,
    matchedSkills: job.analysis.matchedSkills,
    missingSkills: job.analysis.missingSkills,
  }));

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",

      temperature: 0.2,

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: `
You are an experienced technical recruiter.

You receive

1. Candidate profile
2. Already scored jobs

The numeric score is FINAL.

DO NOT change scores.

Your job is ONLY to

- rank jobs
- explain why they fit
- estimate interview chance
- summarize the candidate
- provide career advice

Return ONLY JSON.

Schema:

{
  "careerSummary":"",
  "overallAdvice":"",
  "topJobs":[
    {
      "jobId":"",
      "reason":"",
      "strengths":[],
      "missingSkills":[],
      "interviewChance":"High"
    }
  ]
}
`,
        },

        {
          role: "user",
          content: JSON.stringify({
            candidate: {
              headline: profile.headline,
              skills: profile.skills,
              experience: profile.experience,
              preferredRoles: profile.preferredRoles,
              education: profile.education,
            },

            jobs: simplifiedJobs,
          }),
        },
      ],
    });

    return jsonFromResponse(
      completion.choices[0].message.content,
    );
  } catch {
    return fallbackRanking;
  }
}
