import { NotebookText } from "lucide-react";
import NotesView from "../components/Notes/NotesView";

export default function NotesPage() {
  return (
    <NotesView
      view="notes"
      title="Notes"
      empty={{
        icon: NotebookText,
        title: "No notes yet",
        message: "Click “New Note” to create your first note.",
      }}
    />
  );
}
