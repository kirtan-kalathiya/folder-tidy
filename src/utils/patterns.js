function globToRegex(pattern) {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped.replace(/\*/g, '.*')}$`, 'i');
}

function matchesPattern(value, patterns) {
  return patterns.some((pattern) => globToRegex(pattern).test(value));
}

function isHidden(name) {
  return name.startsWith('.');
}

module.exports = {
  matchesPattern,
  isHidden,
};
