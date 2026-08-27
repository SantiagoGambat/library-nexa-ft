import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  className?: string;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({
  open,
  title,
  className = "",
  children,
  onClose,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div
        className={`w-full overflow-hidden rounded-2xl bg-white shadow-2xl ${
          className || "max-w-lg"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
