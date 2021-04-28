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
                choices: ['新建一个项目'].concat(choices),
              },
            ])
            .then((answers) => {
                if (answers.template !== "新建一个项目") {
                    child_process.spawn('cp', ['-r', path.join(__dirname, `./template/${answers.template}`), process.cwd()]);
                }else{
                    inquirer.prompt([
                        {
                            type:'checkbox',
                            name:'initFiles',
                            choices:['npm','git','pretty','typescript']
                        }
                    ]).then((answers) => {
                        let array = answers.initFiles;
                        fs.mkdirSync(`${process.cwd()}/${name}`);
                        if(array.indexOf('npm') > -1){
                            const npm = child_process.spawn(`npm`,['init','-y'],{ cwd: `${process.cwd()}/${name}` });
                            npm.on('error',(err)=>{
                                console.log(chalk.red(err));
                            })
                        }
                        if (array.indexOf('git') > -1) {
                            const git = child_process.spawn(`git`, ['init'], { cwd: `${process.cwd()}/${name}` });
                            git.on('error', (err) => {
                              console.log(chalk.red(err));
                            });
                        }
                        if (array.indexOf('typescript') > -1) {
                          const typescript = child_process.spawn(`tsc`, ['--init'], { cwd: `${process.cwd()}/${name}` });
                            typescript.on('error', (err) => {
                              console.log(chalk.red(err));
                            });
                        }
                        child_process.spawn(`open`, ['.'], { cwd: `${process.cwd()}` });
                        console.log(answers);
                    }).catch((err) =>{
                        console.log(chalk.red(err));
                    })
                }
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