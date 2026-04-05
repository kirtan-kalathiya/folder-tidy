const fs = require('fs');
const path = require('path');
const { APP_FOLDER, INTERNAL_FILES, VERSION } = require('../constants');
const { ensureDirectory, getSafeDestination } = require('./filesystem');
const { saveManifest } = require('./manifest');
const { writeReport } = require('./report');
const { buildDestinationFolder, getManagedFolders } = require('./rules');
const { ensureRelative } = require('../utils/paths');
const { isHidden, matchesPattern } = require('../utils/patterns');

function createStats() {
  return {
    scanned: 0,
    moved: 0,
    skipped: 0,
    errors: 0,
    categories: {},
    moves: [],
  };
}

function collectFiles(rootDir, options, stats) {
  const files = [];
  const destinationFolders = getManagedFolders();
  destinationFolders.add(APP_FOLDER);

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name);
      const relativePath = path.relative(rootDir, absolutePath) || entry.name;

      if (!options.includeHidden && isHidden(entry.name)) {
        if (options.verbose) console.log(`skip hidden: ${relativePath}`);
        stats.skipped += 1;
        continue;
      }

      if (matchesPattern(entry.name, options.excludePatterns) || matchesPattern(relativePath, options.excludePatterns)) {
        if (options.verbose) console.log(`skip excluded: ${relativePath}`);
        stats.skipped += 1;
        continue;
      }

      if (entry.isDirectory()) {
        if (destinationFolders.has(entry.name)) {
          if (options.verbose) console.log(`skip managed folder: ${relativePath}`);
          stats.skipped += 1;
          continue;
        }

        if (options.recursive) {
          walk(absolutePath);
        } else if (options.verbose) {
          console.log(`skip subfolder: ${relativePath}`);
        }
        continue;
      }

      files.push({ absolutePath, relativePath, name: entry.name });
    }
  }

  walk(rootDir);
  return files;
}

function tidyDirectory(targetDir, options) {
  const stats = createStats();
  const files = collectFiles(targetDir, options, stats);

  console.log(`folder-tidy ${VERSION}`);
  console.log(`command: tidy`);
  console.log(`target: ${targetDir}`);
  console.log(`mode: ${options.mode}${options.dryRun ? ' (dry run)' : ''}`);
  console.log(`recursive: ${options.recursive ? 'yes' : 'no'}`);
  console.log('');

  for (const file of files) {
    stats.scanned += 1;

    if (targetDir === process.cwd() && INTERNAL_FILES.has(file.name)) {
      if (options.verbose) console.log(`skip project file: ${file.name}`);
      stats.skipped += 1;
      continue;
    }

    let fileStats;
    try {
      fileStats = fs.statSync(file.absolutePath);
    } catch (error) {
      console.error(`failed to read file stats: ${file.relativePath}`);
      stats.errors += 1;
      continue;
    }

    const folderName = buildDestinationFolder(file.name, fileStats, options.mode);
    const destinationDir = path.join(targetDir, folderName);

    if (path.dirname(file.absolutePath) === destinationDir) {
      if (options.verbose) console.log(`skip already organized: ${file.relativePath}`);
      stats.skipped += 1;
      continue;
    }

    const destinationPath = getSafeDestination(destinationDir, file.name);
    const relativeDestination = ensureRelative(targetDir, destinationPath);

    try {
      ensureDirectory(destinationDir, options.dryRun);

      if (!options.dryRun) {
        fs.renameSync(file.absolutePath, destinationPath);
      }

      console.log(`${options.dryRun ? 'plan' : 'move'}: ${file.relativePath} -> ${relativeDestination}`);
      stats.moved += 1;
      stats.categories[folderName] = (stats.categories[folderName] || 0) + 1;
      stats.moves.push({
        from: file.relativePath,
        to: relativeDestination,
      });
    } catch (error) {
      console.error(`failed: ${file.relativePath} -> ${relativeDestination}`);
      if (options.verbose) console.error(error.message);
      stats.errors += 1;
    }
  }

  let manifestPath = null;
  if (!options.dryRun && !options.noManifest && stats.moves.length > 0) {
    manifestPath = saveManifest(targetDir, {
      version: VERSION,
      command: 'tidy',
      target: targetDir,
      mode: options.mode,
      recursive: options.recursive,
      includeHidden: options.includeHidden,
      excludePatterns: options.excludePatterns,
      createdAt: new Date().toISOString(),
      moves: stats.moves,
    });
  }

  let reportPath = null;
  if (options.reportPath) {
    reportPath = writeReport(options.reportPath, {
      version: VERSION,
      command: 'tidy',
      target: targetDir,
      options: {
        mode: options.mode,
        dryRun: options.dryRun,
        recursive: options.recursive,
        includeHidden: options.includeHidden,
        excludePatterns: options.excludePatterns,
      },
      stats,
      manifestPath,
      createdAt: new Date().toISOString(),
    });
  }

  return {
    stats,
    manifestPath,
    reportPath,
  };
}

module.exports = {
  tidyDirectory,
};
