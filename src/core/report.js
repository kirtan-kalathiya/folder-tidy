const fs = require('fs');
const path = require('path');
const { normalizePath } = require('../utils/paths');

function writeReport(reportPath, payload) {
  const resolved = normalizePath(reportPath);
  const parentDir = path.dirname(resolved);

  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  fs.writeFileSync(resolved, JSON.stringify(payload, null, 2));
  return resolved;
}

module.exports = {
  writeReport,
};
