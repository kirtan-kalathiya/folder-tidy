const cliProgress = require('cli-progress');

class ProgressBar {
  constructor(total = 100) {
    this.bar = new cliProgress.SingleBar({
      format: '{bar} | {percentage}% | {value}/{total} files',
      barCompleteChar: '█',
      barIncompleteChar: '░',
      hideCursor: true,
      stopOnComplete: true,
    }, cliProgress.Presets.shades_classic);
    this.bar.start(total, 0);
  }

  increment(value = 1) {
    this.bar.increment(value);
  }

  update(value, total) {
    this.bar.update(value, { total });
  }

  stop() {
    this.bar.stop();
  }
}

module.exports = ProgressBar;
