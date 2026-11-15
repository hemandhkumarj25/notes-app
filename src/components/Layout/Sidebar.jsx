import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Archive, NotebookText, Settings2, Trash2, X } from "lucide-react";
import { useNotes } from "../../hooks/useNotes";
import { useFilters } from "../../hooks/useFilters";
import { matchesView } from "../../utils/filterNotes";
import TagFilter from "../Tags/TagFilter";
import ManageTags from "../Tags/ManageTags";

const LINKS = [
  { to: "/", view: "notes", label: "Notes", icon: NotebookText },
  { to: "/archive", view: "archive", label: "Archive", icon: Archive },
  { to: "/trash", view: "trash", label: "Trash", icon: Trash2 },
];

export default function Sidebar({ open, onClose }) {
  const { notes, allTags } = useNotes();
  const { search } = useFilters();
  const [managingTags, setManagingTags] = useState(false);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 shrink-0 overflow-y-auto border-r border-slate-200 bg-white py-4 transition-transform md:sticky md:top-16 md:z-0 md:h-[calc(100vh-4rem)] md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-2 flex justify-end px-3 md:hidden">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 px-2">
          {LINKS.map(({ to, view, label, icon: Icon }) => {
            const count = notes.filter((n) => matchesView(n, view)).length;
            return (
              <NavLink
                key={to}
                to={{ pathname: to, search }}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="flex-1">{label}</span>
                {count > 0 && <span className="text-xs text-slate-400">{count}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-6 mb-2 flex items-center justify-between px-5">
          <h2 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Tags
          </h2>
          {allTags.length > 0 && (
            <button
              type="button"
              onClick={() => setManagingTags(true)}
              aria-label="Manage tags"
              title="Manage tags"
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <Settings2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="px-2">
          <TagFilter />
        </div>
      </aside>

      {managingTags && <ManageTags onClose={() => setManagingTags(false)} />}
    </>
  );
}
