import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BiMenu, BiX } from "react-icons/bi";
import { toast } from "sonner";
import logo from "../../assets/images/logo.png";
import Button from "../ui/Button";
import { clearSession, getStoredUser } from "../../utils/auth";
import { useLogoutMutation } from "../../app/auth/authApi";

const publicLinks = [
  { path: "/", display: "Home" },
  { path: "/doctors", display: "Find a Doctor" },
  { path: "/services", display: "Services" },
  { path: "/contact", display: "Contact" },
];

const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser());
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const sync = () => setUser(getStoredUser());
    window.addEventListener("medicare-auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("medicare-auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const dashboardPath = user?.role === "admin" ? "/admin" : "/dashboard";

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      /* client-side logout still proceeds */
    }
    clearSession();
    toast.success("You have been signed out");
    navigate("/");
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Medicare" className="h-10 w-auto" />
            {/* <span className="text-lg font-bold text-slate-900">Medicare</span> */}
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {publicLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${isActive ? "text-[#2563EB]" : "text-slate-600 hover:text-[#2563EB]"}`
                }
              >
                {link.display}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link to={dashboardPath}>
                  <Button variant="secondary">{user.role === "admin" ? "Admin" : "Dashboard"}</Button>
                </Link>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="outline">Login</Button></Link>
                <Link to="/signup"><Button>Register</Button></Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <BiMenu className="h-8 w-8" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 md:hidden" onClick={() => setOpen(false)}>
          <aside
            className="absolute right-0 top-0 h-full w-[80%] max-w-xs bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-semibold">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <BiX className="h-8 w-8" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {publicLinks.map((link) => (
                <NavLink key={link.path} to={link.path} onClick={() => setOpen(false)} className="text-slate-700">
                  {link.display}
                </NavLink>
              ))}
              {user ? (
                <>
                  <Link to={dashboardPath} onClick={() => setOpen(false)}>Dashboard</Link>
                  <Button onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}><Button variant="outline" className="w-full">Login</Button></Link>
                  <Link to="/signup" onClick={() => setOpen(false)}><Button className="w-full">Register</Button></Link>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
      <div className="h-20" />
    </>
  );
};

export default Header;
