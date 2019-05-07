'use strict';

const path = require('path');
const fs = require('fs');
const appInfo = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json')));
const argv = require('yargs').argv;
const term = argv.compatible ? require('./patch.js') : require('terminal-kit').terminal;
const rp = require('request-promise');
const cp = require('child_process');

(async function() {
  try {
    // Clear console
    term.clear();

    term.magenta(`${appInfo.name} (client)\n`);
    term.yellow(`Version: ${appInfo.version}\n`);
    term.yellow(`Description: ${appInfo.description}\n`);
    term.yellow(`Author: ${appInfo.author}\n`);
    term.yellow(`License: ${appInfo.license}\n\n`);

    // Patch `termminal-kit` method(s) due to Windows 7 not fully support `terminal-kit`
  	if(argv.compatible) {
      term.red('Compatible is enabled.\n\n');
  	}

    // Ask for webhook url
    term.cyan(`${appInfo.name} (server) Url? `);
    const webhookUrl = await term.inputField().promise;
    term.white(`\nPull event(s) from ${webhookUrl}\n`);
    // Ask for repository url
    term.cyan('Repository Url? ');
    const repositoryUrl = await term.inputField().promise;
    term.white(`\nWatch on ${repositoryUrl}\n`);
    // Ask for branch to watch
    term.cyan('Branch? ');
    const branch = await term.inputField().promise;
    term.white(`\nWatched branch ${branch}\n`);
    // Set terminal window title
    term.windowTitle(`${repositoryUrl} (${branch})`);
    // Ask for secret (LocalCI server)
    term.cyan('LocalCI (server) secret? ');
    const secret = await term.inputField().promise;
    secret.split('').map(() => {
      term.backDelete();
    });
    // Ask for build action
    term.cyan(`\nScript to run? `);
    const scriptPath = await term.inputField().promise;
    term.white(`\nScript: ${scriptPath}\n`);
    term.white('\n');
    term.green(`\nListen \`Push\` event for Git repository ${repositoryUrl} from ${appInfo.name} (server) ${webhookUrl} on branch ${branch}..\n`);

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
          term.green(`[${new Date().toLocaleString()}] PushEvent trigged.\n`);

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
    console.error(e);
  } finally {
    // process.exit(0);
  }
}());
