import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    unique: true
  },

  title: {
    type: String,
    required: true
  },

  company: String,

  location: String,

  workMode: String, // Remote / Hybrid / Onsite

  experience: Number,

  salary: String,

  employmentType: String,

  skills: [String],

  description: String,

  education: String,

  postedDate: Date,

  applyLink: String,

  source: String
}, {
  timestamps: true
});

export default mongoose.model("Job", JobSchema);