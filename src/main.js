const { Command } = require('commander');
const program = new Command();
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const process = require('process');
const child_process = require('child_process');
const choices = fs.readdirSync(path.join(__dirname, './template'));

program
  .version('0.0.1')
  .command('create <name>')
  .option('-t, --template <templateName>',"模版名")
  .description('新建文件')
  .action((name, options) => {
    if (options.template === undefined || choices.indexOf(options.template) === -1) {
        if (choices.indexOf(options.template) === -1){
            console.log(chalk.yellow("不存在该目录，请从以下目录选择"))
        }
          inquirer
            .prompt([
              {
                type: 'list',
                name: 'template',
                message: '选择一个模版',
                choices: choices,
              },
            ])
            .then((answers) => {
              child_process.spawn('cp', ['-r', path.join(__dirname, `./template/${answers.template}`), process.cwd()]);
              console.log(chalk.green('操作成功'));
            })
            .catch((error) => {
              if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
              } else {
                // Something else went wrong
              }
            });
    } else {
        child_process.spawn('cp', ['-r', path.join(__dirname, `./template/${options.template}`), process.cwd()]);
        console.log(chalk.green('操作成功'));
    }
  });

  program.parse();