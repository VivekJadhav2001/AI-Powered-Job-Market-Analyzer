import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiMapPin,
  FiExternalLink,
  FiClock,
  FiBriefcase,
  FiStar,
} from "react-icons/fi";

import Card from "../components/ui/Card";
import PageIntro from "../components/ui/PageIntro";
import api from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { getAllJobs } from "../features/jobSlice";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch()
  const { allJobs, loading, error } = useSelector(
  (state) => state.jobs
);
const jobs = allJobs;
  useEffect(() => {
   dispatch(getAllJobs())
  }, []);

  

  const filteredJobs = useMemo(() => {
    if (!search.trim()) return jobs;

    return jobs.filter((job) =>
      [
        job.jobRole,
        job.companyName,
        job.location,
        ...(job.skills || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [jobs, search]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <PageIntro
        eyebrow="Latest Jobs"
        title="Explore Opportunities"
        description="Discover the latest software opportunities curated for aspiring developers."
      />

      {/* Search */}
      <Card className="flex items-center gap-3 p-3">
        <FiSearch className="ml-2 text-muted text-lg" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-muted"
          placeholder="Search role, company, location or skills..."
        />

        <button className="rounded-xl bg-violet-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-600">
          Search
        </button>
      </Card>

      {/* Loading */}
      {loading ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-72 animate-pulse p-6">
              <div className="h-full rounded-xl bg-white/5" />
            </Card>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="mt-8 p-10 text-center">
          <h3 className="text-lg font-semibold text-white">
            No jobs found
          </h3>
          <p className="mt-2 text-sm text-muted">
            Try searching with another keyword.
          </p>
        </Card>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job) => (
            <motion.div
              key={job._id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                hover
                className="flex h-full flex-col overflow-hidden p-6"
              >
                {/* Company */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="h-12 w-12 rounded-xl bg-white object-contain p-1"
                    />

                    <div>
                      <h3 className="font-semibold text-white">
                        {job.companyName}
                      </h3>

                      <div className="mt-1 flex items-center gap-1 text-xs text-yellow-400">
                        <FiStar />
                        {job.companyRating || "N/A"}
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
                    New
                  </span>
                </div>

                {/* Role */}
                <h2 className="mt-6 text-lg font-semibold text-white">
                  {job.jobRole}
                </h2>

                {/* Meta */}
                <div className="mt-4 space-y-2 text-sm text-muted">
                  <div className="flex items-center gap-2">
                    <FiMapPin />
                    {job.location}
                  </div>

                  <div className="flex items-center gap-2">
                    <FiBriefcase />
                    {job.experience}
                  </div>

                  <div className="flex items-center gap-2">
                    <FiClock />
                    {job.postedAt}
                  </div>
                </div>

                {/* Description */}
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-300">
                  {job.description}
                </p>

                {/* Skills */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {job.skills?.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-white/5 px-3 py-1 text-xs text-violet-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 py-3 text-sm font-medium text-white transition hover:bg-violet-600"
                  >
                    Apply Now
                    <FiExternalLink />
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}