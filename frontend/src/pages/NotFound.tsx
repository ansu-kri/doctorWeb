import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFound = () => (
  <main className="grid min-h-[65vh] place-items-center px-4">
    <div className="text-center">
      <p className="text-sm font-semibold text-[#2563EB]">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-3 text-slate-500">The page may have moved or the address may be incorrect.</p>
      <Link to="/" className="mt-6 inline-block"><Button>Go to Medicare</Button></Link>
    </div>
  </main>
);

export default NotFound;
