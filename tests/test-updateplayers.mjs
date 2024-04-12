import { updateplayers } from "../updateplayers.mjs";

//import { schedule } from 'node-schedule';

import schedule from 'node-schedule';



import { parseArgs } from 'node:util';

const args = parseArgs({
  options: {
    now: {
      type: "boolean",
      short: "n",
    },
  },
});

if ( args.values.now ) {
    console.log('now update players');
    updateplayers();
}

schedule.scheduleJob('26 11 * * *', async function() {
    try {
        await updateplayers();
    }
    catch (e) {
        console.log('test-updateplayers fail');
    }
});
