import { useState } from "react";
import {
  Archive,
  ArchiveRestore,
  Eye,
  Pencil,
  Pin,
  PinOff,
  RotateCcw,
  Trash2,
  XCircle,
} from "lucide-react";
import { useNotes } from "../../hooks/useNotes";
import { getView } from "../../utils/filterNotes";
import ConfirmDialog from "../UI/ConfirmDialog";

function ActionButton({ label, icon: Icon, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`rounded-lg p-1.5 transition ${
        danger
          ? "text-slate-500 hover:bg-red-50 hover:text-red-600"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

// Actions available depend on where the note lives:
//   Notes:   View, Edit, Pin/Unpin, Archive, Trash
//   Archive: View, Edit, Unarchive, Trash
//   Trash:   View, Restore, Delete forever
// `onLeave` is called when the note moves out of its current view.
export default function NoteActions({ note, onView, onEdit, onLeave }) {
  const { togglePin, toggleArchive, moveToTrash, restoreNote, deletePermanently } =
    useNotes();
  const [confirming, setConfirming] = useState(false);
  const view = getView(note);

  const leaving = (fn) => () => {
    fn(note.id);
    onLeave?.();
  };

  return (
    // Stop clicks (including ones from the portaled ConfirmDialog) from
    // reaching the card, which opens the detail modal on click.
    <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
      {onView && <ActionButton label="View" icon={Eye} onClick={() => onView(note)} />}

      {view !== "trash" && (
        <ActionButton label="Edit" icon={Pencil} onClick={() => onEdit(note)} />
      )}

      {view === "notes" && (
        <ActionButton
          label={note.isPinned ? "Unpin" : "Pin"}
          icon={note.isPinned ? PinOff : Pin}
          onClick={() => togglePin(note.id)}
        />
      )}

      {view !== "trash" && (
        <ActionButton
          label={note.isArchived ? "Unarchive" : "Archive"}
          icon={note.isArchived ? ArchiveRestore : Archive}
          onClick={leaving(toggleArchive)}
        />
      )}

      {view !== "trash" && (
        <ActionButton
          label="Move to trash"
          icon={Trash2}
          danger
          onClick={leaving(moveToTrash)}
        />
      )}

      {view === "trash" && (
        <>
          <ActionButton label="Restore" icon={RotateCcw} onClick={leaving(restoreNote)} />
          <ActionButton
            label="Delete forever"
            icon={XCircle}
            danger
            onClick={() => setConfirming(true)}
          />
        </>
      )}

      {confirming && (
        <ConfirmDialog
          title="Delete forever?"
          message={`"${note.title}" will be permanently deleted. This can't be undone.`}
          confirmLabel="Delete forever"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            leaving(deletePermanently)();
          }}
        />
      )}
    </div>
  );
}
