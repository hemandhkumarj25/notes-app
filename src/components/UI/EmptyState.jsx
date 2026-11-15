export default function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-6 py-16 text-center">
      {Icon && <Icon className="mb-3 h-10 w-10 text-slate-300" aria-hidden="true" />}
      <h2 className="font-medium text-slate-700">{title}</h2>
      {message && <p className="mt-1 text-sm text-slate-500">{message}</p>}
    </div>
  );
}
