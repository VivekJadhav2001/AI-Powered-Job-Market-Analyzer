import { FiArrowUpRight, FiMapPin } from "react-icons/fi";
import { jobs } from "../../data/dashboardData";
export default function JobList({ compact = false }) {
  const displayed = compact ? jobs.slice(0, 2) : jobs;
  return (
    <div className="divide-y divide-white/7">
      {displayed.map((job) => (
        <article
          key={job.title}
          className="flex min-w-[520px] items-center gap-4 py-4 first:pt-1"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-violet-500/50 to-cyan-400/20 text-sm font-bold">
            {job.company[0]}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-white">{job.title}</h3>
            <p className="mt-1 text-xs text-muted">
              {job.company} <span className="mx-1">·</span>
              <FiMapPin className="inline" /> {job.location}
            </p>
          </div>
          <p className="text-sm text-slate-300">{job.salary}</p>
          <span className="rounded-lg bg-mint/10 px-2.5 py-1 text-xs font-semibold text-mint">
            {job.score}%
          </span>
          <button className="text-muted hover:text-white">
            <FiArrowUpRight />
          </button>
        </article>
      ))}
    </div>
  );
}
