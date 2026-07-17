import { AnimatePresence, motion } from "framer-motion";
import {
  FiBarChart2,
  FiCompass,
  FiGrid,
  FiUser,
  FiUploadCloud,
  FiX,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useApp } from "../hooks/useApp";

const links = [
  { to: "/", label: "Dashboard", icon: FiGrid },
  { to: "/upload", label: "Upload Jobs", icon: FiUploadCloud },
  { to: "/matches", label: "AI Matches", icon: FiBarChart2 },
  { to: "/explore", label: "Explore", icon: FiCompass },
];

function NavLinks() {
  const { setSidebarOpen } = useApp();

  return (
    <nav className="mt-10 space-y-2">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={() => setSidebarOpen(false)}
        >
          {({ isActive }) => (
            <motion.div
              whileHover={{ x: 6 }}
              transition={{ duration: 0.2 }}
              className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl px-4 py-3 transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-violet-500/25 to-fuchsia-500/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {isActive && (
                <>
                  <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-violet-400"
                  />

                  <div className="absolute inset-0 bg-violet-500/5 blur-xl" />
                </>
              )}

              <Icon
                size={18}
                className={`relative z-10 transition ${
                  isActive
                    ? "text-violet-300"
                    : "group-hover:text-violet-300"
                }`}
              />

              <span className="relative z-10 text-sm font-medium">
                {label}
              </span>
            </motion.div>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarContent({ close }) {
  return (
    <>
      {/* Logo */}

      <div className="relative">
        <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-lg font-black shadow-lg shadow-violet-500/40"
            >
              C
            </motion.div>

            <div>
              <p className="text-lg font-bold tracking-tight text-white">
                CareerLens
              </p>

              <p className="text-xs tracking-widest text-violet-300 uppercase">
                Career Insights
              </p>
            </div>
          </NavLink>

          {close && (
            <button
              onClick={close}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <FiX size={20} />
            </button>
          )}
        </div>
      </div>

      <NavLinks />

      <div className="mt-auto space-y-5">
        {/* Live Card */}

        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10 p-5">

          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-violet-500/20 blur-2xl" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-violet-300">
              <FiTrendingUp />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Live Market
              </span>
            </div>

            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
              }}
              className="h-2.5 w-2.5 rounded-full bg-emerald-400"
            />
          </div>

          <h3 className="mt-4 text-3xl font-bold text-white">
            2,144
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Active opportunities today
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs text-emerald-400">
            <FiActivity />
            Updated just now
          </div>
        </div>

        {/* Profile */}

        <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 backdrop-blur-xl">

          <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-bold text-white">
            V
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-white">
              Vivek
            </p>

            <p className="text-xs text-slate-400">
              Software Engineer
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Sidebar() {
  const { isSidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      <aside className="fixed inset-y-4 left-4 z-20 hidden w-72 overflow-hidden rounded-[28px] border border-white/10 bg-[#0F0C22]/80 p-6 backdrop-blur-3xl lg:flex lg:flex-col">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#7C3AED20,transparent_50%)]" />

        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 280,
              }}
              className="fixed inset-y-3 left-3 z-40 flex w-72 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0F0C22]/90 p-6 backdrop-blur-3xl lg:hidden"
            >
              <SidebarContent close={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}