import { Archive } from "lucide-react";
import NotesView from "../components/Notes/NotesView";

export default function ArchivePage() {
  return (
    <NotesView
      view="archive"
      title="Archive"
      empty={{
        icon: Archive,
        title: "No archived notes",
        message: "Archived notes are kept here, out of your main list.",
      }}
    />
  );
}
