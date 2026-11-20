const variants = {
  primary: "bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm",
  secondary: "bg-blue-50 text-[#2563EB] hover:bg-blue-100",
  outline: "border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-[#2563EB]",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-slate-600 hover:bg-slate-100",
};

const Button = ({
  children,
  className = "",
  variant = "primary",
  type = "button",
  disabled,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
