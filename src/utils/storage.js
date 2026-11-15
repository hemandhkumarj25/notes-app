const KEY = "notes-app:notes";

// Fill in defaults so older or hand-edited data can't break the UI.
function sanitizeNote(n) {
  return {
    id: n.id,
    title: String(n.title ?? ""),
    description: String(n.description ?? ""),
    tags: Array.isArray(n.tags) ? n.tags.map(String) : [],
    isPinned: Boolean(n.isPinned),
    isArchived: Boolean(n.isArchived),
    isTrashed: Boolean(n.isTrashed),
    createdAt: n.createdAt ?? new Date().toISOString(),
    updatedAt: n.updatedAt ?? n.createdAt ?? new Date().toISOString(),
    trashedAt: n.trashedAt ?? null,
  };
}

export function loadNotes() {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(data)) return [];
    return data.filter((n) => n && typeof n.id === "string").map(sanitizeNote);
  } catch {
    return [];
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(KEY, JSON.stringify(notes));
  } catch (err) {
    console.error("Failed to save notes", err);
  }
}
