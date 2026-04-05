# folder-tidy

`folder-tidy` is a proper Node.js CLI project for cleaning messy folders safely.

It now has:

- a cleaner project structure
- modular source files
- multiple organize modes
- manifest history
- undo support

## Project Structure

```text
folder-tidy/
├─ index.js
├─ package.json
└─ src/
   ├─ cli.js
   ├─ commands/
   ├─ core/
   └─ utils/
```

## Features

- `tidy` command for organizing files
- `undo` command for restoring the last run or a specific manifest
- organize by `type`, `name`, or `date`
- dry-run preview mode
- recursive scanning
- exclusion patterns
- hidden file support
- JSON report export
- automatic collision-safe renaming
- manifest storage in `.folder-tidy/`

## Installation

```bash
npm install -g folder-tidy
```

## Commands

### Organize files

```bash
folder-tidy tidy
folder-tidy tidy --target ./Downloads
folder-tidy tidy --mode name --dry-run
folder-tidy tidy --mode date --recursive
folder-tidy tidy --report reports/latest.json
```

You can still use the short default style too:

```bash
folder-tidy --dry-run
```

### Undo the last run

```bash
folder-tidy undo
folder-tidy undo --target ./Downloads
folder-tidy undo --manifest .folder-tidy/manifest-123.json
folder-tidy undo --dry-run
```

## CLI Options For `tidy`

```text
--target <path>          Organize a specific directory
--mode <type|name|date>  Choose how files are grouped
--dry-run                Preview changes without moving files
--recursive              Scan subfolders recursively
--exclude <patterns>     Exclude files or folders, comma-separated globs
--include-hidden         Include hidden files
--report <file>          Save a JSON report
--no-manifest            Skip saving an undo manifest
--verbose                Show detailed logs
```

## CLI Options For `undo`

```text
--target <path>          Target directory that contains .folder-tidy manifests
--manifest <file>        Restore a specific manifest file
--dry-run                Preview restore actions without moving files
--verbose                Show detailed logs
```

## Testing Locally

```bash
node index.js --help
node index.js tidy --dry-run
node index.js undo --help
```

## Version

Current release: `1.0.0`
