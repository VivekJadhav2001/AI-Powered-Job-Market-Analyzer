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
  FiX,
  FiSliders,
} from "react-icons/fi";

import Card from "../components/ui/Card";
import PageIntro from "../components/ui/PageIntro";
import { useDispatch, useSelector } from "react-redux";
import { getAllJobs } from "../features/jobSlice";

const emptyFilters = {
  jobTitle: "",
  company: "",
  location: "",
  experience: "",
  salary: "",
  posted: "",
};

const filterFields = [
  { key: "jobTitle", label: "Job title", source: "jobRole" },
  { key: "company", label: "Company", source: "companyName" },
  { key: "location", label: "Location", source: "location" },
  { key: "experience", label: "Experience", source: "experience" },
  { key: "salary", label: "Salary", source: "salary" },
  { key: "posted", label: "Posted", source: "postedAt" },
];

const uniqueOptions = (jobs, key) =>
  [
    ...new Set(
      jobs
        .map((job) => job[key])
        .filter(Boolean)
        .map((value) => value.toString().trim())
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));

export default function ExplorePage() {
  // ---- State ----
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState(emptyFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  // ---- Redux ----
  const dispatch = useDispatch();
  const { allJobs, loading, error } = useSelector((state) => state.jobs);
  const jobs = useMemo(() => allJobs || [], [allJobs]);
  const filterOptions = useMemo(
    () =>
      filterFields.reduce((options, field) => {
        options[field.key] = uniqueOptions(jobs, field.source);
        return options;
      }, {}),
    [jobs],
  );

  useEffect(() => {
    if (!allJobs?.length) dispatch(getAllJobs());
  }, [allJobs?.length, dispatch]);

  const activeFilterCount = Object.values(filterValues).filter(Boolean).length;

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

  const updateFilter = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const updateSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setFilterValues(emptyFilters);
    setCurrentPage(1);
  };

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
      <div className="flex flex-col gap-3 lg:flex-row">
        {/* Search */}
        <Card className="flex flex-1 items-center gap-3 p-3">
          <FiSearch className="ml-2 text-muted text-lg" />
          <input
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
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
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white transition hover:bg-white/10"
        >
          <FiFilter />
          Filters
          {activeFilterCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-mint px-1.5 text-xs font-bold text-slate-950">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="mt-4 overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/15 text-violet-200">
                <FiSliders />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Refine job results
                </h2>
                <p className="mt-1 text-xs text-muted">
                  {filteredJobs.length} matching jobs update as you type.
                </p>
              </div>
            </div>
            <button
              onClick={clearFilters}
              disabled={!activeFilterCount && !search}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/6 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiX />
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            {filterFields.map((field) => (
              <label key={field.key} className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-muted">
                  {field.label}
                </span>
                <input
                  list={`${field.key}-options`}
                  value={filterValues[field.key]}
                  onChange={(e) => updateFilter(field.key, e.target.value)}
                  placeholder={`All ${field.label.toLowerCase()}s`}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition placeholder:text-muted focus:border-violet-400/60 focus:bg-white/8"
                />
                <datalist id={`${field.key}-options`}>
                  {(filterOptions[field.key] || []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </datalist>
              </label>
            ))}
          </div>
        </Card>
      )}

      {error && (
        <Card className="mt-6 border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
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
