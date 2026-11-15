import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useNotes } from "../../hooks/useNotes";
import { useFilters } from "../../hooks/useFilters";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import NoteForm from "../Notes/NoteForm";
import NoteModal from "../Notes/NoteModal";

// Owns the create/edit form and the detail modal so they work from any page
// (the navbar's "New Note" button included). Pages reach them via Outlet context.
export default function Layout() {
  const { notes, addNote, updateNote } = useNotes();
  const { search } = useFilters();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState(null); // null = closed, { note: null } = new, { note } = edit
  const [viewingId, setViewingId] = useState(null);

  // Look the note up live so the modal reflects changes (e.g. pin toggles).
  const viewingNote = notes.find((n) => n.id === viewingId);

  useEffect(() => setSidebarOpen(false), [location.pathname]);

  const outletContext = {
    openNote: (note) => setViewingId(note.id),
    editNote: (note) => {
      setViewingId(null);
      setForm({ note });
    },
  };

  function handleSave(values) {
    if (form.note) {
      updateNote({ id: form.note.id, ...values });
    } else {
      addNote(values);
      // New notes are active; show them if we're on Archive/Trash.
      if (location.pathname !== "/") navigate({ pathname: "/", search });
    }
    setForm(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
        onNewNote={() => setForm({ note: null })}
      />

      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1 p-4 md:p-6">
          <Outlet context={outletContext} />
        </main>
      </div>

      {viewingNote && (
        <NoteModal
          note={viewingNote}
          onClose={() => setViewingId(null)}
          onEdit={outletContext.editNote}
        />
      )}

      {form && (
        <NoteForm
          key={form.note?.id ?? "new"}
          note={form.note}
          onSave={handleSave}
          onClose={() => setForm(null)}
        />
      )}
    </div>
  );
}
