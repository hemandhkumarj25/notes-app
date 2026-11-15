export function matchesView(note, view) {
  switch (view) {
    case "notes":
      return !note.isArchived && !note.isTrashed;
    case "archive":
      return note.isArchived && !note.isTrashed;
    case "trash":
      return note.isTrashed;
    default:
      return false;
  }
}

export function getView(note) {
  if (note.isTrashed) return "trash";
  if (note.isArchived) return "archive";
  return "notes";
}

// A note must have every selected tag to match.
export function filterNotes(notes, { view, query = "", tags = [] }) {
  const q = query.trim().toLowerCase();
  return notes
    .filter((n) => matchesView(n, view))
    .filter(
      (n) =>
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q)
    )
    .filter((n) => tags.every((t) => n.tags.includes(t)))
    .sort(
      (a, b) =>
        b.isPinned - a.isPinned || new Date(b.updatedAt) - new Date(a.updatedAt)
    );
}
