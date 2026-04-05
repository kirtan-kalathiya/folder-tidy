const fs = require('fs');
const { normalizePath } = require('../utils/paths');
const { tidyDirectory } = require('../core/organizer');
const colors = require('../utils/colors');
const { getDefaultConfig, loadConfig } = require('../utils/config');

function printTidyHelp(version) {
  console.log(`
${colors.header('📂 Folder Tidy - Organize Command')} ${version}

${colors.header('Usage:')}
${colors.arrow('folder-tidy tidy')}
${colors.arrow('folder-tidy tidy --target <path>')}
${colors.arrow('folder-tidy tidy --mode <type|name|date>')}

${colors.header('Options:')}
${colors.bullet('--target <path>')}          Organize a specific directory
${colors.bullet('--mode <mode>')}            Organize by file type, file name, or modified date
${colors.bullet('--dry-run')}                Preview changes without moving anything
${colors.bullet('--recursive')}              Scan subfolders recursively
${colors.bullet('--exclude <patterns>')}     Exclude files or folders, comma-separated globs
${colors.bullet('--include-hidden')}         Include hidden files
${colors.bullet('--report <file>')}          Save a JSON report of the run
${colors.bullet('--config <file>')}          Load options from a config file
${colors.bullet('--no-manifest')}            Skip saving an undo manifest
${colors.bullet('--verbose')}                Show detailed skip and scan logs
${colors.bullet('--help, -h')}               Show tidy help
`);
}

function parseTidyOptions(argv, version) {
  const cliOptions = {};
  const positionalArgs = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      printTidyHelp(version);
      return { help: true };
    }

    if (arg === '--target' && argv[i + 1]) {
      cliOptions.targetDir = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--target') throw new Error('Missing value for --target');

    if (arg === '--mode' && argv[i + 1]) {
      cliOptions.mode = argv[i + 1].toLowerCase();
      i += 1;
      continue;
    }
    if (arg === '--mode') throw new Error('Missing value for --mode');

    if (arg === '--exclude' && argv[i + 1]) {
      cliOptions.excludePatterns = argv[i + 1]
        .split(',')
        .map((pattern) => pattern.trim())
        .filter(Boolean);
      i += 1;
      continue;
    }
    if (arg === '--exclude') throw new Error('Missing value for --exclude');

    if (arg === '--report' && argv[i + 1]) {
      cliOptions.reportPath = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--report') throw new Error('Missing value for --report');

    if (arg === '--config' && argv[i + 1]) {
      cliOptions.configPath = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--config') throw new Error('Missing value for --config');

    if (arg === '--dry-run') cliOptions.dryRun = true;
    else if (arg === '--verbose' || arg === '-v') cliOptions.verbose = true;
    else if (arg === '--recursive') cliOptions.recursive = true;
    else if (arg === '--include-hidden') cliOptions.includeHidden = true;
    else if (arg === '--no-manifest') cliOptions.noManifest = true;
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else positionalArgs.push(arg);
  }

  if (positionalArgs.length > 1) {
    throw new Error(`Unexpected arguments: ${positionalArgs.join(', ')}`);
  }

  if (positionalArgs.length === 1 && !cliOptions.targetDir) {
    cliOptions.targetDir = positionalArgs[0];
  }

  const targetDir = normalizePath(cliOptions.targetDir || process.cwd());
  const loadedConfig = loadConfig(targetDir, cliOptions.configPath);
  const baseOptions = loadedConfig ? loadedConfig.config : getDefaultConfig();
  const options = {
    targetDir,
    dryRun: false,
    verbose: false,
    recursive: false,
    includeHidden: false,
    noManifest: false,
    mode: 'type',
    excludePatterns: [],
    reportPath: null,
    configPath: loadedConfig ? loadedConfig.path : null,
    ...baseOptions,
    ...cliOptions,
    targetDir,
  };

  if (!['type', 'name', 'date'].includes(options.mode)) {
    throw new Error(`Invalid mode "${options.mode}". Use type, name, or date.`);
  }

  if (!Array.isArray(options.excludePatterns)) {
    throw new Error('excludePatterns must be an array in config.');
  }

  return options;
}

function runTidy(argv, version) {
  const options = parseTidyOptions(argv, version);
  if (options.help) return;
  const targetDir = options.targetDir;

  if (!fs.existsSync(targetDir)) {
    throw new Error(`Target directory not found: ${targetDir}`);
  }

  if (!fs.statSync(targetDir).isDirectory()) {
    throw new Error(`Target path is not a directory: ${targetDir}`);
  }

  const result = tidyDirectory(targetDir, options);

  console.log('');
  console.log(colors.header('📊 Summary'));
  console.log(`${colors.info('Scanned:')} ${result.stats.scanned} files`);
  console.log(`${colors.success('Moved:')} ${result.stats.moved} files`);
  console.log(`${colors.muted('Skipped:')} ${result.stats.skipped} files`);
  if (result.stats.errors > 0) {
    console.log(`${colors.error('Errors:')} ${result.stats.errors}`);
  }

  if (Object.keys(result.stats.categories).length > 0) {
    console.log('');
    console.log(colors.header('📁 Breakdown by category:'));
    for (const folder of Object.keys(result.stats.categories).sort()) {
      console.log(`${colors.bullet(folder)}: ${result.stats.categories[folder]} files`);
    }
  }

  if (result.manifestPath) {
    console.log('');
    console.log(colors.info(`Manifest saved: ${result.manifestPath}`));
  }

  if (result.reportPath) {
    console.log(colors.info(`Report saved: ${result.reportPath}`));
  }

  if (options.configPath) {
    console.log(colors.info(`Config used: ${options.configPath}`));
  }

  if (!options.dryRun && result.stats.moved > 0) {
    console.log('');
    console.log(colors.success('✨ Your folder has been tidied!'));
  }
}

module.exports = {
  printTidyHelp,
  runTidy,
};
