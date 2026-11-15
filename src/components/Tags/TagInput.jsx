import { useState } from "react";
import TagChip from "./TagChip";
import { normalizeTag } from "../../utils/tags";

// Enter or comma adds a tag, Backspace on an empty input removes the last one.
export default function TagInput({ id, tags, onChange }) {
  const [text, setText] = useState("");

  function commit() {
    const tag = normalizeTag(text.replace(/,/g, ""));
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !text && tags.length) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-1.5 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
      {tags.map((tag) => (
        <TagChip
          key={tag}
          tag={tag}
          onRemove={(t) => onChange(tags.filter((x) => x !== t))}
        />
      ))}
      <input
        id={id}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={tags.length ? "" : "Add tags (Enter or comma)"}
        className="min-w-[8rem] flex-1 py-0.5 text-sm outline-none"
      />
    </div>
  );
}
