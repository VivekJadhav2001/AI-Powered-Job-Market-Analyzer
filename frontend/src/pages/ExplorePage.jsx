import { motion } from "framer-motion";
import { FiMapPin, FiSearch } from "react-icons/fi";
import Card from "../components/ui/Card";
import PageIntro from "../components/ui/PageIntro";
import { jobs } from "../data/dashboardData";

export default function ExplorePage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageIntro
        eyebrow="Live opportunity map"
        title="Explore the market."
        description="Follow the roles, companies and skills gaining momentum right now."
      />
      <Card className="flex items-center gap-3 p-3">
        <FiSearch className="ml-2 text-muted" />
        <input
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-muted"
          placeholder="Search roles, skills, companies…"
        />
        <button className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white">
          Search
        </button>
      </Card>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job, index) => (
          <Card hover key={job.title} className="p-6">
            <div className="flex justify-between">
              <span className="rounded-lg bg-white/7 px-2.5 py-1 text-xs text-violet-200">
                {["Featured", "New signal", "Popular"][index]}
              </span>
              <span className="text-xs text-mint">{job.score}% fit</span>
            </div>
            <h2 className="mt-7 text-lg font-medium text-white">{job.title}</h2>
            <p className="mt-2 text-sm text-violet-200">{job.company}</p>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted">
              <FiMapPin />
              {job.location}
            </p>
            <div className="mt-6 border-t border-white/8 pt-4 text-sm text-white">
              {job.salary}
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
