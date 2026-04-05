const path = require('path');
const { CATEGORY_RULES, NAME_RULES } = require('../constants');

function getDateFolder(fileStats) {
  const date = fileStats.mtime;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getTypeFolder(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  for (const [folder, extensions] of Object.entries(CATEGORY_RULES)) {
    if (extensions.includes(extension)) {
      return folder;
    }
  }
  return extension ? 'Others' : 'No Extension';
}

function getNameFolder(fileName) {
  for (const rule of NAME_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(fileName))) {
      return rule.folder;
    }
  }
  return getTypeFolder(fileName);
}

function buildDestinationFolder(fileName, fileStats, mode) {
  if (mode === 'date') return getDateFolder(fileStats);
  if (mode === 'name') return getNameFolder(fileName);
  return getTypeFolder(fileName);
}

function getManagedFolders() {
  return new Set([
    ...Object.keys(CATEGORY_RULES),
    ...NAME_RULES.map((rule) => rule.folder),
    'Others',
    'No Extension',
  ]);
}

module.exports = {
  buildDestinationFolder,
  getManagedFolders,
};
