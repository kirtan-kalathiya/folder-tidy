const chokidar = require('chokidar');
const path = require('path');
const colors = require('./colors');

function startWatchMode(targetDir, onFileChange) {
  const ignoredPatterns = [
    /node_modules/,
    /\.git/,
    /\.folder-tidy/,
    '**/*.tmp',
    '**/*.temp',
  ];

  console.log(colors.header(`\n👀 Watching folder: ${targetDir}`));
  console.log(colors.muted('Press Ctrl+C to stop watching\n'));

  const watcher = chokidar.watch(targetDir, {
    ignored: ignoredPatterns,
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 1000,
      pollInterval: 100,
    },
  });

  let timer = null;
  let isRunning = false;
  let pendingRun = false;

  const queueRun = () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(async () => {
      if (isRunning) {
        pendingRun = true;
        return;
      }

      isRunning = true;

      try {
        await Promise.resolve(onFileChange(targetDir));
      } catch (error) {
        console.log(colors.error(`Watch action failed: ${error.message}`));
      } finally {
        isRunning = false;

        if (pendingRun) {
          pendingRun = false;
          queueRun();
        }
      }
    }, 300);
  };

  watcher
    .on('add', (filePath) => {
      const fileName = path.basename(filePath);
      console.log(colors.info(`New file detected: ${fileName}`));
      queueRun();
    })
    .on('addDir', () => {
      // Ignore dir events
    })
    .on('error', (error) => {
      console.log(colors.error(`Watch error: ${error.message}`));
    });

  return watcher;
}

module.exports = {
  startWatchMode,
};
