# 📂 folder-tidy

> A powerful, interactive CLI tool for automatically organizing your messy folders with undo support, progress bars, and watch mode.

`folder-tidy` is a production-ready Node.js CLI project for cleaning messy folders safely and intelligently.

## ✨ What's New in v2.0.0

- 🎨 **Colored Output** - Beautiful, color-coded messages for better visibility
- 🖱️ **Interactive Mode** - No need to remember commands, just run `folder-tidy`
- 👀 **Watch Mode** - Auto-organize new files as they arrive
- ⚙️ **Config System** - Create personalized organization rules
- 📊 **Progress Bars** - Real-time progress feedback
- 🎯 **Multiple Modes** - Organize by type, name, date, or custom patterns

## Key Features

- ✅ Organize by file type, name pattern, or date
- ✅ Undo any operation with full restoration
- ✅ Dry-run preview without moving files
- ✅ Recursive folder scanning
- ✅ File exclusion patterns
- ✅ Hidden file support
- ✅ JSON report export
- ✅ Safe collision handling (automatic renaming)
- ✅ Manifest history storage
- ✅ Watch mode for continuous organization

## Installation

```bash
npm install -g folder-tidy
```

Or use with npx:

```bash
npx folder-tidy
```

## 📖 Documentation

**New to folder-tidy?** Read these guides:

- 🎓 **[Beginner Guide](BEGINNER-GUIDE.md)** - Super simple, step-by-step
- 📞 **[Quick Start](QUICK-START.md)** - Common commands and examples  
- 📝 **[Commands Reference](COMMANDS.md)** - All easy commands at a glance

## Quick Start

### Interactive Mode (Recommended)

Simply run:

```bash
folder-tidy
```

Then select your desired action from the menu:
- 🧹 Organize current folder
- 🔍 Dry run (preview changes)
- ↩️ Undo last operation
- 👀 Watch mode (auto-organize)
- ⚙️ Create/Edit config
- ❌ Exit

### Command Mode

```bash
# Organize current folder
folder-tidy tidy

# Organize a specific folder
folder-tidy tidy --target ~/Downloads

# Preview changes without moving
folder-tidy tidy --dry-run

# Organize by name pattern
folder-tidy tidy --mode name

# Watch for new files
folder-tidy watch --target ~/Downloads

# Undo last operation
folder-tidy undo

# Create config file
folder-tidy config
```

## Commands

### `tidy` - Organize Files

```bash
folder-tidy tidy [options]
```

**Examples:**

```bash
# Organize current directory by file type
folder-tidy tidy

# Organize Downloads folder
folder-tidy tidy --target ~/Downloads

# Preview what would happen
folder-tidy tidy --dry-run

# Organize recursively (including subfolders)
folder-tidy tidy --recursive

# Organize by modified date
folder-tidy tidy --mode date

# Exclude certain patterns
folder-tidy tidy --exclude "*.tmp,node_modules"

# Export a detailed report
folder-tidy tidy --report report.json

# Show detailed logs
folder-tidy tidy --verbose
```

**Options:**

```
--target <path>          Organize a specific directory (default: current directory)
--mode <type|name|date>  How to group files: type, name pattern, or date (default: type)
--dry-run                Preview changes without moving files
--recursive              Include files in subfolders
--exclude <patterns>     Comma-separated glob patterns to exclude
--include-hidden         Include hidden files (starting with .)
--report <file>          Save JSON report of the operation
--no-manifest            Skip saving undo manifest
--verbose, -v            Show detailed logs for debugging
--help, -h               Show help message
```

### `undo` - Restore Previous Operation

```bash
folder-tidy undo [options]
```

**Examples:**

```bash
# Undo last operation in current directory
folder-tidy undo

# Undo in a specific directory
folder-tidy undo --target ~/Downloads

# Restore a specific manifest
folder-tidy undo --manifest .folder-tidy/manifest-123456.json

# Preview undo before applying
folder-tidy undo --dry-run
```

**Options:**

```
--target <path>          Directory containing manifests to undo (default: current)
--manifest <file>        Restore a specific manifest file
--dry-run                Preview restore without moving files
--verbose, -v            Show detailed logs
--help, -h               Show help message
```

### `watch` - Auto-Organize

```bash
folder-tidy watch [options]
```

Monitors a folder for new files and automatically organizes them according to your rules.

**Examples:**

```bash
# Watch current folder
folder-tidy watch

# Watch Downloads folder
folder-tidy watch --target ~/Downloads

# Watch with verbose output
folder-tidy watch --target ~/Downloads --verbose
```

### `config` - Manage Configuration

```bash
folder-tidy config [options]
```

Create and edit a `.folder-tidy-config.json` file to customize organization rules.

**Examples:**

```bash
# Create config for current folder
folder-tidy config

# Create config for specific folder
folder-tidy config --target ~/Downloads
```

**Config Example:**

```json
{
  "version": "2.0.0",
  "mode": "type",
  "recursive": false,
  "includeHidden": false,
  "excludePatterns": [],
  "autoUndo": true,
  "dryRunByDefault": false
}
```

## Organization Modes

### Type (Default)

Organizes files into folders based on their extension:

```
Downloaded Files/
├── Images/          (jpg, png, gif, svg, webp, etc.)
├── Documents/       (pdf, doc, docx, txt, xlsx, etc.)
├── Videos/          (mp4, mkv, avi, mov, wmv, etc.)
├── Audio/           (mp3, wav, flac, aac, ogg, etc.)
├── Archives/        (zip, rar, 7z, tar, gz, etc.)
├── Code/            (js, ts, py, html, css, etc.)
├── Installers/      (exe, msi, apk, dmg, etc.)
├── Fonts/           (ttf, otf, woff, etc.)
├── Design/          (fig, sketch, xd, psd, ai, etc.)
├── Data/            (db, sqlite, parquet, log, etc.)
└── Others/          (unknown extensions)
```

### Name

Organizes based on filename patterns:

```
Organized/
├── Screenshots/     (files matching screenshot* pattern)
├── Exports/         (files matching export* pattern)
└── ...
```

### Date

Organizes by file modification date:

```
By Date/
├── 2024/
│   ├── January/
│   ├── February/
│   └── ...
└── 2023/
    ├── January/
    └── ...
```

## Safe Collision Handling

If a file with the same name already exists in the destination, folder-tidy automatically renames the new file:

```
photo.jpg          →  photo.jpg      (if space is available)
photo.jpg (new)    →  photo(1).jpg   (if photo.jpg exists)
photo.jpg (newer)  →  photo(2).jpg   (if photo(1).jpg exists)
```

## Project Structure

```text
folder-tidy/
├─ index.js                 # Entry point with shebang
├─ package.json             # Project metadata and dependencies
├─ README.md               # This file
├─ LICENSE                 # MIT License
└─ src/
   ├─ cli.js               # CLI command router
   ├─ constants.js         # Configuration constants
   ├─ commands/
   │  ├─ tidy.js          # Organize command
   │  └─ undo.js          # Restore command
   ├─ core/
   │  ├─ organizer.js     # Main organization logic
   │  ├─ manifest.js      # Undo history management
   │  ├─ filesystem.js    # Safe file operations
   │  ├─ report.js        # Report generation
   │  └─ rules.js         # Organization rules
   └─ utils/
      ├─ paths.js         # Path utilities
      ├─ patterns.js      # Pattern matching
      ├─ colors.js        # Colored output (NEW)
      ├─ interactive.js   # Interactive prompts (NEW)
      ├─ progress.js      # Progress bars (NEW)
      ├─ watch.js         # File watching (NEW)
      └─ config.js        # Configuration (NEW)
```

## Configuration

folder-tidy respects a `.folder-tidy-config.json` file in your target directory:

```json
{
  "version": "2.0.0",
  "mode": "type",
  "recursive": false,
  "includeHidden": false,
  "excludePatterns": ["**/*.tmp", "**/node_modules/**"],
  "autoUndo": true,
  "dryRunByDefault": false
}
```

## Examples

### Basic organization

```bash
# Organize Downloads
folder-tidy tidy --target ~/Downloads

# Preview first
folder-tidy tidy --target ~/Downloads --dry-run
```

### Advanced scenarios

```bash
# Organize Desktop recursively, excluding archives
folder-tidy tidy --target ~/Desktop --recursive --exclude "*.zip,*.rar"

# Export detailed report
folder-tidy tidy --target ~/Downloads --report ~/reports/tidy.json --verbose

# Include hidden files
folder-tidy tidy --include-hidden --verbose
```

### Watch mode for continuous organization

```bash
# Auto-organize Downloads as new files arrive
folder-tidy watch --target ~/Downloads

# Customize watchmode with progress feedback
folder-tidy watch --target ~/Downloads --verbose
```

## Dependencies

folder-tidy uses:

- **chalk** - Colored terminal output
- **inquirer** - Interactive CLI prompts
- **cli-progress** - Progress bars
- **chokidar** - File system watching

## Testing Locally

```bash
# Show help
node index.js --help

# Try dry-run
node index.js tidy --dry-run

# Try interactive mode
node index.js

# Test undo
node index.js undo --help
```

Or with npm scripts:

```bash
npm start              # Interactive mode
npm run help          # Show help
npm run test:smoke    # Run smoke tests
```

## 🎯 Easy Commands Summary

| What | Command |
|-----|---------|
| Interactive menu | `folder-tidy` |
| Organize | `folder-tidy organize` |
| Clean | `folder-tidy clean` |
| Preview | `folder-tidy preview` |
| Undo | `folder-tidy undo` |
| Restore | `folder-tidy restore` |
| Watch | `folder-tidy watch` |
| Config | `folder-tidy config` |
| Help | `folder-tidy --help` |

All command aliases make it super easy:
- `organize` = `clean` = `tidy` (all organize files)
- `undo` = `restore` (both restore files)
- `preview` (automatic dry-run)

**See [📝 Commands Reference](COMMANDS.md) for all easy commands!**

## 📋 npm Scripts (Local Use)

If you cloned this repo:

```bash
npm run organize       # Organize current folder
npm run clean         # Same as organize
npm run preview       # Preview changes (dry-run)
npm run undo          # Undo last operation
npm run watch         # Watch for new files
npm run config        # Create/edit config
npm run help          # Show help
npm start             # Interactive menu
```

## Changelog

### v2.0.0

- Added interactive mode with menu-driven interface
- Added colored output for better readability
- Added watch mode for continuous folder monitoring
- Added config system for customization
- Added progress bars to organizer
- Enhanced help menus with visual formatting
- Updated all commands with new features
- Changed package name from `@newhomepage/folder-tidy` to `folder-tidy`
- **Added command aliases** (`organize`, `clean`, `preview`, `restore`)
- Added npm convenience scripts
- Added comprehensive guides: Beginner, Quick Start, Commands Reference

### v1.0.7

- Initial stable release
- Core organization features
- Undo support
- Multiple organization modes

## License

MIT

## Author

Kirtan Kalathiya
```

## Version

Current release: `1.0.0`
