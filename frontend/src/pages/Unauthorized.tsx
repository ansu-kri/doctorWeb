import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const Unauthorized = () => (
  <main className="grid min-h-[65vh] place-items-center px-4">
    <div className="max-w-md text-center">
      <p className="text-sm font-semibold text-[#2563EB]">Access restricted</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">You don’t have permission to view this page</h1>
      <p className="mt-3 text-slate-500">Sign in with an administrator account or return to the public site.</p>
      <Link to="/" className="mt-6 inline-block"><Button>Return home</Button></Link>
    </div>
  </main>
);

export default Unauthorized;
