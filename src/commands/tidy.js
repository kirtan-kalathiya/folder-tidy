const fs = require('fs');
const { normalizePath } = require('../utils/paths');
const { tidyDirectory } = require('../core/organizer');

function printTidyHelp(version) {
  console.log(`
folder-tidy ${version}

Usage:
  folder-tidy tidy
  folder-tidy tidy --target <path>
  folder-tidy tidy --mode <type|name|date>

Options:
  --target <path>          Organize a specific directory
  --mode <mode>            Organize by file type, file name, or modified date
  --dry-run                Preview changes without moving anything
  --recursive              Scan subfolders recursively
  --exclude <patterns>     Exclude files or folders, comma-separated globs
  --include-hidden         Include hidden files
  --report <file>          Save a JSON report of the run
  --no-manifest            Skip saving an undo manifest
  --verbose                Show detailed skip and scan logs
  --help, -h               Show tidy help
`);
}

function parseTidyOptions(argv, version) {
  const options = {
    targetDir: process.cwd(),
    dryRun: false,
    verbose: false,
    recursive: false,
    includeHidden: false,
    noManifest: false,
    mode: 'type',
    excludePatterns: [],
    reportPath: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      printTidyHelp(version);
      process.exit(0);
    }

    if (arg === '--target' && argv[i + 1]) {
      options.targetDir = argv[i + 1];
      i += 1;
      continue;
    }

    if (arg === '--mode' && argv[i + 1]) {
      options.mode = argv[i + 1].toLowerCase();
      i += 1;
      continue;
    }

    if (arg === '--exclude' && argv[i + 1]) {
      options.excludePatterns = argv[i + 1]
        .split(',')
        .map((pattern) => pattern.trim())
        .filter(Boolean);
      i += 1;
      continue;
    }

    if (arg === '--report' && argv[i + 1]) {
      options.reportPath = argv[i + 1];
      i += 1;
      continue;
    }

    if (arg === '--dry-run') options.dryRun = true;
    if (arg === '--verbose' || arg === '-v') options.verbose = true;
    if (arg === '--recursive') options.recursive = true;
    if (arg === '--include-hidden') options.includeHidden = true;
    if (arg === '--no-manifest') options.noManifest = true;
  }

  if (!['type', 'name', 'date'].includes(options.mode)) {
    console.error(`Invalid mode "${options.mode}". Use type, name, or date.`);
    process.exit(1);
  }

  return options;
}

function runTidy(argv, version) {
  const options = parseTidyOptions(argv, version);
  const targetDir = normalizePath(options.targetDir);

  if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
    console.error(`Target directory not found: ${targetDir}`);
    process.exit(1);
  }

  const result = tidyDirectory(targetDir, options);

  console.log('');
  console.log('Summary');
  console.log(`scanned: ${result.stats.scanned}`);
  console.log(`moved: ${result.stats.moved}`);
  console.log(`skipped: ${result.stats.skipped}`);
  console.log(`errors: ${result.stats.errors}`);

  if (Object.keys(result.stats.categories).length > 0) {
    console.log('');
    for (const folder of Object.keys(result.stats.categories).sort()) {
      console.log(`${folder}: ${result.stats.categories[folder]}`);
    }
  }

  if (result.manifestPath) {
    console.log('');
    console.log(`manifest: ${result.manifestPath}`);
  }

  if (result.reportPath) {
    console.log(`report: ${result.reportPath}`);
  }
}

module.exports = {
  printTidyHelp,
  runTidy,
};
