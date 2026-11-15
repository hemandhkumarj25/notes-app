// Pure reducer: ids and timestamps are created by the caller (see NotesContext)
// so that StrictMode's double-invocation produces identical results.

const updateById = (state, id, fn) =>
  state.map((n) => (n.id === id ? fn(n) : n));

export function notesReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "ADD_NOTE":
      return [payload, ...state];

    case "UPDATE_NOTE":
      return updateById(state, payload.id, (n) => ({
        ...n,
        title: payload.title,
        description: payload.description,
        tags: payload.tags,
        updatedAt: payload.now,
      }));

    case "TOGGLE_PIN":
      return updateById(state, payload.id, (n) =>
        n.isArchived || n.isTrashed ? n : { ...n, isPinned: !n.isPinned }
      );

    case "TOGGLE_ARCHIVE":
      return updateById(state, payload.id, (n) => ({
        ...n,
        isArchived: !n.isArchived,
        isPinned: false,
      }));

    case "MOVE_TO_TRASH":
      return updateById(state, payload.id, (n) => ({
        ...n,
        isTrashed: true,
        trashedAt: payload.now,
        isPinned: false,
      }));

    case "RESTORE_NOTE":
      return updateById(state, payload.id, (n) => ({
        ...n,
        isTrashed: false,
        trashedAt: null,
      }));

    case "DELETE_PERMANENTLY":
      return state.filter((n) => n.id !== payload.id);

    case "EMPTY_TRASH":
      return state.filter((n) => !n.isTrashed);

    // Renaming onto an existing tag merges the two.
    case "RENAME_TAG": {
      const { from, to } = payload;
      return state.map((n) =>
        n.tags.includes(from)
          ? { ...n, tags: [...new Set(n.tags.map((t) => (t === from ? to : t)))] }
          : n
      );
    }

    case "DELETE_TAG":
      return state.map((n) =>
        n.tags.includes(payload.tag)
          ? { ...n, tags: n.tags.filter((t) => t !== payload.tag) }
          : n
      );

    default:
      throw new Error(`Unknown action: ${type}`);
  }
}
