import Job from "../models/Job.model.js";


const getSkillDemand = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const jobs = await Job.find({}, { skills: 1, _id: 0 });

    const skillMap = new Map();

    for (const job of jobs) {
      if (!job.skills) continue;

      for (let skill of job.skills) {
        skill = skill.trim();

        if (!skill) continue;

        const formattedSkill = skill
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase());

        skillMap.set(
          formattedSkill,
          (skillMap.get(formattedSkill) || 0) + 1
        );
      }
    }

    const topSkills = [...skillMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, value]) => ({
        name,
        value,
      }));

    return res.success(
      200,
      "Successfully fetched top skills",
      topSkills
    );
  } catch (error) {
    next(error);
  }
}

const getFastestGrowingRoles = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const jobs = await Job.find({}, { jobRole: 1, _id: 0 });

    const roleMap = new Map();

    for (const job of jobs) {
      if (!job.jobRole) continue;

      const role = job.jobRole.trim();

      roleMap.set(role, (roleMap.get(role) || 0) + 1);
    }

    const fastestGrowingRoles = [...roleMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([role, openings], index) => ({
        id: index + 1,
        role,
        openings,
      }));

    return res.success(
      200,
      "Successfully fetched fastest growing roles",
      fastestGrowingRoles
    );
  } catch (error) {
    next(error);
  }
};

const getDashboardMetrics = async (req, res, next) => {
  try {
    const [
      totalJobs,
      uniqueCompanies,
      uniqueRoles,
      uniqueLocations,
    ] = await Promise.all([
      Job.countDocuments(),

      Job.distinct("companyName"),

      Job.distinct("jobRole"),

      Job.distinct("location"),
    ]);

    const metrics = [
      {
        label: "Open Opportunities",
        value: totalJobs.toLocaleString(),
        icon: "briefcase",
        accent: "text-violet-300",
      },
      {
        label: "Hiring Companies",
        value: uniqueCompanies.length.toLocaleString(),
        icon: "building",
        accent: "text-mint",
      },
      {
        label: "Job Roles",
        value: uniqueRoles.length.toLocaleString(),
        icon: "layers",
        accent: "text-sky-300",
      },
      {
        label: "Hiring Locations",
        value: uniqueLocations.length.toLocaleString(),
        icon: "map-pin",
        accent: "text-pink-300",
      },
    ];

    return res.success(
      200,
      "Dashboard metrics fetched successfully",
      metrics
    );
  } catch (error) {
    next(error);
  }
};

const getMarketMomentum = async (req, res, next) => {
  try {
    const jobs = await Job.find({}, { postedAt: 1, _id: 0 });

    const buckets = {
      "1 Day": 0,
      "2-3 Days": 0,
      "4-7 Days": 0,
      "8-14 Days": 0,
      "15-30 Days": 0,
      "30+ Days": 0,
    };

    jobs.forEach((job) => {
      if (!job.postedAt) return;

      const text = job.postedAt.toLowerCase();

      const days = parseInt(text.match(/\d+/)?.[0]);

      if (text.includes("today") || days === 0 || days === 1) {
        buckets["1 Day"]++;
      } else if (days <= 3) {
        buckets["2-3 Days"]++;
      } else if (days <= 7) {
        buckets["4-7 Days"]++;
      } else if (days <= 14) {
        buckets["8-14 Days"]++;
      } else if (days <= 30) {
        buckets["15-30 Days"]++;
      } else {
        buckets["30+ Days"]++;
      }
    });

    const marketMomentum = Object.entries(buckets).map(([period, jobs]) => ({
      period,
      jobs,
    }));

    return res.success(
      200,
      "Market momentum fetched successfully",
      marketMomentum
    );
  } catch (error) {
    next(error);
  }
};



export {
    getSkillDemand,
    getFastestGrowingRoles,
    getDashboardMetrics,
    getMarketMomentum
}