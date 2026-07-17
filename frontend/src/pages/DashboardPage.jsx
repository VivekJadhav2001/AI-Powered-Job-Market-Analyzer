import { motion } from "framer-motion";
import { FiArrowUpRight, FiZap } from "react-icons/fi";
import MarketTrendChart from "../charts/MarketTrendChart";
import SkillDemandChart from "../charts/SkillDemandChart";
import MetricCard from "../components/dashboard/MetricCard";
import JobList from "../components/jobs/JobList";
import Card from "../components/ui/Card";
import PageIntro from "../components/ui/PageIntro";
import { topRoles } from "../data/dashboardData";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const { metrics, topSkills, fastestGrowingRoles, loading } = useSelector(
    (state) => state.dashboard,
  );

  function getPartOfTheDay() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good Morning 👋";
    }

    if (hour >= 12 && hour < 17) {
      return "Good Afternoon 👋";
    }

    if (hour >= 17 && hour < 21) {
      return "Good Evening 👋";
    }

    return "Hey Night Owl 🦉";
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageIntro
        eyebrow="Intelligence overview"
        title={getPartOfTheDay()}
        description="A live reading of the opportunities shaping your next move."
        action={
          <button className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-violet-100">
            View full report
          </button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-5">
        <Card className="p-6 xl:col-span-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-medium text-white">Market momentum</h2>
              <p className="mt-1 text-xs text-muted">
                Demand for data roles over the past 7 months
              </p>
            </div>
          </div>
          <div className="mt-5 h-66">
            <MarketTrendChart />
          </div>
        </Card>
        <Card className="p-6 xl:col-span-2">
          <h2 className="font-medium text-white">Skill demand</h2>
          <p className="mt-1 text-xs text-muted">
            Most requested skills in your target roles
          </p>
          <div className="mt-5 h-66">
            <SkillDemandChart />
          </div>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-5">
        <Card className="overflow-hidden p-6 xl:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium text-white">Curated for you</h2>
              <p className="mt-1 text-xs text-muted">
                Top matches from today’s market scan
              </p>
            </div>
            <button className="text-xs text-violet-300">Explore all</button>
          </div>
          <div className="mt-5 overflow-x-auto">
            <JobList compact />
          </div>
        </Card>
        <Card className="relative overflow-hidden p-6 xl:col-span-2">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl" />
          <FiZap className="text-violet-300" size={20} />
          <h2 className="mt-4 text-lg font-medium text-white">
            Your market edge
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Your Python + product analytics profile is trending in the top 8% of
            matched candidates.
          </p>
          <button className="mt-5 flex items-center gap-2 text-sm font-medium text-white">
            See AI insights <FiArrowUpRight />
          </button>
        </Card>
      </div>
      <Card className="mt-4 p-6">
        <h2 className="font-medium text-white">Fastest-growing roles</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {fastestGrowingRoles.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white/4 p-4">
              <p className="text-sm text-white">{item.role}</p>

              <p className="mt-2 text-2xl font-semibold text-white">
                {item.openings}
              </p>

              <p className="mt-1 text-xs text-muted">Active openings</p>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
