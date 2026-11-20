const Field = ({ label, children, error }) => (
  <label className="block">
    {label && <span className="mb-1.5 block text-sm font-medium text-slate-600">{label}</span>}
    {children}
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
);

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100";

export default Field;
