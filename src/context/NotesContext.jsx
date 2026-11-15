import { createContext, useEffect, useMemo, useReducer } from "react";
import { notesReducer } from "../reducer/notesReducer";
import { loadNotes, saveNotes } from "../utils/storage";
import { normalizeTag, normalizeTags } from "../utils/tags";

export const NotesContext = createContext(null);

const now = () => new Date().toISOString();

export function NotesProvider({ children }) {
  const [notes, dispatch] = useReducer(notesReducer, undefined, loadNotes);

  useEffect(() => saveNotes(notes), [notes]);

  const actions = useMemo(
    () => ({
      addNote({ title, description, tags }) {
        const timestamp = now();
        dispatch({
          type: "ADD_NOTE",
          payload: {
            id: crypto.randomUUID(),
            title: title.trim(),
            description,
            tags: normalizeTags(tags),
            isPinned: false,
            isArchived: false,
            isTrashed: false,
            createdAt: timestamp,
            updatedAt: timestamp,
            trashedAt: null,
          },
        });
      },
      updateNote({ id, title, description, tags }) {
        dispatch({
          type: "UPDATE_NOTE",
          payload: {
            id,
            title: title.trim(),
            description,
            tags: normalizeTags(tags),
            now: now(),
          },
        });
      },
      togglePin: (id) => dispatch({ type: "TOGGLE_PIN", payload: { id } }),
      toggleArchive: (id) => dispatch({ type: "TOGGLE_ARCHIVE", payload: { id } }),
      moveToTrash: (id) =>
        dispatch({ type: "MOVE_TO_TRASH", payload: { id, now: now() } }),
      restoreNote: (id) => dispatch({ type: "RESTORE_NOTE", payload: { id } }),
      deletePermanently: (id) =>
        dispatch({ type: "DELETE_PERMANENTLY", payload: { id } }),
      emptyTrash: () => dispatch({ type: "EMPTY_TRASH" }),
      renameTag(from, to) {
        const next = normalizeTag(to);
        if (next && next !== from) {
          dispatch({ type: "RENAME_TAG", payload: { from, to: next } });
        }
      },
      deleteTag: (tag) => dispatch({ type: "DELETE_TAG", payload: { tag } }),
    }),
    []
  );

  const allTags = useMemo(
    () =>
      [...new Set(notes.filter((n) => !n.isTrashed).flatMap((n) => n.tags))].sort(),
    [notes]
  );

  const value = useMemo(
    () => ({ notes, allTags, ...actions }),
    [notes, allTags, actions]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}
