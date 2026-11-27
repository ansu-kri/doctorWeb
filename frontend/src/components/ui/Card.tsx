import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => (
  <div className={`rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] ${className}`}>
    {children}
  </div>
);

export default Card;