import Groq from "groq-sdk";


function jsonFromResponse(content) {
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("The AI returned an invalid response");
  return JSON.parse(match[0]);
}

function basicResumeProfile(resumeText) {
  const knownSkills = ["JavaScript", "TypeScript", "React", "Node.js", "Express", "MongoDB", "SQL", "Python", "Java", "C++", "AWS", "Docker", "Kubernetes", "Git", "HTML", "CSS", "Tailwind", "Redux", "Next.js", "Machine Learning", "Data Analysis", "Power BI", "Tableau", "Figma"];
  const normalizedText = resumeText.toLowerCase();
  const linkedIn = resumeText.match(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s)]+/i)?.[0] || "";
  return {
    headline: "Resume uploaded — add a Groq API key for full AI profile extraction.",
    location: "",
    linkedIn,
    skills: knownSkills.filter((skill) => normalizedText.includes(skill.toLowerCase())),
    education: [],
    experience: [],
  };
}

export async function extractResumeProfile(resumeText) {
  const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  if (!groq) return basicResumeProfile(resumeText);
  const completion = await groq.chat.completions.create({
    model,
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [{ role: "system", content: "Extract resume data. Return only JSON with headline, location, linkedIn, skills (string array), education ({degree,institution,year} array), experience ({title,company,duration} array). Never invent facts." }, { role: "user", content: resumeText.slice(0, 24000) }],
  });
  const data = jsonFromResponse(completion.choices[0]?.message?.content || "{}");
  return {
    headline: data.headline || "",
    location: data.location || "",
    linkedIn: data.linkedIn || "",
    skills: Array.isArray(data.skills) ? data.skills.filter(Boolean).slice(0, 40) : [],
    education: Array.isArray(data.education) ? data.education.slice(0, 8) : [],
    experience: Array.isArray(data.experience) ? data.experience.slice(0, 12) : [],
  };
}

export function scoreJob(resumeSkills = [], job) {
  const normalize = (value) => String(value || "").toLowerCase().trim();
  const candidateSkills = [...new Set(resumeSkills.map(normalize).filter(Boolean))];
  const jobSkills = [...new Set((job.skills || []).map(normalize).filter(Boolean))];
  const matched = jobSkills.filter((skill) => candidateSkills.some((candidate) => candidate === skill || candidate.includes(skill) || skill.includes(candidate)));
  const missing = jobSkills.filter((skill) => !matched.includes(skill));
  const roleText = normalize(`${job.jobRole} ${job.description}`);
  const roleBonus = candidateSkills.some((skill) => roleText.includes(skill)) ? 8 : 0;
  const matchPercentage = jobSkills.length ? Math.min(100, Math.round((matched.length / jobSkills.length) * 92 + roleBonus)) : (candidateSkills.length ? 40 : 0);
  return { matchPercentage, matchedSkills: matched, missingSkills: missing.slice(0, 8), summary: matched.length ? `Strongest overlap: ${matched.slice(0, 4).join(", ")}.` : "Add role-specific skills to improve this match." };
}
