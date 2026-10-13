# Jotboard — Minimal UI (v2)

A **working, local-first note website** inspired by the simplicity of Google Keep, with editable card widths, a balanced dense-grid layout, Markdown import and preview, rich-text coloring, proper tables, custom note backgrounds and an optional workspace wallpaper.

## Run it on Windows

1. **Extract the whole ZIP.** Don't run it from inside the compressed archive.
2. **Double-click `START-WINDOWS.bat`.** It uses Node.js if available, or Python 3 as a fallback.
3. Go to **http://127.0.0.1:4173** if the browser doesn't open automatically.

If Node.js is not installed, download it from https://nodejs.org/ (LTS), then double-click the `.bat` again. No `npm install` is needed, and there are **no external runtime dependencies**.

You can also run `node server.cjs` (or `npm start`) inside the extracted directory. On macOS/Linux, install Node.js 18+ and run `node server.cjs`.

**Before updating from v1:** Export a JSON backup from Appearance & backup / Settings. Close the old server in VS Code with Ctrl+C, then run v2. Existing notes are preserved when you keep the same browser and address.

**Important:** Keep using the same local address (`http://127.0.0.1:4173`) and the same browser profile. Notes are stored by *browser origin*. Changing the address or using a different browser shows a different local database.

## What changed in v2

- Removed the promotional home-page heading, description, and large empty-state copy.
- Search and the icon-only Markdown importer are now in the top bar, with notes directly underneath.
- The note window has square corners, tighter spacing and a smaller title field.
- Replaced the glitch-prone editor width slider with Narrow / Medium / Wide presets.
- Removed the editor's Card Width field and the card's quick-cycling button. Card width is now selected only from the saved card's `...` menu.
- Existing notes, colors, width settings, and backups remain compatible; the IndexedDB name is unchanged. New installations start with an empty board.

## Working features

- **Adjust every card's width:** Open a saved note card's `...` menu and choose Compact, Medium, Wide or Full width. Drag cards to reorder them. A dense grid packs cards into unused gaps.
- **Cards with tidy previews:** Long notes are previewed at a limited height instead of stretching the entire board. Open any card for the complete content.
- **Visual rich editor:** H1/H2/H3, bold, italic, underline, strikethrough, ordered/bulleted lists, blockquotes, clickable links, text color and highlights, editable tables, and checklists. The editor has three fixed width presets (Narrow, Medium, Wide), accessible at the top of the editor.
- **Markdown:** Import one or more `.md`/`.markdown` files. Markdown notes retain their original source and render headings, tables, links, code blocks, lists, checkboxes, bold/italic, blockquotes and other GFM features with the included open-source Marked parser. Edit the Markdown source or convert it to a visual note.
- **Better tables:** Import Markdown tables or paste tab-separated spreadsheet data into the visual editor to create HTML tables. Tables preserve aligned columns and scroll horizontally as needed.
- **Customization:** Per-note dark color palettes, per-note background images, optional workspace image wallpaper, dark/light modes, and tags.
- **Finding & organizing:** Search contents/title/tags, pin, tag filters, archive, trash/restore, manual order (drag-and-drop), recent/oldest/alphabetical sorting, grid/list view.
- **Files:** Individual `.md` export, full JSON backup/restore including rich content, colors, uploaded image backgrounds, and timestamps.
- **Local autosave:** Notes save in IndexedDB, with no account or server-side storage. The Node server merely serves static files on your own PC.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `N` (outside inputs) | New note |
| `Ctrl+K` / `Cmd+K` | Search |
| `Ctrl+S` / `Cmd+S` | Save (or export backup outside editor) |
| `Esc` | Close editor/settings |

## Limitations and data safety

- This version is **local-only**. It does not sync to Google Keep or across devices, support multiple users or collaborate, or connect to Google accounts.
- The note data is stored in your browser's IndexedDB for `127.0.0.1:4173`. **Clear browser/site data = lose your notes.** Export JSON backups regularly. Incognito/private mode is not reliable for persistent storage.
- Markdown supports common **GitHub-flavored Markdown** features via an included version of Marked. Markdown isn't a single universal standard, and platform-specific extensions (Mermaid rendering, LaTeX equations, embedded custom HTML/JS, every plugin dialect) are **not** fully implemented. Unsafe raw HTML is sanitized to protect your notes.
- Text-specific colors, arbitrary embedded HTML styles and exact rich-editor formatting cannot all be represented by standard Markdown. **JSON backups preserve formatting** more faithfully than exported `.md` files.
- Pasted external images in rich notes and image backgrounds consume browser storage; very large files can exceed the browser quota. Uploaded backgrounds are scaled and converted to JPEG (animated GIFs become still frames).
- Rich text uses browser `contenteditable` and standard editing commands; editing behavior for some complex tables may vary by browser. Test with Chrome or Edge.
- This is a self-contained MVP, not a security-audited, multi-user production service.

## Structure

- `index.html` — application markup
- `styles.css` — responsive design and themes
- `app.js` — note editing, Markdown handling, local storage and import/export
- `vendor/marked.js` — Markdown parsing library (MIT licensed)
- `server.cjs` — minimal, dependency-free local Node web server
- `START-WINDOWS.bat` — one-click Windows launcher

## Dependencies / license

The `vendor/marked.js` file is a locally bundled copy of **Marked** from the Jupyter nbclassic distribution, copyright (c) 2011–2022 Christopher Jeffrey and contributors, MIT licensed. See `vendor/MARKED-LICENSE.txt`. Jotboard's new code is provided for experimentation and personal use.
