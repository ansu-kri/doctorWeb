const ASSET_URL =
  import.meta.env.VITE_ASSET_URL ??
  (import.meta.env.DEV ? "http://localhost:5000" : "");

export const mediaUrl = (path: string | null | undefined): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${ASSET_URL}/${String(path).replace(/^\//, "")}`;
};

export const formatCurrency = (value: number | string | null | undefined): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatDate = (value: string | null | undefined): string => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};