import type { ReactNode, MouseEventHandler } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: MouseEventHandler<HTMLButtonElement>;
}

const Modal = ({ open, title, children, onClose }: ModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;