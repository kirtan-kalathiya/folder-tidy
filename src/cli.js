const { VERSION } = require('./constants');
const { printTidyHelp, runTidy } = require('./commands/tidy');
const { printUndoHelp, runUndo } = require('./commands/undo');

function printGlobalHelp() {
  console.log(`
folder-tidy ${VERSION}

Commands:
  tidy      Organize files in a folder
  undo      Restore the latest tidy run or a specific manifest

Usage:
  folder-tidy tidy --target <path>
  folder-tidy undo --target <path>

Quick use:
  folder-tidy --dry-run
  folder-tidy --mode name

Global options:
  --help, -h     Show help
  --version      Show version
`);
}

function run(argv) {
  if (argv.includes('--version')) {
    console.log(VERSION);
    return;
  }

  if (argv.length === 0) {
    runTidy([], VERSION);
    return;
  }

  const [command, ...rest] = argv;

  if (command === '--help' || command === '-h' || command === 'help') {
    printGlobalHelp();
    return;
  }

  if (command === 'tidy') {
    runTidy(rest, VERSION);
    return;
  }

  if (command === 'undo') {
    runUndo(rest);
    return;
  }

  // Backward-compatible shorthand: treat options as tidy args.
  if (command.startsWith('-')) {
    runTidy(argv, VERSION);
    return;
  }

  console.error(`Unknown command "${command}".`);
  printGlobalHelp();
  process.exit(1);
}

module.exports = {
  run,
};
