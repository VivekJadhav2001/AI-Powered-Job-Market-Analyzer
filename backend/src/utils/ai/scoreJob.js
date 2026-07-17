function normalize(value = "") {
  return value
    .toString()
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();
}

function similarity(a, b) {
  a = normalize(a);
  b = normalize(b);

  if (!a || !b) return false;

  return (
    a === b ||
    a.includes(b) ||
    b.includes(a)
  );
}

export function scoreJob(profile, job) {
  //------------------------------------
  // Resume Data
  //------------------------------------

  const candidateSkills = profile.normalizedSkills || [];

  const preferredRoles = (profile.preferredRoles || []).map(normalize);

  const industries = (profile.industries || []).map(normalize);

  const experience = profile.yearsOfExperience || 0;

  const location = normalize(profile.location);

  //------------------------------------
  // Job Data
  //------------------------------------

  const jobSkills = (job.skills || []).map(normalize);

  const jobRole = normalize(job.jobRole);

  const jobDescription = normalize(job.description);

  const jobLocation = normalize(job.location);

  //------------------------------------
  // Weight Distribution
  //------------------------------------

  let totalScore = 0;

  //------------------------------------
  // 1 Skill Match (50)
  //------------------------------------

  const matchedSkills = jobSkills.filter((skill) =>
    candidateSkills.some((candidate) => similarity(skill, candidate))
  );

  const missingSkills = jobSkills.filter(
    (skill) => !matchedSkills.includes(skill)
  );

  let skillScore = 0;

  if (jobSkills.length) {
    skillScore =
      (matchedSkills.length / jobSkills.length) * 50;
  }

  totalScore += skillScore;

  //------------------------------------
  // 2 Preferred Role (20)
  //------------------------------------

  let roleScore = 0;

  preferredRoles.forEach((role) => {
    if (
      similarity(role, jobRole) ||
      similarity(role, jobDescription)
    ) {
      roleScore = 20;
    }
  });

  totalScore += roleScore;

  //------------------------------------
  // 3 Experience (15)
  //------------------------------------

  let experienceScore = 0;

  const exp = job.experience || "";

  const numbers = exp.match(/\d+/g);

  if (numbers?.length) {
    const min = Number(numbers[0]);

    if (experience >= min) {
      experienceScore = 15;
    } else {
      experienceScore =
        Math.max(0, 15 - (min - experience) * 4);
    }
  } else {
    experienceScore = 10;
  }

  totalScore += experienceScore;

  //------------------------------------
  // 4 Location (5)
  //------------------------------------

  let locationScore = 0;

  if (
    location &&
    similarity(location, jobLocation)
  ) {
    locationScore = 5;
  }

  totalScore += locationScore;

  //------------------------------------
  // 5 Industry (5)
  //------------------------------------

  let industryScore = 0;

  industries.forEach((industry) => {
    if (jobDescription.includes(industry)) {
      industryScore = 5;
    }
  });

  totalScore += industryScore;

  //------------------------------------
  // 6 Education Bonus (5)
  //------------------------------------

  let educationScore = 0;

  if (
    normalize(profile.highestEducation).includes("b.tech") ||
    normalize(profile.highestEducation).includes("bachelor")
  ) {
    educationScore = 5;
  }

  totalScore += educationScore;

  //------------------------------------
  // Final Score
  //------------------------------------

  totalScore = Math.round(Math.min(totalScore, 100));

  return {
    jobId: job._id,

    company: job.companyName,

    role: job.jobRole,

    location: job.location,

    score: totalScore,

    matchedSkills,

    missingSkills,

    matchedSkillCount: matchedSkills.length,

    totalSkills: jobSkills.length,
  };
}