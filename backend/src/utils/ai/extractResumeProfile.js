import Groq from "groq-sdk";

const KNOWN_SKILLS = [
  "javascript",
  "typescript",
  "react",
  "redux",
  "node",
  "express",
  "mongodb",
  "mongoose",
  "python",
  "java",
  "sql",
  "aws",
  "docker",
  "html",
  "css",
  "tailwind",
  "git",
  "api",
  "rest",
];

function jsonFromResponse(content) {
  const match =
    content.match(/```json([\s\S]*?)```/) ||
    content.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("Invalid JSON returned by AI.");
  }

  return JSON.parse(match[1] || match[0]);
}

function basicResumeProfile(resumeText = "") {
  const lower = resumeText.toLowerCase();
  const skills = KNOWN_SKILLS.filter((skill) => lower.includes(skill));
  const email = resumeText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = resumeText.match(/\+?\d[\d\s-]{8,}\d/)?.[0] || "";
  const linkedin = resumeText.match(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s)]+/i)?.[0] || "";
  const github = resumeText.match(/https?:\/\/(?:www\.)?github\.com\/[^\s)]+/i)?.[0] || "";

  return {
    name: "",
    headline: skills.length ? `${skills.slice(0, 3).join(", ")} candidate` : "Candidate profile",
    email,
    phone,
    location: "",
    linkedin,
    github,
    portfolio: "",
    skills,
    softSkills: [],
    preferredRoles: [],
    industries: [],
    yearsOfExperience: 0,
    highestEducation: "",
    education: [],
    experience: [],
    certifications: [],
    projects: [],
    keywords: skills,
  };
}

export async function extractResumeProfile(resumeText) {
  if (!process.env.GROQ_API_KEY) {
    return basicResumeProfile(resumeText);
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",

      temperature: 0,

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: `
You are an expert technical recruiter.

Extract ALL useful career information from the resume.

Return ONLY valid JSON.

Never invent information.

If something is unavailable return empty string or empty array.

Return exactly this schema:

{
"name":"",
"headline":"",
"email":"",
"phone":"",
"location":"",
"linkedin":"",
"github":"",
"portfolio":"",

"skills":[],

"softSkills":[],

"preferredRoles":[],

"industries":[],

"yearsOfExperience":0,

"highestEducation":"",

"education":[
{
degree:"",
institution:"",
year:""
}
],

"experience":[
{
title:"",
company:"",
duration:"",
technologies":[]
}
],

"certifications":[],

"projects":[
{
name:"",
technologies":[]
}
],

"keywords":[]
}
`,
        },

        {
          role: "user",
          content: resumeText.slice(0, 25000),
        },
      ],
    });

    return jsonFromResponse(
      completion.choices[0].message.content
    );
  } catch {
    return basicResumeProfile(resumeText);
  }
}

export function normalizeResume(profile) {
  const unique = new Set();

  [
    ...(profile.skills || []),
    ...(profile.keywords || []),
    ...(profile.projects || []).flatMap(p => p.technologies || []),
    ...(profile.experience || []).flatMap(e => e.technologies || [])
  ]
    .map(skill => skill?.toString().trim())
    .filter(Boolean)
    .forEach(skill => unique.add(skill.toLowerCase()));

  return {
    ...profile,
    linkedIn: profile.linkedIn || profile.linkedin || "",

    normalizedSkills: [...unique],
  };
}
