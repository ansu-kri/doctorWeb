import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import {
  FiBarChart2,
  FiBell,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { toast } from "sonner";
import { useGetMeQuery, useLogoutMutation } from "../app/auth/authApi";
import { clearSession, getToken } from "../utils/auth";

interface NavigationItem {
  label: string;
  to: string;
  icon: IconType;
}

const navigationGroups: { label: string; items: NavigationItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", to: "/doctor/dashboard", icon: FiGrid },
      { label: "Appointments", to: "/doctor/appointments", icon: FiCalendar },
      { label: "Patients", to: "/doctor/patients", icon: FiUsers },
    ],
  },
  {
    label: "Schedule",
    items: [
      { label: "Availability", to: "/doctor/availability", icon: FiBarChart2 },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", to: "/doctor/profile", icon: FiUser },
      { label: "Settings", to: "/doctor/settings", icon: FiSettings },
    ],
  },
];

const DoctorLayout = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const token = getToken();
  const { data, isLoading, isError } = useGetMeQuery(undefined, { skip: !token });
  const [logout, { isLoading: loggingOut }] = useLogoutMutation();

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!profileOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !profileMenuRef.current?.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-slate-500">
        Checking doctor access…
      </div>
    );
  }

  const userRole = String(data?.data.role ?? "");
  if (isError || (userRole !== "doctor" && userRole !== "doctors")) {
    return <Navigate to="/unauthorized" replace />;
  }

  const userName = data?.data?.fullName || "Doctor";
  const userInitial = userName.trim().charAt(0).toUpperCase() || "D";
  const currentPage =
    navigationGroups.flatMap((group) => group.items).find((item) => item.to === location.pathname)?.label ??
    "Dashboard";

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      toast.error("Could not reach the server; signing out locally.");
    } finally {
      clearSession();
      window.location.assign("/");
    }
  };

  const sidebar = (
    <div className="flex min-h-full flex-col">
      <div className="mb-7 flex h-12 shrink-0 items-center justify-between px-1">
        <Link
          to="/doctor/dashboard"
          className="flex min-w-0 items-center gap-2.5"
          aria-label="Medicare Doctor dashboard"
          onClick={() => setMobileOpen(false)}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#2563EB] text-sm font-bold text-white">
            D
          </span>
          <span className={collapsed ? "min-w-0 lg:hidden" : "min-w-0"}>
            <span className="block truncate text-base font-bold leading-5 text-slate-900">
              Medicare
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
              Doctor Portal
            </span>
          </span>
        </Link>
        <button
          type="button"
          className="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:inline-flex"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close doctor navigation"
        >
          <FiX size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-6" aria-label="Doctor navigation">
        {navigationGroups.map((group) => (
          <section key={group.label}>
            <h2
              className={`mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              {group.label}
            </h2>
            <div className="space-y-1">
              {group.items.map(({ label, to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/doctor/profile"}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? label : undefined}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                      collapsed ? "lg:justify-center" : ""
                    } ${
                      isActive
                        ? "bg-blue-50 text-[#2563EB]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <Icon size={18} className="shrink-0" aria-hidden="true" />
                  <span className={collapsed ? "lg:sr-only" : "truncate"}>
                    {label}
                  </span>
                </NavLink>
              ))}
            </div>
          </section>
        ))}
      </nav>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <div className={`mb-3 flex items-center gap-3 px-1 ${collapsed ? "lg:justify-center" : ""}`}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-[#2563EB]">
            {userInitial}
          </span>
          <span className={collapsed ? "lg:sr-only" : "min-w-0"}>
            <span className="block truncate text-sm font-semibold text-slate-800">
              {userName}
            </span>
            <span className="block text-xs text-slate-500">Doctor</span>
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          title={collapsed ? "Log out" : undefined}
          className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60 ${
            collapsed ? "lg:justify-center" : ""
          }`}
        >
          <FiLogOut size={18} className="shrink-0" aria-hidden="true" />
          <span className={collapsed ? "lg:sr-only" : ""}>
            {loggingOut ? "Signing out…" : "Log out"}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="doctor-shell bg-slate-50">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation drawer"
          className="fixed inset-0 z-[60] cursor-default bg-slate-950/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`doctor-sidebar border-r border-slate-200 bg-white p-4 shadow-sm transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "doctor-sidebar-collapsed" : ""}`}
      >
        {sidebar}
      </aside>

      <div
        className={`doctor-main-panel min-w-0 transition-[margin] duration-200 ${
          collapsed ? "lg:ml-[76px]" : "lg:ml-[260px]"
        }`}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open doctor navigation"
              aria-expanded={mobileOpen}
            >
              <FiMenu size={21} />
            </button>
            <button
              type="button"
              className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:inline-flex"
              onClick={() => setCollapsed((value) => !value)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <FiMenu size={20} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {currentPage}
              </p>
              <p className="hidden text-xs text-slate-400 sm:block">
                Medicare doctor portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/doctor/notifications"
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#2563EB]"
              aria-label="Notifications"
              title="Notifications"
            >
              <FiBell size={19} />
            </Link>
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center gap-2 rounded-xl p-1.5 pr-2 text-left hover:bg-slate-50"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-[#2563EB]">
                  {userInitial}
                </span>
                <span className="hidden max-w-36 truncate text-sm font-medium text-slate-700 sm:block">
                  {userName}
                </span>
                <FiChevronRight
                  size={15}
                  className={`hidden text-slate-400 transition-transform sm:block ${
                    profileOpen ? "rotate-90" : ""
                  }`}
                />
              </button>
              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
                >
                  <Link
                    role="menuitem"
                    to="/doctor/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Doctor profile
                  </Link>
                  <Link
                    role="menuitem"
                    to="/doctor/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Profile settings
                  </Link>
                  <button
                    role="menuitem"
                    type="button"
                    disabled={loggingOut}
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    {loggingOut ? "Signing out…" : "Log out"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="doctor-main-scroll min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;