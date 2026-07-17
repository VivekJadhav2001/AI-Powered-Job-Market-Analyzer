import Job from "../models/Job.model.js";

const uploadJobListings = async (req, res, next) => {
  try {
    const { jobListings } = req.body;

    if (!Array.isArray(jobListings) || jobListings.length === 0) {
      return res.error(400, "Please provide job listings");
    }

    const formattedJobs = jobListings.map((job) => ({
      jobRole: job["job roles"],
      jobUrl: job["job href"],
      companyLogo: job.company_logo,
      companyName: job["company name"],
      companyCareerPortal: job["company carries portal"],
      companyRating: job["company ratings"],
      experience: job.experience,
      location: job.location,
      description: job["job-desc"],
      postedAt: job["job-post-day"],
      skills: job[" "] ? job[" "].split(",").map((skill) => skill.trim()) : [],
    }));

    await Job.bulkWrite(
      formattedJobs.map((job) => ({
        updateOne: {
          filter: { jobUrl: job.jobUrl },
          update: { $set: job },
          upsert: true,
        },
      })),
    );

    return res.success(201, "Jobs uploaded successfully");
  } catch (error) {
    next(error);
  }
};

export { uploadJobListings };
