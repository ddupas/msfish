'use strict'
const { pushdb,pulldb } = require('../gitpushdb');
const schedule = require('node-schedule');
const  { parseArgs } = require('node:util');

try {
	pulldb();
} catch (e) {
        console.log(e);
}

schedule.scheduleJob('4,19,24,29,34,39,44,49,54,59 * * * *', async function() {
	try {
		await pushdb();
	}
	catch (e) {
		console.log('test-gitpushdb push fail ' + e);
	}
});
