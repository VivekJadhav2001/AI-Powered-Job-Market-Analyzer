import { Outlet } from "react-router-dom";
import { FiBell, FiMenu, FiSearch } from "react-icons/fi";
import Sidebar from "./Sidebar";
import { useApp } from "../hooks/useApp";

export default function AppLayout() {
  const { setSidebarOpen } = useApp();
  return (
    <div className="app-background grid-fade min-h-screen">
      <Sidebar />
      <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-5 lg:ml-[calc(16rem+2.5rem)] lg:w-[calc(100%-18.5rem)] lg:px-8">
        <header className="mb-10 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="glass grid h-11 w-11 place-items-center rounded-xl lg:hidden"
            aria-label="Open navigation"
          >
            <FiMenu />
          </button>
          <div className="hidden items-center gap-2 text-sm text-muted sm:flex">
            <FiSearch />
            <span>Search market insights</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="glass grid h-10 w-10 place-items-center rounded-xl text-muted">
              <FiBell />
            </button>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-cyan-300 to-violet-500 text-xs font-bold text-slate-900">
              AK
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
