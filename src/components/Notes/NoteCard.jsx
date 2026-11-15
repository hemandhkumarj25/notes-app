import { Pin } from "lucide-react";
import { useFilters } from "../../hooks/useFilters";
import { formatDate } from "../../utils/formatDate";
import TagChip from "../Tags/TagChip";
import NoteActions from "./NoteActions";

export default function NoteCard({ note, onOpen, onEdit }) {
  const { tags: activeTags, toggleTag } = useFilters();

  return (
    <article
      onClick={() => onOpen(note)}
      className="group flex cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold break-words text-slate-900">{note.title}</h3>
        {note.isPinned && (
          <Pin className="h-4 w-4 shrink-0 fill-indigo-500 text-indigo-500" aria-label="Pinned" />
        )}
      </div>

      {note.description && (
        <p className="mt-2 line-clamp-4 text-sm break-words whitespace-pre-wrap text-slate-600">
          {note.description}
        </p>
      )}

      {note.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
          {note.tags.map((t) => (
            <TagChip
              key={t}
              tag={t}
              active={activeTags.includes(t)}
              onClick={() => toggleTag(t)}
            />
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pt-3">
        <span className="text-xs whitespace-nowrap text-slate-400">
          {note.isTrashed
            ? `Trashed ${formatDate(note.trashedAt)}`
            : `Edited ${formatDate(note.updatedAt)}`}
        </span>
        <div className="ml-auto opacity-100 transition md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
          <NoteActions note={note} onView={onOpen} onEdit={onEdit} />
        </div>
      </div>
    </article>
  );
}
