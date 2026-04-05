const VERSION = '2.0.0';
const APP_FOLDER = '.folder-tidy';
const MANIFEST_PREFIX = 'manifest-';
const INTERNAL_FILES = new Set(['index.js', 'package.json', 'README.md', 'LICENSE']);

const CATEGORY_RULES = {
  Images: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.tif', '.tiff', '.heic', '.bmp', '.avif'],
  Videos: ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.webm', '.flv', '.m4v'],
  Audio: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'],
  Documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt', '.xls', '.xlsx', '.csv', '.ppt', '.pptx', '.md'],
  Code: ['.js', '.cjs', '.mjs', '.ts', '.tsx', '.jsx', '.json', '.yaml', '.yml', '.xml', '.html', '.css', '.scss', '.less', '.py', '.java', '.c', '.cpp', '.cs', '.go', '.rs', '.php', '.rb', '.sh', '.ps1', '.sql'],
  Archives: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz'],
  Installers: ['.exe', '.msi', '.apk', '.dmg', '.pkg', '.deb', '.rpm'],
  Fonts: ['.ttf', '.otf', '.woff', '.woff2'],
  Design: ['.fig', '.sketch', '.xd', '.psd', '.ai'],
  Data: ['.db', '.sqlite', '.sqlite3', '.parquet', '.log'],
};

const NAME_RULES = [
  { folder: 'Screenshots', patterns: [/^screenshot/i, /^screen[-_ ]?shot/i] },
  { folder: 'Installers', patterns: [/\bsetup\b/i, /\binstall/i, /\bupdate\b/i] },
  { folder: 'Backups', patterns: [/\bbackup\b/i, /\.bak$/i, /copy/i] },
  { folder: 'Notes', patterns: [/\bnote/i, /\bnotes\b/i, /\bmeeting\b/i, /\btodo\b/i] },
  { folder: 'Invoices', patterns: [/\binvoice\b/i, /\breceipt\b/i, /\bbill\b/i] },
  { folder: 'Presentations', patterns: [/\bpresentation\b/i, /\bslides?\b/i, /\bpitch\b/i] },
];

module.exports = {
  APP_FOLDER,
  CATEGORY_RULES,
  INTERNAL_FILES,
  MANIFEST_PREFIX,
  NAME_RULES,
  VERSION,
};
