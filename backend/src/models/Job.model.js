import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    jobRole: {
      type: String,
      required: true,
    },

    jobUrl: {
      type: String,
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    companyLogo: {
      type: String,
    },

    companyCareerPortal: {
      type: String,
    },

    companyRating: {
      type: Number,
    },

    experience: {
      type: String,
    },

    location: {
      type: String,
    },

    description: {
      type: String,
    },

    postedAt: {
      type: String,
    },

    skills: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", JobSchema);

export default Job;