import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiFileText, FiPlus, FiUploadCloud, FiX } from "react-icons/fi";
import Card from "../components/ui/Card";
import PageIntro from "../components/ui/PageIntro";
import { useApp } from "../hooks/useApp";

const fields = [
  ["name", "Full name", "text", "Your name", true],
  ["email", "Email address", "email", "you@example.com", true],
  ["phone", "Phone number", "tel", "+91 00000 00000", false],
  ["location", "Location", "text", "City, Country", false],
  ["headline", "Professional headline", "text", "e.g. Data Analyst", false],
  ["linkedin", "LinkedIn URL", "url", "https://linkedin.com/in/your-name", false],
];

export default function ProfilePage() {
  const { profile, setProfile } = useApp();
  const [draft, setDraft] = useState(profile);
  const [skill, setSkill] = useState("");
  const [message, setMessage] = useState("");
  const [fileError, setFileError] = useState("");
  const fileInput = useRef(null);

  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const addSkill = () => {
    const trimmed = skill.trim();
    if (trimmed && !draft.skills.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      update("skills", [...draft.skills, trimmed]);
    }
    setSkill("");
  };
  const selectResume = (file) => {
    if (!file) return;
    if (!/\.(pdf|doc|docx)$/i.test(file.name)) {
      setFileError("Upload a PDF, DOC, or DOCX resume.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError("Your resume must be smaller than 10 MB.");
      return;
    }
    setFileError("");
    update("resume", file);
  };
  const saveProfile = (event) => {
    event.preventDefault();
    setProfile(draft);
    setMessage("Profile saved successfully.");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageIntro eyebrow="Your candidate profile" title="Profile details" description="Keep your information current so your job matches stay relevant." />
      <form onSubmit={saveProfile} className="grid gap-4 xl:grid-cols-5">
        <Card className="p-5 sm:p-7 xl:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div><h2 className="text-base font-medium text-white">Personal information</h2><p className="mt-1 text-xs text-muted">Fields marked * are required.</p></div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-cyan-300 to-violet-500 font-bold text-slate-900">{(draft.name || "U").split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {fields.map(([key, label, type, placeholder, required]) => <label key={key} className={key === "headline" || key === "linkedin" ? "sm:col-span-2" : ""}><span className="mb-2 block text-xs font-medium text-violet-100">{label}{required && <span className="text-violet-300"> *</span>}</span><input required={required} type={type} value={draft[key]} placeholder={placeholder} onChange={(event) => update(key, event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-violet-300/70 focus:ring-2 focus:ring-violet-400/15" /></label>)}
          </div>
        </Card>

        <Card className="p-5 sm:p-6 xl:col-span-2">
          <h2 className="text-base font-medium text-white">Resume</h2>
          <p className="mt-1 text-xs leading-5 text-muted">Add your latest resume for more accurate recommendations.</p>
          <input ref={fileInput} type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(event) => selectResume(event.target.files?.[0])} />
          {draft.resume ? <div className="mt-5 rounded-2xl border border-mint/20 bg-mint/7 p-4"><div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mint/15 text-mint"><FiFileText /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-white">{draft.resume.name}</p><p className="mt-1 text-xs text-mint">Ready to use</p></div><button type="button" onClick={() => update("resume", null)} aria-label="Remove resume" className="rounded-lg p-1.5 text-muted hover:bg-white/8 hover:text-white"><FiX /></button></div></div> : <button type="button" onClick={() => fileInput.current?.click()} className="mt-5 flex min-h-36 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-violet-300/30 bg-violet-500/4 px-4 text-center transition hover:border-violet-300/65 hover:bg-violet-500/8"><FiUploadCloud className="text-violet-200" size={25} /><span className="mt-3 text-sm font-medium text-white">Upload resume</span><span className="mt-1 text-xs text-muted">PDF, DOC, or DOCX up to 10 MB</span></button>}
          {draft.resume && <button type="button" onClick={() => fileInput.current?.click()} className="mt-3 text-xs text-violet-200 hover:text-white">Replace resume</button>}
          {fileError && <p className="mt-3 text-xs text-rose-300">{fileError}</p>}
        </Card>

        <Card className="p-5 sm:p-7 xl:col-span-5">
          <h2 className="text-base font-medium text-white">Skills</h2><p className="mt-1 text-xs text-muted">List the skills you want employers and matching tools to see.</p>
          <div className="mt-5 flex flex-wrap gap-2">{draft.skills.map((item) => <span key={item} className="flex items-center gap-1.5 rounded-full bg-violet-500/15 px-3 py-1.5 text-sm text-violet-100">{item}<button type="button" onClick={() => update("skills", draft.skills.filter((existing) => existing !== item))} aria-label={`Remove ${item}`} className="text-violet-200 hover:text-white"><FiX size={14} /></button></span>)}</div>
          <div className="mt-5 flex max-w-md gap-2"><input value={skill} onChange={(event) => setSkill(event.target.value)} onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), addSkill())} placeholder="Add a skill" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-white outline-none placeholder:text-muted/60 focus:border-violet-300/70" /><button type="button" onClick={addSkill} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 text-sm font-medium text-white transition hover:bg-white/15"><FiPlus /> Add</button></div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-5"><p className="text-xs text-muted">Your profile is visible only in this workspace.</p><div className="flex items-center gap-3">{message && <span className="flex items-center gap-1.5 text-sm text-mint"><FiCheck /> {message}</span>}<button type="submit" className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-violet-100">Save profile</button></div></div>
        </Card>
      </form>
    </motion.div>
  );
}
