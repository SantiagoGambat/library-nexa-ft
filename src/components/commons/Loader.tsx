interface LoaderProps {
  message?: string;
}

export default function Loader({
  message = "Cargando...",
}: LoaderProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px]">
      <div className="flex min-w-[220px] flex-col items-center rounded-2xl bg-white px-8 py-7 shadow-2xl">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />

        <p className="mt-4 text-sm font-semibold text-slate-700">
          {message}
        </p>
      </div>
    </div>
  );
}
