import { AnimatePresence, motion } from "framer-motion";
import {
  FiBarChart2,
  FiCompass,
  FiGrid,
  FiUser,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useApp } from "../hooks/useApp";

const links = [
  { to: "/", label: "Overview", icon: FiGrid },
  { to: "/upload", label: "Upload job listings", icon: FiUploadCloud },
  { to: "/matches", label: "AI matches", icon: FiBarChart2 },
  { to: "/explore", label: "Job explorer", icon: FiCompass },
  { to: "/profile", label: "My profile", icon: FiUser },
];
function NavLinks() {
  const { setSidebarOpen } = useApp();
  return (
    <nav className="mt-10 space-y-2">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          end={to === "/"}
          key={to}
          to={to}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${isActive ? "bg-white/10 text-white shadow-lg shadow-violet-900/10" : "text-muted hover:bg-white/5 hover:text-white"}`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
function SidebarContent({ close }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-violet-400 to-fuchsia-500 text-lg font-black">
            N
          </span>
          <span className="font-semibold tracking-tight">
            Nexora<span className="text-violet-300">.ai</span>
          </span>
        </NavLink>
        {close && (
          <button onClick={close} className="text-muted">
            <FiX size={22} />
          </button>
        )}
      </div>
      <NavLinks />
      <div className="mt-auto rounded-2xl border border-violet-400/15 bg-violet-500/10 p-4">
        <p className="text-xs font-medium text-violet-200">
          Market intelligence
        </p>
        <p className="mt-1 text-xs leading-5 text-muted">
          Your next high-growth role is waiting.
        </p>
      </div>
    </>
  );
}
export default function Sidebar() {
  const { isSidebarOpen, setSidebarOpen } = useApp();
  return (
    <>
      <aside className="glass fixed inset-y-5 left-5 z-20 hidden w-64 flex-col rounded-3xl p-5 lg:flex">
        <SidebarContent />
      </aside>
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.button
              aria-label="Close navigation"
              onClick={() => setSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/55 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="glass fixed inset-y-3 left-3 z-40 flex w-72 flex-col rounded-3xl p-5 lg:hidden"
            >
              <SidebarContent close={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
