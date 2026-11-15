import { Link } from "react-router-dom";
import { Menu, NotebookPen, Plus } from "lucide-react";
import SearchBar from "../UI/SearchBar";

export default function Navbar({ onMenuClick, onNewNote }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Link to="/" className="flex shrink-0 items-center gap-2 font-bold text-slate-900">
        <NotebookPen className="h-6 w-6 text-indigo-600" aria-hidden="true" />
        <span className="hidden sm:inline">Notes</span>
      </Link>

      <div className="flex flex-1 justify-center">
        <SearchBar />
      </div>

      <button
        type="button"
        onClick={onNewNote}
        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">New Note</span>
        <span className="sr-only sm:hidden">New Note</span>
      </button>
    </header>
  );
}
