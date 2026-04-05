const fs = require('fs');
const path = require('path');

function ensureDirectory(dirPath, dryRun) {
  if (dryRun || fs.existsSync(dirPath)) return;
  fs.mkdirSync(dirPath, { recursive: true });
}

function getSafeDestination(destinationDir, fileName) {
  const parsed = path.parse(fileName);
  let candidate = fileName;
  let counter = 1;

  while (fs.existsSync(path.join(destinationDir, candidate))) {
    candidate = `${parsed.name}(${counter})${parsed.ext}`;
    counter += 1;
  }

  return path.join(destinationDir, candidate);
}

module.exports = {
  ensureDirectory,
  getSafeDestination,
};
