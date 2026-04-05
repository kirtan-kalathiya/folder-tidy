const fs = require('fs');
const path = require('path');
const { APP_FOLDER, MANIFEST_PREFIX } = require('../constants');

function getAppDir(targetDir) {
  return path.join(targetDir, APP_FOLDER);
}

function getTimestampId() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function saveManifest(targetDir, payload) {
  const appDir = getAppDir(targetDir);
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
  }

  const manifestPath = path.join(appDir, `${MANIFEST_PREFIX}${getTimestampId()}.json`);
  fs.writeFileSync(manifestPath, JSON.stringify(payload, null, 2));
  return manifestPath;
}

function readManifest(manifestPath) {
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function getLatestManifest(targetDir) {
  const appDir = getAppDir(targetDir);
  if (!fs.existsSync(appDir)) return null;

  const candidates = fs
    .readdirSync(appDir)
    .filter((file) => file.startsWith(MANIFEST_PREFIX) && file.endsWith('.json'))
    .sort();

  if (candidates.length === 0) return null;
  return path.join(appDir, candidates[candidates.length - 1]);
}

module.exports = {
  getAppDir,
  getLatestManifest,
  readManifest,
  saveManifest,
};
