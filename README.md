# Notes App

A notes management app built with **React**, **TailwindCSS**, **React Router DOM**, and **localStorage**. Create, organize, and manage notes with tags, search, pinning, archiving, and a recoverable trash.

## Features

- **Create, view, edit, delete** — notes have a title (required), a description, and tags. Click a card to open it in a modal.
- **Card layout** — responsive grid (1–4 columns depending on screen width).
- **Search** — finds notes by title or description (case-insensitive).
- **Tags** — add tags while writing a note (press Enter or comma). Filter by clicking tags in the sidebar or on any card; select several to show only notes that have all of them. Search and tag filters can be combined.
- **Manage tags** — the settings icon next to "Tags" in the sidebar opens a dialog to rename or delete a tag across every note. Renaming onto an existing tag merges the two; deleting a tag keeps the notes.
- **Pin** — pinned notes stay at the top under a "Pinned" heading.
- **Archive** — move notes out of the main list without deleting them; unarchive at any time.
- **Trash** — deleted notes go to the trash first. From there you can restore them (they return to Notes or Archive, wherever they were) or delete them forever. "Empty Trash" clears everything at once. Permanent deletes ask for confirmation.
- **Persistence** — all notes are saved in the browser's `localStorage` and survive page reloads.
- **Shareable filters** — the search text and selected tags are stored in the URL (`?q=...&tag=a&tag=b`), so they survive a refresh and carry across pages.
- **Accessibility** — modals close with `Esc` or a click outside and keep keyboard focus inside while open; icon buttons have labels.
- **Responsive** — on small screens the sidebar becomes a slide-out menu.

## Tech Stack

| Concern     | Choice                                  |
| ----------- | --------------------------------------- |
| UI          | React 19 (function components, hooks)   |
| Build tool  | Vite                                    |
| Styling     | TailwindCSS v4 (`@tailwindcss/vite`)    |
| Routing     | React Router DOM                        |
| State       | Context API + `useReducer`              |
| Persistence | `localStorage`                          |
| Icons       | lucide-react                            |

## Getting Started

Requires **Node.js 20.19+** (or 22.12+).

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

| Script            | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server with hot reload |
| `npm run build`   | Production build into `dist/`        |
| `npm run preview` | Serve the production build locally   |

## Pages

| Route      | Shows                                  | Card actions                          |
| ---------- | -------------------------------------- | ------------------------------------- |
| `/`        | Active notes (pinned first)            | View, Edit, Pin/Unpin, Archive, Trash |
| `/archive` | Archived notes                         | View, Edit, Unarchive, Trash          |
| `/trash`   | Deleted notes, plus an "Empty Trash" button | View, Restore, Delete forever    |

## Project Structure

```
src/
├── main.jsx                    # Root render: BrowserRouter + NotesProvider
├── App.jsx                     # Routes
├── index.css                   # Tailwind import
├── context/NotesContext.jsx    # Notes state, actions, persistence, tag list
├── reducer/notesReducer.js     # Pure reducer for all note actions
├── hooks/
│   ├── useNotes.js             # Access the notes context
│   └── useFilters.js           # Read/write ?q= and ?tag= (repeatable) in the URL
├── utils/
│   ├── storage.js              # Load/save notes in localStorage (safe against bad data)
│   ├── filterNotes.js          # View, search and tag filtering + sorting
│   ├── tags.js                 # Tag normalization
│   └── formatDate.js
├── components/
│   ├── Layout/                 # Layout, Navbar, Sidebar
│   ├── Notes/                  # NoteCard, NoteGrid, NoteForm, NoteModal, NoteActions, NotesView
│   ├── Tags/                   # TagInput, TagFilter, TagChip, ManageTags
│   └── UI/                     # Modal, ConfirmDialog, SearchBar, EmptyState
└── pages/                      # NotesPage, ArchivePage, TrashPage, NotFound
```

## Data Model

Notes are stored as a JSON array under the `localStorage` key `notes-app:notes`:

```js
{
  id: "uuid",
  title: "Shopping list",
  description: "Milk, eggs, bread",
  tags: ["personal", "errands"],   // trimmed, lowercased, no leading "#", unique
  isPinned: false,
  isArchived: false,
  isTrashed: false,
  createdAt: "2026-11-10T10:00:00.000Z",
  updatedAt: "2026-11-10T10:00:00.000Z",
  trashedAt: null                  // set when moved to trash
}
```

- A note is in **Notes** when it is neither archived nor trashed, in **Archive** when archived but not trashed, and in **Trash** when trashed.
- Archiving or trashing a note unpins it. Only notes in the main list can be pinned.
- Restoring from trash keeps the archived flag, so a note returns to wherever it was.

To reset the app, clear the `notes-app:notes` key in your browser's DevTools (Application → Local Storage).

See [plan.md](plan.md) for the full implementation plan.
