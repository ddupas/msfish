import { deletedup } from '../deletedup.mjs';
import { scheduleJob } from 'node-schedule';
import { exit } from 'node:process';
import { parseArgs } from 'node:util';

function log(l) {
	console.log('test deletedup: ' + l);
}

const args = parseArgs({
  options: {
    now: {
      type: "boolean",
      short: "n",
    },
  },
});

if ( args.values.now ) {
    try {
        await deletedup();
    }
    catch (e) {
        log('delete duplicates failed ' + e);
        exit(1);
    }
    log('delete duplicates succeded'); 
}

scheduleJob('20 10 * * *', async function() {
    try {
        await  deletedup();
    }
    catch (e) {
        log('delete duplicates fail');
    }
    log('delete duplicates succeded');
});