import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-5xl font-bold text-slate-300">404</p>
      <h1 className="mt-4 text-xl font-semibold text-slate-800">Page not found</h1>
      <Link to="/" className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline">
        Back to notes
      </Link>
    </div>
  );
}
