const { updateplayers } = require('../updateplayers');
const schedule = require('node-schedule');
const  { parseArgs } = require('node:util');

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
