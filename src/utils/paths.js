const path = require('path');

function normalizePath(inputPath) {
  return path.resolve(inputPath);
}

function ensureRelative(baseDir, targetPath) {
  return path.relative(baseDir, targetPath).split(path.sep).join('/');
}

module.exports = {
  ensureRelative,
  normalizePath,
};
