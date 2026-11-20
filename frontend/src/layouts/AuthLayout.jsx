import { Outlet } from "react-router-dom";
import Navbar from "../components/Header/Navbar";

const AuthLayout = () => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <Outlet />
  </div>
);

export default AuthLayout;
