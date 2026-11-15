import { useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useNotes } from "../../hooks/useNotes";
import { useFilters } from "../../hooks/useFilters";
import { normalizeTag } from "../../utils/tags";
import Modal from "../UI/Modal";
import ConfirmDialog from "../UI/ConfirmDialog";

// Rename or delete a tag across every note (trashed notes included).
export default function ManageTags({ onClose }) {
  const { notes, allTags, renameTag, deleteTag } = useNotes();
  const { replaceTag } = useFilters();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");
  const [deleting, setDeleting] = useState(null);

  const countFor = (tag) => notes.filter((n) => n.tags.includes(tag)).length;
  const draftTag = normalizeTag(draft);
  const mergesInto = editing && draftTag !== editing && allTags.includes(draftTag);

  function startEdit(tag) {
    setEditing(tag);
    setDraft(tag);
  }

  function saveEdit(e) {
    e.preventDefault();
    if (draftTag && draftTag !== editing) {
      renameTag(editing, draftTag);
      replaceTag(editing, draftTag);
    }
    setEditing(null);
  }

  function confirmDelete() {
    deleteTag(deleting);
    replaceTag(deleting, null);
    setDeleting(null);
  }

  return (
    <Modal onClose={onClose} labelledBy="manage-tags-title" className="max-w-md">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 id="manage-tags-title" className="text-lg font-semibold text-slate-900">
          Manage tags
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="overflow-y-auto px-5 py-3">
        {allTags.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">No tags yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {allTags.map((tag) => {
              const count = countFor(tag);
              return (
                <li key={tag} className="py-2">
                  {editing === tag ? (
                    <form onSubmit={saveEdit}>
                      <div className="flex items-center gap-2">
                        <input
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          aria-label={`New name for ${tag}`}
                          data-autofocus
                          autoFocus
                          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        />
                        <button
                          type="submit"
                          disabled={!draftTag}
                          aria-label="Save tag name"
                          className="rounded-lg p-1.5 text-indigo-600 hover:bg-indigo-50 disabled:opacity-40"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(null)}
                          aria-label="Cancel rename"
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {mergesInto && (
                        <p className="mt-1 text-xs text-amber-600">
                          #{draftTag} already exists; the two tags will be merged.
                        </p>
                      )}
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="flex-1 text-sm font-medium text-indigo-700">#{tag}</span>
                      <span className="text-xs text-slate-400">
                        {count} note{count === 1 ? "" : "s"}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEdit(tag)}
                        aria-label={`Rename ${tag}`}
                        title="Rename"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(tag)}
                        aria-label={`Delete ${tag}`}
                        title="Delete"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {deleting && (
        <ConfirmDialog
          title={`Delete #${deleting}?`}
          message={`The tag will be removed from ${countFor(deleting)} note${
            countFor(deleting) === 1 ? "" : "s"
          }. The notes themselves are kept.`}
          confirmLabel="Delete tag"
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}
    </Modal>
  );
}
