const fs = require('fs');
const path = require('path');

function ensureDirectory(dirPath, dryRun) {
  if (dryRun || fs.existsSync(dirPath)) return;
  fs.mkdirSync(dirPath, { recursive: true });
}

function moveFileSync(sourcePath, destinationPath) {
  try {
    fs.renameSync(sourcePath, destinationPath);
  } catch (error) {
    if (error.code !== 'EXDEV') {
      throw error;
    }

    fs.copyFileSync(sourcePath, destinationPath);
    fs.unlinkSync(sourcePath);
  }
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
  moveFileSync,
};
