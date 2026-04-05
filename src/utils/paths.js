const path = require('path');

function normalizePath(inputPath) {
  return path.resolve(inputPath);
}

function ensureRelative(baseDir, targetPath) {
  return path.relative(baseDir, targetPath).split(path.sep).join('/');
}

function resolveFrom(baseDir, inputPath) {
  if (path.isAbsolute(inputPath)) {
    return path.normalize(inputPath);
  }

  return path.resolve(baseDir, inputPath);
}

function isSubPath(baseDir, targetPath) {
  const relative = path.relative(baseDir, targetPath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function resolvePathInsideBase(baseDir, candidatePath) {
  const resolved = resolveFrom(baseDir, candidatePath);

  if (!isSubPath(baseDir, resolved)) {
    throw new Error(`Path escapes target directory: ${candidatePath}`);
  }

  return resolved;
}

module.exports = {
  ensureRelative,
  isSubPath,
  normalizePath,
  resolveFrom,
  resolvePathInsideBase,
};
