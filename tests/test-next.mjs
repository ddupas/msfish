import { checkforupdates } from '../snapshotnext.mjs';
import schedule from 'node-schedule';
import { parseArgs } from 'node:util';

console.log('test-next');

const args = parseArgs({
  options: {
    now: {
      type: "boolean",
      short: "n",
    },
  },
});

if (args.values.now) {
  console.log('test-next: now check for updates');
  checkforupdates();
}

schedule.scheduleJob('*/20 * * * * *', async function () {
  try {
    await checkforupdates();
  }
  catch (e) {
    console.log('test-next: ' + e);
  }
});
