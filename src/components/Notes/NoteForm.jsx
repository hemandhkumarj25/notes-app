import { useState } from "react";
import { X } from "lucide-react";
import Modal from "../UI/Modal";
import TagInput from "../Tags/TagInput";

// Create (note = null) or edit (note = existing note).
export default function NoteForm({ note, onSave, onClose }) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [description, setDescription] = useState(note?.description ?? "");
  const [tags, setTags] = useState(note?.tags ?? []);
  const [error, setError] = useState("");
  const isEdit = Boolean(note);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    onSave({ title, description, tags });
  }

  return (
    <Modal onClose={onClose} labelledBy="note-form-title">
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-col" noValidate>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id="note-form-title" className="text-lg font-semibold text-slate-900">
            {isEdit ? "Edit note" : "New note"}
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

        <div className="space-y-4 overflow-y-auto px-5 py-4">
          <div>
            <label htmlFor="note-title" className="mb-1 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              id="note-title"
              data-autofocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "note-title-error" : undefined}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
                error
                  ? "border-red-400 focus:ring-red-100"
                  : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
              }`}
            />
            {error && (
              <p id="note-title-error" className="mt-1 text-xs text-red-600">
                {error}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="note-description" className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="note-description"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label htmlFor="note-tags" className="mb-1 block text-sm font-medium text-slate-700">
              Tags
            </label>
            <TagInput id="note-tags" tags={tags} onChange={setTags} />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {isEdit ? "Save changes" : "Create note"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
