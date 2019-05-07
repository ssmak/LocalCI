'use strict';

const argv = require('yargs').argv;
const fp = require('find-process');

(async function() {
  // Kill process by port
  if(argv.port && /^\d{1,4}$/.test(argv.port)) {
    let runningProcess = await fp('port', argv.port);
    if(runningProcess && runningProcess.length === 1) {
      // Process found
      runningProcess = runningProcess[0];
      process.kill(runningProcess.pid);
      console.log(`[${new Date().toLocaleString()}] Process PID(${runningProcess.pid}) killed.`);
    }
  }
}());
