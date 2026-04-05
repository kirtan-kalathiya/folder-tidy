const fs = require('fs');
const path = require('path');
const { VERSION } = require('../constants');
const { ensureDirectory, getSafeDestination, moveFileSync } = require('../core/filesystem');
const { getLatestManifest, readManifest } = require('../core/manifest');
const { normalizePath, resolvePathInsideBase } = require('../utils/paths');
const colors = require('../utils/colors');

function printUndoHelp() {
  console.log(`
${colors.header('📂 Folder Tidy - Undo Command')} ${VERSION}

${colors.header('Usage:')}
${colors.arrow('folder-tidy undo')}
${colors.arrow('folder-tidy undo --target <path>')}
${colors.arrow('folder-tidy undo --manifest <file>')}

${colors.header('Options:')}
${colors.bullet('--target <path>')}      Target directory that contains .folder-tidy manifests
${colors.bullet('--manifest <file>')}    Restore a specific manifest file
${colors.bullet('--dry-run')}            Preview restore actions without moving anything
${colors.bullet('--verbose')}            Show detailed logs
${colors.bullet('--help, -h')}           Show undo help
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
      return { help: true };
    }

    if (arg === '--target' && argv[i + 1]) {
      options.targetDir = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--target') throw new Error('Missing value for --target');

    if (arg === '--manifest' && argv[i + 1]) {
      options.manifestPath = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--manifest') throw new Error('Missing value for --manifest');

    if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--verbose' || arg === '-v') options.verbose = true;
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

function validateManifestMove(targetDir, move) {
  if (!move || typeof move.from !== 'string' || typeof move.to !== 'string') {
    throw new Error('Manifest contains an invalid move entry.');
  }

  return {
    fromPath: resolvePathInsideBase(targetDir, move.from),
    toPath: resolvePathInsideBase(targetDir, move.to),
  };
}

function runUndo(argv) {
  const options = parseUndoOptions(argv);
  if (options.help) return;
  const targetDir = normalizePath(options.targetDir);
  const manifestPath = options.manifestPath
    ? normalizePath(options.manifestPath)
    : getLatestManifest(targetDir);

  if (!manifestPath || !fs.existsSync(manifestPath)) {
    throw new Error('No manifest found to undo.');
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
    let paths;
    try {
      paths = validateManifestMove(targetDir, move);
    } catch (error) {
      console.error(colors.error(error.message));
      errors += 1;
      continue;
    }

    const currentPath = paths.toPath;
    const restoreDir = path.dirname(paths.fromPath);
    const restorePath = getSafeDestination(restoreDir, path.basename(paths.fromPath));

    if (!fs.existsSync(currentPath)) {
      if (options.verbose) console.log(colors.muted(`skip missing: ${move.to}`));
      skipped += 1;
      continue;
    }

    try {
      ensureDirectory(restoreDir, options.dryRun);

      if (!options.dryRun) {
        moveFileSync(currentPath, restorePath);
      }

      console.log(`${options.dryRun ? colors.warning('plan') : colors.success('restore')}: ${move.to} -> ${path.relative(targetDir, restorePath)}`);
      restored += 1;
    } catch (error) {
      console.error(colors.error(`failed: ${move.to}`));
      if (options.verbose) console.error(colors.muted(error.message));
      errors += 1;
    }
  }

  console.log('');
  console.log(colors.header('📊 Summary'));
  console.log(`${colors.success('Restored:')} ${restored} files`);
  console.log(`${colors.muted('Skipped:')} ${skipped} files`);
  if (errors > 0) {
    console.log(`${colors.error('Errors:')} ${errors}`);
  }

  if (restored > 0 && !options.dryRun) {
    console.log('');
    console.log(colors.success('✨ Undo complete!'));
  }
}

module.exports = {
  printUndoHelp,
  runUndo,
};
