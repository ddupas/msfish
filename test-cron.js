const schedule = require('node-schedule');
const { snapshotall } = require('./snapshotall');
const { updateplayers} = require('./updateplayers');

const snapshotjob = schedule.scheduleJob('56 7,11,15,19,23 * * *',async function(){
  // https://crontab.guru/#56_7,11,15,19,23_*_*_*
  await snapshotall();
  console.log(`test-cron snapshotall: ${new Date()}`);
});

const updatejob = schedule.scheduleJob('53 7 * * *',async function(){
  await updateplayers();
  console.log(`test-cron udateplayers: ${new Date()}`);
});