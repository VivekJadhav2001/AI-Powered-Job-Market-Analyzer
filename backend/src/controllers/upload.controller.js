import { PDFParse } from "pdf-parse";
import cloudinary from "../config/cloudinary.js";
import { User } from "../models/User.model.js";
import Job from "../models/Job.model.js";
import { scoreJob } from "../services/resumeAI.service.js";
import {
  extractResumeProfile,
  normalizeResume,
} from "../utils/ai/extractResumeProfile.js";

const publicUser = (user) => user.toObject({ versionKey: false });
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) =>
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "raw",
          folder: "placement-intelligence/resumes",
          format: "pdf",
          public_id: `resume_${Date.now()}`,
        },
        (error, result) => (error ? reject(error) : resolve(result)),
      )
      .end(buffer),
  );
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

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await getPublicUser(req);
    return res.success(200, "User fetched successfully", publicUser(user));
  } catch (error) {
    next(error);
  }
};

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) return res.error(400, "No file uploaded");
    if (req.file.mimetype !== "application/pdf")
      return res.error(400, "Only PDF files allowed");
    const user = await getPublicUser(req);
    const parser = new PDFParse({ data: req.file.buffer });
    const parsed = await parser.getText();
    await parser.destroy();
    if (!parsed.text?.trim())
      return res.error(
        422,
        "This PDF has no readable text. Upload a text-based resume.",
      );
    const profile = normalizeResume(await extractResumeProfile(parsed.text));
    const result = await uploadToCloudinary(req.file.buffer);
    const oldPublicId = user.resumePublicId;
    Object.assign(user, {
      ...profile,

      resumeUrl: result.secure_url,
      resumePublicId: result.public_id,
      resumeText: parsed.text,
    });
    await user.save();
    if (oldPublicId)
      cloudinary.uploader
        .destroy(oldPublicId, { resource_type: "raw" })
        .catch(() => {});
    return res.success(
      200,
      "Resume uploaded and profile extracted successfully",
      publicUser(user),
    );
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const user = await getPublicUser(req);
    if (user.resumePublicId)
      await cloudinary.uploader.destroy(user.resumePublicId, {
        resource_type: "raw",
      });
    user.resumeUrl = undefined;
    user.resumePublicId = undefined;
    user.resumeText = undefined;
    user.atsScores = [];
    await user.save();
    return res.success(200, "Resume removed successfully", publicUser(user));
  } catch (error) {
    next(error);
  }
};

export const calculateAtsScores = async (req, res, next) => {
  try {
    const user = await getPublicUser(req);
    if (!user?.resumeText)
      return res.error(422, "Upload a resume before calculating matches");
    const jobs = await Job.find().select(
      "jobRole companyName skills description",
    );
    user.atsScores = jobs.map((job) => ({
      job: job._id,
      jobRole: job.jobRole,
      companyName: job.companyName,
      ...scoreJob(user.skills, job),
    }));
    await user.save();
    return res.success(200, "ATS scores calculated successfully", {
      totalJobs: jobs.length,
      matches: user.atsScores,
    });
  } catch (error) {
    next(error);
  }
};
