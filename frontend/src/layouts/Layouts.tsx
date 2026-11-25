import { Outlet } from "react-router-dom";
import Navbar from "../components/Header/Navbar";
import Footer from "../components/Footer/Footer";

const PublicLayout = () => (
  <div className="min-h-screen bg-[#f8fafc]">
    <Navbar />
    <main className="page-enter">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;