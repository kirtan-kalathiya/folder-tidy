const inquirer = require('inquirer');
const colors = require('./colors');

async function promptUserAction() {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: colors.header('Select an action:'),
      choices: [
        { name: '🧹 Organize current folder', value: 'organize' },
        { name: '🔍 Dry run (preview changes)', value: 'dryrun' },
        { name: '↩️  Undo last operation', value: 'undo' },
        { name: '👀 Watch mode (auto-organize)', value: 'watch' },
        { name: '⚙️  Create/Edit config', value: 'config' },
        { name: '❌ Exit', value: 'exit' },
      ],
    },
  ]);

  return answer.action;
}

async function promptOrganizeOptions() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'targetDir',
      message: 'Enter target directory (press enter for current folder):',
      default: process.cwd(),
    },
    {
      type: 'list',
      name: 'mode',
      message: 'Organize by:',
      choices: [
        { name: 'File type (Images, Documents, etc.)', value: 'type' },
        { name: 'File name pattern', value: 'name' },
        { name: 'Modified date (Year/Month)', value: 'date' },
      ],
    },
    {
      type: 'confirm',
      name: 'recursive',
      message: 'Include subfolders?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'verbose',
      message: 'Show detailed logs?',
      default: false,
    },
  ]);

  return answers;
}

async function confirmAction(text) {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: text,
      default: true,
    },
  ]);

  return answer.confirmed;
}

module.exports = {
  promptUserAction,
  promptOrganizeOptions,
  confirmAction,
};
