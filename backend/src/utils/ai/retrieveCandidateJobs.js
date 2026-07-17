import Job from "../../models/Job.model.js";

function escapeRegex(text = "") {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function retrieveCandidateJobs(profile) {
  const skills = profile.normalizedSkills || [];

  const preferredRoles = (profile.preferredRoles || []).filter(Boolean);

  const keywords = (profile.keywords || []).filter(Boolean);

  const query = {
    $or: [],
  };

  // ----------------------------
  // Skill Search
  // ----------------------------

  if (skills.length) {
    query.$or.push({
      skills: {
        $in: skills.map(
          (skill) => new RegExp(`^${escapeRegex(skill)}$`, "i"),
        ),
      },
    });
  }

  // ----------------------------
  // Preferred Roles
  // ----------------------------

  preferredRoles.forEach((role) => {
    query.$or.push({
      jobRole: {
        $regex: escapeRegex(role),
        $options: "i",
      },
    });
  });

  // ----------------------------
  // Keywords inside Description
  // ----------------------------

  keywords.slice(0, 10).forEach((keyword) => {
    query.$or.push({
      description: {
        $regex: escapeRegex(keyword),
        $options: "i",
      },
    });
  });

  let jobs = [];

  if (query.$or.length) {
    jobs = await Job.find(query)
      .select(
        "jobRole companyName companyLogo location experience description skills jobUrl",
      )
      .limit(250)
      .lean();
  }

  // ----------------------------
  // Fallback
  // ----------------------------

  if (!jobs.length) {
    jobs = await Job.find()
      .select(
        "jobRole companyName companyLogo location experience description skills jobUrl",
      )
      .limit(250)
      .lean();
  }

  return jobs;
}