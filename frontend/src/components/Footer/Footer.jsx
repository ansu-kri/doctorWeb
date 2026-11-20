import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="mt-16 border-t border-slate-200 bg-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
      <div>
        <p className="text-lg font-bold text-slate-900">Medicare</p>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          A premium clinic network for specialist care, diagnostics, and secure online consultations.
        </p>
      </div>
      <div>
        <p className="font-semibold text-slate-800">Care</p>
        <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
          <Link to="/doctors">Find a doctor</Link>
          <Link to="/services">Services</Link>
          <Link to="/book">Book appointment</Link>
        </div>
      </div>
      <div>
        <p className="font-semibold text-slate-800">Support</p>
        <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
          <Link to="/contact">Contact</Link>
          <a href="tel:+919876543210">+91 98765 43210</a>
          <a href="mailto:support@medicare.clinic">support@medicare.clinic</a>
        </div>
      </div>
      <div>
        <p className="font-semibold text-slate-800">Hours</p>
        <p className="mt-3 text-sm text-slate-500">Mon–Sat · 8:00 am – 8:00 pm</p>
        <p className="text-sm text-slate-500">Emergency referrals available 24/7</p>
      </div>
    </div>
    <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
      © {new Date().getFullYear()} Medicare Clinics. All rights reserved.
    </div>
  </footer>
);

export default Footer;
