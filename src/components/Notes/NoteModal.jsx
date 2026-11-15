import { X } from "lucide-react";
import { useFilters } from "../../hooks/useFilters";
import { formatDate } from "../../utils/formatDate";
import Modal from "../UI/Modal";
import TagChip from "../Tags/TagChip";
import NoteActions from "./NoteActions";

export default function NoteModal({ note, onClose, onEdit }) {
  const { tags: activeTags, toggleTag } = useFilters();

  return (
    <Modal onClose={onClose} labelledBy="note-modal-title" className="max-w-2xl">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="min-w-0">
          <h2 id="note-modal-title" className="text-xl font-semibold break-words text-slate-900">
            {note.title}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Created {formatDate(note.createdAt, true)} · Edited {formatDate(note.updatedAt, true)}
            {note.isTrashed && ` · Trashed ${formatDate(note.trashedAt, true)}`}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="overflow-y-auto px-5 py-4">
        {note.description ? (
          <p className="break-words whitespace-pre-wrap text-slate-700">{note.description}</p>
        ) : (
          <p className="text-sm text-slate-400 italic">No description</p>
        )}

        {note.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {note.tags.map((t) => (
              <TagChip
                key={t}
                tag={t}
                onClick={() => {
                  if (!activeTags.includes(t)) toggleTag(t);
                  onClose();
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-5 py-2">
        <NoteActions note={note} onEdit={onEdit} onLeave={onClose} />
      </div>
    </Modal>
  );
}
