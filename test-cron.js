const schedule = require('node-schedule');
const { snapshotall } = require('./snapshotall');

const job = schedule.scheduleJob('56 7,11,15,19,23 * * *',async function(){
  await snapshotall();
  console.log(`test-cron snapshotall: ${new Date()}`);
});