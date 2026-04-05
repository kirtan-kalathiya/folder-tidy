const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const colors = require('./colors');
const { normalizePath } = require('./paths');

const CONFIG_FILE = '.folder-tidy-config.json';

function getConfigPath(targetDir) {
  return path.join(targetDir, CONFIG_FILE);
}

function getDefaultConfig() {
  return {
    version: '2.0.0',
    mode: 'type',
    recursive: false,
    includeHidden: false,
    excludePatterns: [],
    autoUndo: true,
    dryRunByDefault: false,
  };
}

function readConfigFile(configPath) {
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch (error) {
    throw new Error(`Failed to parse config: ${configPath} (${error.message})`);
  }
}

function loadConfig(targetDir, explicitConfigPath) {
  const configPath = explicitConfigPath
    ? normalizePath(explicitConfigPath)
    : getConfigPath(targetDir);

  if (!fs.existsSync(configPath)) {
    if (explicitConfigPath) {
      throw new Error(`Config file not found: ${configPath}`);
    }

    return null;
  }

  const parsed = readConfigFile(configPath);
  return {
    config: {
      ...getDefaultConfig(),
      ...parsed,
    },
    path: configPath,
  };
}

function saveConfig(targetDir, config) {
  const configPath = getConfigPath(targetDir);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  console.log(colors.success(`Config saved to ${CONFIG_FILE}`));
}

async function createConfig(targetDir) {
  const existingConfig = loadConfig(targetDir);

  if (existingConfig) {
    const edit = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'editExisting',
        message: 'Config already exists. Do you want to edit it?',
        default: false,
      },
    ]);

    if (!edit.editExisting) {
      console.log(colors.info('Config not modified'));
      return;
    }
  }

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Default organize mode:',
      choices: ['type', 'name', 'date'],
      default: 'type',
    },
    {
      type: 'confirm',
      name: 'recursive',
      message: 'Scan subfolders by default?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'includeHidden',
      message: 'Include hidden files?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'autoUndo',
      message: 'Auto-save undo manifest?',
      default: true,
    },
  ]);

  const config = {
    version: '2.0.0',
    ...answers,
    excludePatterns: [],
    dryRunByDefault: false,
  };

  saveConfig(targetDir, config);
  console.log(colors.info(`Config file created: ${CONFIG_FILE}`));
}

function displayConfig(targetDir) {
  const loaded = loadConfig(targetDir);
  if (!loaded) {
    console.log(colors.warning('No config file found'));
    return;
  }

  console.log(colors.header('\nCurrent Configuration:'));
  console.log(JSON.stringify(loaded.config, null, 2));
}

module.exports = {
  getConfigPath,
  getDefaultConfig,
  loadConfig,
  saveConfig,
  createConfig,
  displayConfig,
  CONFIG_FILE,
};
