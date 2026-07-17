import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiMapPin,
  FiExternalLink,
  FiClock,
  FiBriefcase,
  FiStar,
  FiFilter,
} from "react-icons/fi";

import Card from "../components/ui/Card";
import PageIntro from "../components/ui/PageIntro";
import api from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { getAllJobs } from "../features/jobSlice";

export default function ExplorePage() {
  // ---- State ----
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState({
    jobTitle: "",
    company: "",
    location: "",
    experience: "",
    salary: "",
    source: "",
    posted: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  // ---- Redux ----
  const dispatch = useDispatch();
  const { allJobs, loading, error } = useSelector((state) => state.jobs);
  const jobs = allJobs || [];

  // Fetch jobs once on mount
  useEffect(() => {
    dispatch(getAllJobs());
  }, [dispatch]);

  // Reset to first page whenever search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterValues]);

  // ---- Filtering ----
  const filteredJobs = useMemo(() => {
    // Apply search first
    const searched = !search.trim()
      ? jobs
      : jobs.filter((job) =>
          [job.jobRole, job.companyName, job.location, ...(job.skills || [])]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase()),
        );

    // Apply additional filters (case‑insensitive includes)
    return searched.filter((job) => {
      const {
        jobTitle,
        company,
        location,
        experience,
        salary,
        source,
        posted,
      } = filterValues;

      const checks = [];
      if (jobTitle)
        checks.push(
          job.jobRole?.toLowerCase().includes(jobTitle.toLowerCase()),
        );
      if (company)
        checks.push(
          job.companyName?.toLowerCase().includes(company.toLowerCase()),
        );
      if (location)
        checks.push(
          job.location?.toLowerCase().includes(location.toLowerCase()),
        );
      if (experience)
        checks.push(
          job.experience?.toLowerCase().includes(experience.toLowerCase()),
        );
      if (salary)
        checks.push(job.salary?.toLowerCase().includes(salary.toLowerCase()));
      if (source)
        checks.push(job.source?.toLowerCase().includes(source.toLowerCase()));
      if (posted)
        checks.push(job.postedAt?.toLowerCase().includes(posted.toLowerCase()));
      // If a filter field is empty we consider it a match
      return checks.every(Boolean);
    });
  }, [jobs, search, filterValues]);

  // ---- Pagination ----
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1;
  const currentJobs = useMemo(() => {
    const startIdx = (currentPage - 1) * jobsPerPage;
    return filteredJobs.slice(startIdx, startIdx + jobsPerPage);
  }, [filteredJobs, currentPage]);

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

      {/* Search & Filter */}
      <div className="flex gap-3">
        {/* Search */}
        <Card className="flex flex-1 items-center gap-3 p-3">
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
        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 rounded-xl bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-600"
        >
          <FiFilter />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="mt-4 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Job Title */}
          <input
            placeholder="Job Title"
            value={filterValues.jobTitle}
            onChange={(e) =>
              setFilterValues((prev) => ({ ...prev, jobTitle: e.target.value }))
            }
            className="bg-transparent border-b border-white/20 text-white placeholder:text-muted py-1"
          />
          {/* Company */}
          <input
            placeholder="Company"
            value={filterValues.company}
            onChange={(e) =>
              setFilterValues((prev) => ({ ...prev, company: e.target.value }))
            }
            className="bg-transparent border-b border-white/20 text-white placeholder:text-muted py-1"
          />
          {/* Location */}
          <input
            placeholder="Location"
            value={filterValues.location}
            onChange={(e) =>
              setFilterValues((prev) => ({ ...prev, location: e.target.value }))
            }
            className="bg-transparent border-b border-white/20 text-white placeholder:text-muted py-1"
          />
          {/* Experience */}
          <input
            placeholder="Experience"
            value={filterValues.experience}
            onChange={(e) =>
              setFilterValues((prev) => ({
                ...prev,
                experience: e.target.value,
              }))
            }
            className="bg-transparent border-b border-white/20 text-white placeholder:text-muted py-1"
          />
          {/* Salary */}
          <input
            placeholder="Salary"
            value={filterValues.salary}
            onChange={(e) =>
              setFilterValues((prev) => ({ ...prev, salary: e.target.value }))
            }
            className="bg-transparent border-b border-white/20 text-white placeholder:text-muted py-1"
          />
          {/* Source */}
          <input
            placeholder="Source"
            value={filterValues.source}
            onChange={(e) =>
              setFilterValues((prev) => ({ ...prev, source: e.target.value }))
            }
            className="bg-transparent border-b border-white/20 text-white placeholder:text-muted py-1"
          />
          {/* Posted */}
          <input
            placeholder="Posted (e.g., 2 days ago)"
            value={filterValues.posted}
            onChange={(e) =>
              setFilterValues((prev) => ({ ...prev, posted: e.target.value }))
            }
            className="bg-transparent border-b border-white/20 text-white placeholder:text-muted py-1"
          />
        </Card>
      )}

      {/* Content */}
      {loading ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-72 animate-pulse p-6">
              <div className="h-full rounded-xl bg-white/5" />
            </Card>
          ))}
        </div>
      ) : currentJobs.length === 0 ? (
        <Card className="mt-8 p-10 text-center">
          <h3 className="text-lg font-semibold text-white">No jobs found</h3>
          <p className="mt-2 text-sm text-muted">
            Try searching with another keyword.
          </p>
        </Card>
      ) : (
        <>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {currentJobs.map((job) => (
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
                  {/* Apply */}
                  <div className="mt-auto pt-6">
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 py-3 text-sm font-medium text-white transition hover:bg-violet-600"
                    >
                      Apply Now <FiExternalLink />
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="mt-8 flex items-center justify-between text-sm text-white">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`rounded px-3 py-1 ${currentPage === 1 ? "bg-gray-600 cursor-not-allowed" : "bg-violet-500 hover:bg-violet-600"}`}
            >
              Prev
            </button>
            <span>
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`rounded px-3 py-1 ${currentPage === totalPages ? "bg-gray-600 cursor-not-allowed" : "bg-violet-500 hover:bg-violet-600"}`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
