import { useNotes } from "../../hooks/useNotes";
import { useFilters } from "../../hooks/useFilters";
import TagChip from "./TagChip";

export default function TagFilter() {
  const { allTags } = useNotes();
  const { tags, toggleTag, clearTags } = useFilters();

  if (allTags.length === 0) {
    return <p className="px-3 text-xs text-slate-400">No tags yet</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5 px-3">
      <button
        type="button"
        onClick={clearTags}
        aria-pressed={tags.length === 0}
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          tags.length
            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
            : "bg-slate-800 text-white"
        }`}
      >
        All
      </button>
      {allTags.map((t) => (
        <TagChip
          key={t}
          tag={t}
          active={tags.includes(t)}
          onClick={() => toggleTag(t)}
        />
      ))}
    </div>
  );
}
