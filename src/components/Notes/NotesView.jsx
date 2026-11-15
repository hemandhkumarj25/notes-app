import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { SearchX } from "lucide-react";
import { useNotes } from "../../hooks/useNotes";
import { useFilters } from "../../hooks/useFilters";
import { filterNotes } from "../../utils/filterNotes";
import EmptyState from "../UI/EmptyState";
import TagChip from "../Tags/TagChip";
import NoteGrid from "./NoteGrid";

// Shared body for the Notes / Archive / Trash pages.
export default function NotesView({ view, title, empty, actions }) {
  const { notes } = useNotes();
  const { query, tags, toggleTag, clearFilters } = useFilters();
  const { openNote, editNote } = useOutletContext();
  const tagsKey = tags.join(",");

  const visible = useMemo(
    () => filterNotes(notes, { view, query, tags }),
    // `tags` is a new array every render; tagsKey tracks its contents.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notes, view, query, tagsKey]
  );
  const isFiltered = Boolean(query.trim() || tags.length);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {isFiltered && (
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span>
                {visible.length} result{visible.length === 1 ? "" : "s"}
              </span>
              {query.trim() && <span>for “{query.trim()}”</span>}
              {tags.map((t) => (
                <TagChip key={t} tag={t} onRemove={toggleTag} />
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="text-indigo-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        {actions}
      </div>

      {visible.length > 0 ? (
        <NoteGrid notes={visible} onOpen={openNote} onEdit={editNote} />
      ) : isFiltered ? (
        <EmptyState
          icon={SearchX}
          title="No matching notes"
          message="Try a different search or fewer tags."
        />
      ) : (
        <EmptyState {...empty} />
      )}
    </div>
  );
}
