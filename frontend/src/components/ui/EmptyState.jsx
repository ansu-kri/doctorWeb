import Button from "./Button";

const EmptyState = ({ title, description, actionLabel, onAction }) => (
  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
    <p className="text-lg font-semibold text-slate-800">{title}</p>
    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>
    {actionLabel && (
      <Button className="mt-5" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
