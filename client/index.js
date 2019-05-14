#!/usr/bin/env node
 
'use strict';

const path = require('path');
const fs = require('fs');
const appInfo = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json')));
const argv = require('yargs').argv;
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const rp = require('request-promise');
const cp = require('child_process');

(async function () {
  try {
    // Clear up console
    console.clear();

    /*
     * Print application information
     */
    console.log(chalk.yellow(figlet.textSync(appInfo.name, {
    })));
    console.log(chalk.yellow(appInfo.description), '\n');
    console.log(chalk.yellow(`Version: ${appInfo.version}`));
    console.log(chalk.yellow(`Repository: ${appInfo.repository.url}`));
    console.log(chalk.yellow(`Author: ${ typeof(appInfo.author.name) === 'string' ? appInfo.author.name : appInfo.author}`));
    console.log(chalk.yellow(`License: ${appInfo.license}`));
    console.log('\n');

    // Ask for webhook url
    // console.log(chalk.cyan(`${appInfo.name} (server) Url? `));
    const { webhookUrl } = await inquirer.prompt([{
      type: 'input',
      message: chalk.cyan(`${appInfo.name} (server) Url: `),
      name: 'webhookUrl'
    }]);
    console.log(chalk.white(`\nPull event(s) from ${webhookUrl}\n`));
    // Ask for repository url
    const { repositoryUrl } = await inquirer.prompt([{
      type: 'input',
      message: chalk.cyan('Repository Url: '),
      name: 'repositoryUrl'
    }]);
    console.log(chalk.white(`\nWatch on ${repositoryUrl}\n`));
    // Ask for branch to watch
    const { branch } = await inquirer.prompt([{
      type: 'input',
      message: chalk.cyan('Branch: '),
      name: 'branch'
    }]);
    console.log(chalk.white(`\nWatched branch ${branch}\n`));
    // Ask for secret (LocalCI server)
    const { secret } = await inquirer.prompt([{
      type: 'password',
      message: chalk.cyan('LocalCI (server) secret: '),
      name: 'secret'
    }]);
    // Ask for build action
    let scriptPath = null;
    while(scriptPath === null) {
      scriptPath = (await inquirer.prompt([{
        type: 'input',
        message: chalk.cyan('Script to run: '),
        name: 'scriptPath'
      }])).scriptPath;
      console.log(chalk.white(`\nScript: ${scriptPath}\n`));
      // Check if file exists
      if(!fs.existsSync(scriptPath)) {
        console.log(chalk.red('*File not found in the path.'));
        scriptPath = null;
      }
    }
    console.log(chalk.green(`\n\nListen \`Push\` event for Git repository ${repositoryUrl} from ${appInfo.name} (server) ${webhookUrl} on branch ${branch}..\n`));

    // Cron job
    const cronjob = async() => {
      const response = await rp({
        method: 'POST',
        uri: `${webhookUrl}/pull`,
        headers: {
          'x-secret': secret
        },
        form: {
          repository_url: repositoryUrl,
          branch: branch
        }
      });

      if(response && response.length > 0) {
        const events = JSON.parse(response);
        for(const event of events) {
          console.log(chalk.green(`[${new Date().toLocaleString()}] PushEvent trigged.\n`));

          const subprocess = cp.spawn(scriptPath, [], {
            shell: true,
            detached: true,
            stdio: 'ignore'
          });

          subprocess.unref();
        }
      }
    }

    // Scheduling
    setInterval(async() => {
      await cronjob()
    }, 5000);
  } catch(e) {
    console.log(chalk.red(e));
  } finally {
  }
}());
