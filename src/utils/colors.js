const chalk = require('chalk');

const colors = {
  success: (text) => chalk.green(`✅ ${text}`),
  error: (text) => chalk.red(`❌ ${text}`),
  warning: (text) => chalk.yellow(`⚠️  ${text}`),
  info: (text) => chalk.blue(`ℹ️  ${text}`),
  muted: (text) => chalk.gray(text),
  header: (text) => chalk.bold.cyan(text),
  arrow: (text) => chalk.cyan(`→ ${text}`),
  bullet: (text) => chalk.cyan(`• ${text}`),
  dim: (text) => chalk.dim(text),
};

module.exports = colors;
