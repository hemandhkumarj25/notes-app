# Notes App — Implementation Plan

A notes management app built with **React JS**, **TailwindCSS**, **React Router DOM**, and **localStorage**. Users can create, view, edit, tag, search, filter, pin, archive, trash, restore, and permanently delete notes.

---

## 1. Tech Stack & Setup

| Concern          | Choice                                   |
| ---------------- | ---------------------------------------- |
| Build tool       | Vite (React template)                    |
| UI library       | React 18+ (functional components, hooks) |
| Styling          | TailwindCSS                              |
| Routing          | React Router DOM v6+                     |
| State            | Context API + `useReducer`               |
| Persistence      | `localStorage`                           |
| IDs              | `crypto.randomUUID()`                    |
| Icons (optional) | `react-icons` or `lucide-react`          |

### Setup commands

```bash
npm create vite@latest notes-app -- --template react
cd notes-app
npm install
npm install react-router-dom
npm install tailwindcss @tailwindcss/vite
npm install lucide-react        # optional icons
```

`vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({ plugins: [react(), tailwindcss()] });
```

`src/index.css`:

```css
@import "tailwindcss";
```

---

## 2. Folder Structure

```
src/
├── main.jsx                  # Root render, BrowserRouter, NotesProvider
├── App.jsx                   # Layout + Routes
├── index.css                 # Tailwind import
│
├── context/
│   └── NotesContext.jsx      # Context, provider, reducer wiring
│
├── reducer/
│   └── notesReducer.js       # All note actions (pure functions)
│
├── hooks/
│   ├── useNotes.js           # Shortcut: useContext(NotesContext)
│   └── useLocalStorage.js    # Generic load/save hook
│
├── utils/
│   ├── storage.js            # loadNotes / saveNotes with try/catch
│   └── filterNotes.js        # Search + tag filter + sort (pinned first)
│
├── components/
│   ├── Layout/
│   │   ├── Navbar.jsx        # App title, search bar, "New Note" button
│   │   └── Sidebar.jsx       # Links: Notes, Archive, Trash + tag list
│   ├── Notes/
│   │   ├── NoteCard.jsx      # Card: title, preview, tags, action buttons
│   │   ├── NoteGrid.jsx      # Responsive grid; "Pinned" & "Others" sections
│   │   ├── NoteForm.jsx      # Create/Edit form (title, description, tags)
│   │   └── NoteModal.jsx     # Expanded view of one note
│   ├── Tags/
│   │   ├── TagInput.jsx      # Add/remove tags as chips
│   │   └── TagFilter.jsx     # Clickable tag chips to filter
│   └── UI/
│       ├── SearchBar.jsx
│       ├── EmptyState.jsx    # "No notes here" messages
│       └── ConfirmDialog.jsx # Confirm permanent delete / empty trash
│
└── pages/
    ├── NotesPage.jsx         # Active notes (pinned on top)
    ├── ArchivePage.jsx       # Archived notes
    ├── TrashPage.jsx         # Trashed notes: restore / delete forever
    └── NotFound.jsx
```

---

## 3. Data Model

```js
// A single note
{
  id: "uuid",
  title: "Shopping list",
  description: "Milk, eggs, bread",
  tags: ["personal", "errands"],
  isPinned: false,
  isArchived: false,
  isTrashed: false,
  createdAt: "2026-11-10T10:00:00.000Z",
  updatedAt: "2026-11-10T10:00:00.000Z",
  trashedAt: null            // set when moved to trash
}
```

**Note state rules**

| View    | Condition                          |
| ------- | ---------------------------------- |
| Notes   | `!isArchived && !isTrashed`        |
| Archive | `isArchived && !isTrashed`         |
| Trash   | `isTrashed`                        |

- Pinning only applies to active notes. Archiving or trashing a note sets `isPinned = false`.
- Restoring from trash returns the note to where it was (archived flag is kept).

**localStorage key:** `notes-app:notes` → JSON array of notes.

---

## 4. State Management

### Reducer actions (`notesReducer.js`)

| Action               | Payload                         | Effect                                            |
| -------------------- | ------------------------------- | ------------------------------------------------- |
| `ADD_NOTE`           | `{ title, description, tags }`  | Creates note with id + timestamps                 |
| `UPDATE_NOTE`        | `{ id, title, description, tags }` | Updates fields + `updatedAt`                   |
| `TOGGLE_PIN`         | `id`                            | Flips `isPinned`                                  |
| `TOGGLE_ARCHIVE`     | `id`                            | Flips `isArchived`, unpins                        |
| `MOVE_TO_TRASH`      | `id`                            | `isTrashed = true`, `trashedAt = now`, unpins     |
| `RESTORE_NOTE`       | `id`                            | `isTrashed = false`, `trashedAt = null`           |
| `DELETE_PERMANENTLY` | `id`                            | Removes note from array                           |
| `EMPTY_TRASH`        | —                               | Removes all trashed notes                         |

### Context (`NotesContext.jsx`)

- Initialize reducer lazily from localStorage:
  `useReducer(notesReducer, [], () => loadNotes())`
- `useEffect(() => saveNotes(notes), [notes])` — persist on every change.
- Expose: `notes`, `dispatch` (or wrapped helpers like `addNote`, `togglePin`…), and derived `allTags` (unique, sorted tags from non-trashed notes).

### UI state (local to components / URL)

- `searchQuery` and `selectedTag` — kept in URL query params (`?q=...&tag=...`) via `useSearchParams`, so filters survive refresh and work on every page.
- `editingNote`, `viewingNote`, `isFormOpen` — local `useState` in pages.

---

## 5. Routing

```jsx
<Routes>
  <Route element={<Layout />}>
    <Route path="/"        element={<NotesPage />} />
    <Route path="/archive" element={<ArchivePage />} />
    <Route path="/trash"   element={<TrashPage />} />
    <Route path="*"        element={<NotFound />} />
  </Route>
</Routes>
```

`Layout` renders `Navbar`, `Sidebar`, and `<Outlet />`.

---

## 6. Search, Filter & Sort Logic (`utils/filterNotes.js`)

```js
export function filterNotes(notes, { view, query, tag }) {
  const q = query.trim().toLowerCase();
  return notes
    .filter((n) => matchesView(n, view))
    .filter((n) => !q ||
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q))
    .filter((n) => !tag || n.tags.includes(tag))
    .sort((a, b) =>
      (b.isPinned - a.isPinned) ||
      new Date(b.updatedAt) - new Date(a.updatedAt));
}
```

- Wrap calls in `useMemo` keyed on `notes`, `query`, `tag`.
- Tags are normalized: trimmed, lowercased, no duplicates.

---

## 7. Feature Breakdown

### 7.1 Create & List Notes
- "New Note" button opens `NoteForm` (modal).
- Fields: title (required), description, tags (via `TagInput` — Enter or comma adds a chip, × removes).
- Validation: title must not be empty; show inline error.
- `NoteGrid` renders a responsive grid:
  `grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- On the Notes page, show two sections: **Pinned** and **Others** (only show the heading when pinned notes exist).

### 7.2 View Details
- Clicking a card opens `NoteModal` with full title, description (`whitespace-pre-wrap`), tags, created/updated dates, and actions.
- Close on × button, backdrop click, or `Esc` key.

### 7.3 Edit
- "Edit" in card/modal opens `NoteForm` pre-filled; submit dispatches `UPDATE_NOTE`.

### 7.4 Search & Tag Filter
- `SearchBar` in navbar updates `?q=`.
- `TagFilter` in sidebar lists all tags; clicking toggles `?tag=`; an "All" chip clears it.
- Clicking a tag chip on a card also applies that filter.

### 7.5 Pin
- Pin icon on each active card; pinned cards show a filled pin and sort to the top.

### 7.6 Archive
- "Archive" on active notes → moves to Archive page.
- Archive page shows "Unarchive" and "Delete" (move to trash).

### 7.7 Trash
- "Delete" on any note moves it to Trash (soft delete).
- Trash page: each card has **Restore** and **Delete forever** (with `ConfirmDialog`).
- "Empty Trash" button at top (with confirmation).
- Trashed notes are read-only (no edit/pin/archive).

### Card actions per view

| View    | Actions                                  |
| ------- | ---------------------------------------- |
| Notes   | View, Edit, Pin/Unpin, Archive, Trash    |
| Archive | View, Edit, Unarchive, Trash             |
| Trash   | View, Restore, Delete forever            |

---

## 8. UI / Styling Guidelines (Tailwind)

- Layout: sidebar (`w-60`, hidden on mobile behind a hamburger toggle) + main content.
- Cards: `rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition`.
- Description preview: `line-clamp-4`.
- Tag chips: `rounded-full bg-indigo-100 text-indigo-700 px-2 py-0.5 text-xs`.
- Active nav link: use `NavLink` with conditional classes.
- Empty states per page (e.g. "No archived notes", "Trash is empty").
- Optional: dark mode with Tailwind `dark:` variants.
- Accessibility: buttons have `aria-label`, modal uses `role="dialog"` and traps focus/`Esc` closes.

---

## 9. localStorage Utilities (`utils/storage.js`)

```js
const KEY = "notes-app:notes";

export function loadNotes() {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
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
```

---

## 10. Development Phases

| Phase | Tasks | Outcome |
| ----- | ----- | ------- |
| **1. Setup** | Vite project, Tailwind, Router, folder structure | App runs with empty layout |
| **2. Data layer** | Reducer, context, storage utils, persistence | Notes survive refresh |
| **3. Create & list** | `NoteForm`, `NoteCard`, `NoteGrid`, `NotesPage` | Can add and see notes |
| **4. View & edit** | `NoteModal`, edit flow | Full CRUD on active notes |
| **5. Tags & search** | `TagInput`, `TagFilter`, `SearchBar`, `filterNotes` | Search + tag filtering work |
| **6. Pin & archive** | Pin toggle, sorting, `ArchivePage` | Organization features done |
| **7. Trash** | Soft delete, `TrashPage`, restore, permanent delete, empty trash, `ConfirmDialog` | Full lifecycle |
| **8. Polish** | Responsive sidebar, empty states, keyboard support, dark mode (optional) | Production-quality UI |
| **9. Testing & deploy** | Manual test checklist, `npm run build`, deploy to Vercel/Netlify | Live app |

---

## 11. Testing Checklist

- [ ] Create a note with title, description, and tags.
- [ ] Empty title is rejected.
- [ ] Notes persist after page refresh.
- [ ] Clicking a card opens the detail modal; `Esc` closes it.
- [ ] Editing updates the note and its `updatedAt`.
- [ ] Search matches title and description (case-insensitive).
- [ ] Tag filter shows only notes with that tag; "All" clears it.
- [ ] Search + tag filter work together.
- [ ] Pinned notes appear at the top in a "Pinned" section.
- [ ] Archiving removes a note from Notes and shows it in Archive; unarchive reverses it.
- [ ] Deleting moves the note to Trash (not removed).
- [ ] Restore returns the note to its original view.
- [ ] "Delete forever" and "Empty Trash" ask for confirmation and remove notes from storage.
- [ ] Layout works on mobile, tablet, and desktop widths.
- [ ] Corrupted localStorage data doesn't crash the app.

---

## 12. Optional Enhancements

- Note colors (choose a background color per note).
- Auto-delete trashed notes after 30 days using `trashedAt`.
- Sort options (newest, oldest, A–Z).
- Markdown support in descriptions.
- Export / import notes as JSON.
- Undo toast after moving a note to trash.
