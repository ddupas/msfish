const schedule = require('node-schedule');

const job = schedule.scheduleJob('56 7,11,15,19,23 * * *', function(){
  console.log(`TEST CRON: ${new Date()}`);
});