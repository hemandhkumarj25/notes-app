import NoteCard from "./NoteCard";

function Grid({ notes, onOpen, onEdit }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onOpen={onOpen} onEdit={onEdit} />
      ))}
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="mb-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
      {children}
    </h2>
  );
}

// Notes are expected pre-sorted (pinned first). "Pinned" / "Others" headings
// only appear when at least one pinned note is shown.
export default function NoteGrid({ notes, onOpen, onEdit }) {
  const pinned = notes.filter((n) => n.isPinned);
  const others = notes.filter((n) => !n.isPinned);

  if (pinned.length === 0) {
    return <Grid notes={notes} onOpen={onOpen} onEdit={onEdit} />;
  }

  return (
    <div className="space-y-8">
      <section>
        <SectionHeading>Pinned</SectionHeading>
        <Grid notes={pinned} onOpen={onOpen} onEdit={onEdit} />
      </section>
      {others.length > 0 && (
        <section>
          <SectionHeading>Others</SectionHeading>
          <Grid notes={others} onOpen={onOpen} onEdit={onEdit} />
        </section>
      )}
    </div>
  );
}
