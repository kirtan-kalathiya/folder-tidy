const fs = require('fs');
const path = require('path');
const { VERSION } = require('../constants');
const { ensureDirectory, getSafeDestination } = require('../core/filesystem');
const { getLatestManifest, readManifest } = require('../core/manifest');
const { normalizePath } = require('../utils/paths');

function printUndoHelp() {
  console.log(`
folder-tidy ${VERSION}

Usage:
  folder-tidy undo
  folder-tidy undo --target <path>
  folder-tidy undo --manifest <file>

Options:
  --target <path>      Target directory that contains .folder-tidy manifests
  --manifest <file>    Restore a specific manifest file
  --dry-run            Preview restore actions without moving anything
  --verbose            Show detailed logs
  --help, -h           Show undo help
`);
}

function parseUndoOptions(argv) {
  const options = {
    targetDir: process.cwd(),
    manifestPath: null,
    dryRun: false,
    verbose: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      printUndoHelp();
      process.exit(0);
    }

    if (arg === '--target' && argv[i + 1]) {
      options.targetDir = argv[i + 1];
      i += 1;
      continue;
    }

    if (arg === '--manifest' && argv[i + 1]) {
      options.manifestPath = argv[i + 1];
      i += 1;
      continue;
    }

    if (arg === '--dry-run') options.dryRun = true;
    if (arg === '--verbose' || arg === '-v') options.verbose = true;
  }

  return options;
}

function runUndo(argv) {
  const options = parseUndoOptions(argv);
  const targetDir = normalizePath(options.targetDir);
  const manifestPath = options.manifestPath
    ? normalizePath(options.manifestPath)
    : getLatestManifest(targetDir);

  if (!manifestPath || !fs.existsSync(manifestPath)) {
    console.error('No manifest found to undo.');
    process.exit(1);
  }

  const manifest = readManifest(manifestPath);
  const moves = Array.isArray(manifest.moves) ? [...manifest.moves].reverse() : [];

  console.log(`folder-tidy ${VERSION}`);
  console.log(`command: undo`);
  console.log(`manifest: ${manifestPath}`);
  console.log(`target: ${targetDir}${options.dryRun ? ' (dry run)' : ''}`);
  console.log('');

  let restored = 0;
  let skipped = 0;
  let errors = 0;

  for (const move of moves) {
    const currentPath = path.join(targetDir, move.to);
    const restoreDir = path.dirname(path.join(targetDir, move.from));
    const restorePath = getSafeDestination(restoreDir, path.basename(move.from));

    if (!fs.existsSync(currentPath)) {
      if (options.verbose) console.log(`skip missing: ${move.to}`);
      skipped += 1;
      continue;
    }

    try {
      ensureDirectory(restoreDir, options.dryRun);

      if (!options.dryRun) {
        fs.renameSync(currentPath, restorePath);
      }

      console.log(`${options.dryRun ? 'plan' : 'restore'}: ${move.to} -> ${path.relative(targetDir, restorePath)}`);
      restored += 1;
    } catch (error) {
      console.error(`failed: ${move.to}`);
      if (options.verbose) console.error(error.message);
      errors += 1;
    }
  }

  console.log('');
  console.log('Summary');
  console.log(`restored: ${restored}`);
  console.log(`skipped: ${skipped}`);
  console.log(`errors: ${errors}`);
}

module.exports = {
  printUndoHelp,
  runUndo,
};
