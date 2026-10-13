
# Jotboard

Jotboard is a lightweight, browser-based note-taking application designed for simplicity, flexibility, and efficient note management. Inspired by Google Keep, it provides a clean interface with advanced formatting, Markdown support, customizable note layouts, and local data storage.

The application is built with HTML, CSS, and JavaScript, without requiring a frontend framework or external runtime dependencies.

## Features

### Note Management
- Create, edit, duplicate, pin, archive, and delete notes.
- Organize notes using labels and custom sorting.
- Adjust individual note widths.
- Rearrange notes using drag-and-drop.
- Switch between grid and list views.
- Search notes by title, content, or labels.
- Restore deleted notes from the trash.

### Text Editing
- Rich-text editor with headings and text formatting.
- Multiple font families.
- Custom text colors and highlighting.
- Bulleted lists, numbered lists, and checklists.
- Tables, hyperlinks, and blockquotes.
- Adjustable editor widths.
- Automatic saving while editing.

### Markdown Support
- Import Markdown (`.md`, `.markdown`) and text files.
- Edit Markdown source directly.
- Preview rendered Markdown.
- Convert Markdown into visually formatted notes.
- Support for common GitHub-flavored Markdown (GFM) syntax.
- Export individual notes as Markdown files.

### Customization
- Dark and light themes.
- Custom background colors for individual notes.
- Custom background images.
- Optional workspace wallpaper.
- Responsive interface for desktop and mobile devices.

### Data Management
- Automatic local storage using IndexedDB.
- Export all notes and settings as a JSON backup.
- Restore notes from a previously exported JSON file.
- Preserve supported formatting, labels, backgrounds, and note metadata in backups.
- No account registration required.

## Getting Started

### Prerequisites

- A modern web browser such as Google Chrome, Microsoft Edge, or Firefox.
- Node.js 18 or later (recommended for local development).

Download Node.js from [nodejs.org](https://nodejs.org/).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/jotboard.git
   ```

2. Navigate to the project directory:

   ```bash
   cd jotboard
   ```

3. Start the local development server:

   ```bash
   npm start
   ```

4. Open the application in your browser:

   ```
   http://127.0.0.1:4173
   ```

No additional package installation is required.

### Alternative: Windows

Windows users can launch the application by running:

```
START-WINDOWS.bat
```

The launcher uses Node.js when available or Python 3 as a fallback.

## Project Structure

```text
jotboard/
├── index.html
├── styles.css
├── app.js
├── package.json
├── server.cjs
├── START-WINDOWS.bat
├── vendor/
│   ├── marked.js
│   └── MARKED-LICENSE.txt
├── .gitignore
└── README.md
```

| File | Description |
|------|-------------|
| `index.html` | Application structure and interface |
| `styles.css` | Layout, styling, and responsive design |
| `app.js` | Application logic and note management |
| `package.json` | Project configuration and scripts |
| `server.cjs` | Local development server |
| `START-WINDOWS.bat` | Windows launcher |
| `vendor/` | Bundled Markdown parser and license |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `N` | Create a new note |
| `Ctrl + K` | Focus search |
| `Ctrl + S` | Save the current note or export a backup |
| `Esc` | Close the active editor or dialog |

On macOS, use `Cmd` instead of `Ctrl` where applicable.

## Data Storage and Privacy

Jotboard follows a local-first approach.

Notes and application settings are stored in the browser using IndexedDB. The application does not require a user account or a remote database.

**Important considerations:**

- Notes are stored separately for each browser and website origin.
- Data is not automatically synchronized across devices.
- Clearing browser storage may permanently remove saved notes.
- Private or incognito browsing is not recommended for persistent storage.
- Users should regularly export JSON backups to protect their data.

The application includes a local-storage information notice and a JSON backup download feature.

## Import and Export

### Markdown Import

Users can import supported Markdown files through the application interface. Imported files are converted into notes while retaining their Markdown source.

### Markdown Export

Individual notes can be exported as `.md` files.

Some visual formatting, including custom fonts, text colors, and backgrounds, cannot be represented in standard Markdown.

### JSON Backup

The JSON backup feature exports saved notes and application settings, including supported rich-text formatting and note backgrounds.

Backups can be restored through the Settings interface.

**Warning:** Restoring a JSON backup replaces existing notes in the current browser. Export the current data before restoring another backup.

## Deployment

Jotboard can be deployed using static website hosting services, including:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

For static deployment, upload the application files and configure the hosting service to serve `index.html` as the entry point.

No production Node.js server or build process is required for the current application.

Ensure that all referenced assets, including the `vendor` directory, are included in the deployment.

## Limitations

- No cloud synchronization or multi-device account system.
- No real-time collaboration.
- Local data may be lost if browser storage is cleared.
- Advanced Markdown extensions are not fully supported.
- Some rich-text formatting may not survive Markdown conversion.
- Large embedded images may exceed browser storage limits.
- Complex rich-text editing behavior may vary between browsers.

Jotboard is intended as a lightweight, local-first note-taking application rather than a full collaborative document platform.

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- IndexedDB
- Marked (Markdown parser)
- Node.js (local development server)

## Third-Party Licenses

Jotboard includes the open-source Marked library for Markdown rendering.

Marked is distributed under the MIT License.

The corresponding license information is available in:

`vendor/MARKED-LICENSE.txt`

## Contributing

Contributions, bug reports, and suggestions are welcome.

To contribute:

1. Fork the repository.
2. Create a branch for your changes.
3. Implement and test your modifications.
4. Submit a pull request describing your changes.

## Project Status

Jotboard is under active development. The project focuses on providing a minimal, customizable, and reliable note-taking experience.
