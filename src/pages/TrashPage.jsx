import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useNotes } from "../hooks/useNotes";
import NotesView from "../components/Notes/NotesView";
import ConfirmDialog from "../components/UI/ConfirmDialog";

export default function TrashPage() {
  const { notes, emptyTrash } = useNotes();
  const [confirming, setConfirming] = useState(false);
  const trashedCount = notes.filter((n) => n.isTrashed).length;

  return (
    <>
      <NotesView
        view="trash"
        title="Trash"
        empty={{
          icon: Trash2,
          title: "Trash is empty",
          message: "Deleted notes show up here. You can restore them or delete them forever.",
        }}
        actions={
          trashedCount > 0 && (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Empty Trash
            </button>
          )
        }
      />

      {confirming && (
        <ConfirmDialog
          title="Empty trash?"
          message={`All ${trashedCount} note${trashedCount === 1 ? "" : "s"} in the trash will be permanently deleted. This can't be undone.`}
          confirmLabel="Empty Trash"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            emptyTrash();
            setConfirming(false);
          }}
        />
      )}
    </>
  );
}
