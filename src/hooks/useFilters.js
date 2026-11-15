import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// Search query and selected tags live in the URL (?q=...&tag=a&tag=b).
export function useFilters() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const tags = params.getAll("tag");

  // One setParams call per change: back-to-back calls would overwrite each other.
  const update = useCallback(
    (change) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          change(next);
          return next;
        },
        { replace: true }
      ),
    [setParams]
  );

  const setQuery = useCallback(
    (value) =>
      update((p) => {
        if (value) p.set("q", value);
        else p.delete("q");
      }),
    [update]
  );

  const toggleTag = useCallback(
    (tag) =>
      update((p) => {
        const current = p.getAll("tag");
        p.delete("tag");
        const next = current.includes(tag)
          ? current.filter((t) => t !== tag)
          : [...current, tag];
        next.forEach((t) => p.append("tag", t));
      }),
    [update]
  );

  // Keep the URL in sync when a tag is renamed (to = new name) or deleted (to = null).
  const replaceTag = useCallback(
    (from, to) =>
      update((p) => {
        const current = p.getAll("tag");
        if (!current.includes(from)) return;
        p.delete("tag");
        const next = current.map((t) => (t === from ? to : t)).filter(Boolean);
        [...new Set(next)].forEach((t) => p.append("tag", t));
      }),
    [update]
  );

  const clearTags = useCallback(() => update((p) => p.delete("tag")), [update]);

  const clearFilters = useCallback(
    () =>
      update((p) => {
        p.delete("q");
        p.delete("tag");
      }),
    [update]
  );

  const search = params.toString() ? `?${params}` : "";

  return { query, tags, setQuery, toggleTag, replaceTag, clearTags, clearFilters, search };
}
