'use strict';
const { checkforupdates } = require('../snapshotnext');
const schedule = require('node-schedule');
const  { parseArgs } = require('node:util');

console.log('test-next');

const args = parseArgs({
  options: {
    now: {
      type: "boolean",
      short: "n",
    },
  },
});

if ( args.values.now ) {
    console.log('test-next: now check for updates');
    checkforupdates();
}

schedule.scheduleJob('*/120 * * * * *', async function() {
    try {
        await checkforupdates();
    }
    catch (e) {
        console.log('test-next: ' + e);
    }
});
