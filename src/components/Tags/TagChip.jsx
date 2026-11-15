import { X } from "lucide-react";

const base = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium";

export default function TagChip({ tag, active = false, onClick, onRemove }) {
  const colors = active
    ? "bg-indigo-600 text-white"
    : "bg-indigo-100 text-indigo-700";

  if (onRemove) {
    return (
      <span className={`${base} ${colors}`}>
        #{tag}
        <button
          type="button"
          onClick={() => onRemove(tag)}
          aria-label={`Remove tag ${tag}`}
          className="rounded-full hover:bg-indigo-200"
        >
          <X className="h-3 w-3" />
        </button>
      </span>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`${base} ${colors} ${active ? "" : "hover:bg-indigo-200"}`}
      >
        #{tag}
      </button>
    );
  }

  return <span className={`${base} ${colors}`}>#{tag}</span>;
}
