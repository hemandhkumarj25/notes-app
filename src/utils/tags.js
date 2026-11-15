// The UI shows tags as "#tag", so a typed leading "#" is dropped.
export function normalizeTag(tag) {
  return tag.trim().replace(/^#+/, "").trim().toLowerCase();
}

// Trimmed, lowercased, no empties, no duplicates (order preserved).
export function normalizeTags(tags) {
  return [...new Set(tags.map(normalizeTag).filter(Boolean))];
}
