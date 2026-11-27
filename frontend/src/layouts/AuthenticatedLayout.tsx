import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Header/Navbar";
import { getStoredUser, getToken } from "../utils/auth";

interface AuthenticatedLayoutProps {
  roles?: string[];
}

const AuthenticatedLayout = ({ roles }: AuthenticatedLayoutProps) => {
  const token = getToken();
  const user = getStoredUser();
  const location = useLocation();

  // Check authentication
  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  // Check user role
  if (roles?.length && !roles.includes(String(user.role ?? ""))) {
    const redirectPath =
      user.role === "admin" ? "/admin" : "/dashboard";

    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <main className="page-enter mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticatedLayout;