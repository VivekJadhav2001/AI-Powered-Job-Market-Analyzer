import { motion } from "framer-motion";
import { FiFilter, FiSliders } from "react-icons/fi";
import JobList from "../components/jobs/JobList";
import Card from "../components/ui/Card";
import PageIntro from "../components/ui/PageIntro";

export default function MatchesPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageIntro
        eyebrow="AI match engine"
        title="Roles that fit your signal."
        description="Our matching model balances skills, career trajectory, role intent, and market opportunity."
        action={
          <button className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white">
            <FiSliders /> Tune preferences
          </button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="p-5 lg:col-span-1">
            
          <div className="flex items-center gap-2 text-sm text-white">
            <FiFilter /> Match filters
          </div>
          <div className="mt-5 space-y-5 text-sm">
            <div>
              <p className="text-muted">Work mode</p>
              <div className="mt-3 space-y-2 text-slate-200">
                <label className="block">
                  <input
                    defaultChecked
                    type="checkbox"
                    className="mr-2 accent-violet-400"
                  />
                  Hybrid
                </label>
                <label className="block">
                  <input type="checkbox" className="mr-2 accent-violet-400" />
                  Remote
                </label>
              </div>
            </div>
            <div>
              <p className="text-muted">Match score</p>
              <p className="mt-2 text-2xl text-white">85%+</p>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden p-6 lg:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-medium text-white">
                18 high-confidence matches
              </h2>
              <p className="mt-1 text-xs text-muted">
                Updated from the latest market signals
              </p>
            </div>
            <span className="rounded-lg bg-mint/10 px-3 py-1.5 text-xs font-medium text-mint">
              Strong profile fit
            </span>
          </div>
          <div className="overflow-x-auto">
            <JobList />
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
