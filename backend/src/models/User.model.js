import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    userName: {
      type: String,
      default: "Guest candidate",
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      match: [/^\+?[1-9]\d{7,14}$/, "Please provide a valid phone number"],
    },
    password: {
      type: String,
      select: false,
    },resumeUrl: {
      type: String,
      trim: true,
    },
    skills: [{ type: String, trim: true }],
    normalizedSkills: [{ type: String, trim: true }],
    softSkills: [{ type: String, trim: true }],
    preferredRoles: [{ type: String, trim: true }],
    industries: [{ type: String, trim: true }],
    yearsOfExperience: { type: Number, default: 0 },
    highestEducation: { type: String, trim: true },
    github: { type: String, trim: true },
    portfolio: { type: String, trim: true },
    keywords: [{ type: String, trim: true }],
    certifications: [{ type: String, trim: true }],
    projects: [{ name: String, technologies: [String] }],
    resumePublicId: {
      type: String,
      trim: true,
    },
    resumeText: {
      type: String,
    },
    headline: { type: String, trim: true },
    location: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    linkedIn: { type: String, trim: true },
    education: [{ degree: String, institution: String, year: String }],
    experience: [{ title: String, company: String, duration: String, technologies: [String] }],
    atsScores: [{
      job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
      jobRole: String,
      companyName: String,
      matchPercentage: { type: Number, min: 0, max: 100 },
      matchedSkills: [String],
      missingSkills: [String],
      summary: String,
      calculatedAt: { type: Date, default: Date.now },
    }],
    publicClientId: { type: String, unique: true, sparse: true, index: true },
},{timestamps:true})


export const User = mongoose.model("User",userSchema)
