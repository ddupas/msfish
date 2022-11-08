const schedule = require('node-schedule');
const { snapshotall } = require('./snapshotall');
const { updateplayers} = require('./updateplayers');
const { gitpushdb } = require('./gitpushdb');

const snapshotjob = schedule.scheduleJob('56 5,8,11,14,17,20,23 * * *',async function(){
  // https://crontab.guru/#56_7,11,15,19,23_*_*_*
  await snapshotall();
  console.log(`test-cron snapshotall: ${new Date()}`);
  await gitpushdb();
  console.log(`test-cron gitpushdb: ${new Date()}`);

});

const updatejob = schedule.scheduleJob('53 5 * * *',async function(){
  await updateplayers();
  console.log(`test-cron udateplayers: ${new Date()}`);
});

const startTime = new Date(Date.now() + 5000);
const endTime = new Date(startTime.getTime() + 90000);
const job = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/30 * * * * *' }, function(){
  console.log('Time for tea!');
});

const job2 = schedule.scheduleJob({rule: '*/30 * * * * *' }, function(){
  console.log(`freq:30 ${new Date()}`);
});