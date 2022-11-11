const schedule = require('node-schedule');
const { snapshotall } = require('./snapshotall');
const { updateplayers } = require('./updateplayers');
const { gitpushdb } = require('./gitpushdb');

const nextsnap = (lastseen) => {
	const m = 1000 * 60;
	const scale = 2.0;
	const base = 5.0 * m;

	let i = 1;
	let cursor = base;
	let found = false;

	while (!found && i < 20) {
		if (cursor > lastseen) {
			found = true;
		}
		else {
			i++;
			cursor *= scale;
		}
	}
	return cursor / scale;
};

/*
lastsnap = getlastsnap(pid)
lastseen = getlastseen(pid)
if new Date( )> nextsnap(lastseen,lastsnap)
	do snap

*/

const checkforupdates = () => {
	const fs = require('fs');
	const initSqlJs = require('./node_modules/sql.js/dist/sql-wasm.js');
	const filebuffer = fs.readFileSync('./msfish.db');
	initSqlJs().then((SQL) => {
		const db = new SQL.Database(filebuffer);
		const sqlstmnt = 'select * from playerstatus';
		let result = '';
		try { result = db.exec(sqlstmnt); }
		catch (e) { console.log(e); }
		result[0]['values'].forEach(element => {
			console.log(`${element[0]} ${nextsnap(element[2])}`);
		});
	});
}


schedule.scheduleJob('56 5,8,11,14,17,20,23 * * *', async function() {
	// https://crontab.guru/#56_7,11,15,19,23_*_*_*
	await snapshotall();
	console.log(`test-cron snapshotall: ${new Date()}`);
	await gitpushdb();
	console.log(`test-cron gitpushdb: ${new Date()}`);

});

schedule.scheduleJob('53 5 * * *', async function() {
	await updateplayers();
	console.log(`test-cron udateplayers: ${new Date()}`);
});

const startTime = new Date(Date.now() + 5000);
const endTime = new Date(startTime.getTime() + 90000);

schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/30 * * * * *' }, function() {
	console.log('Time for tea!');
});

schedule.scheduleJob({ rule: '*/30 * * * * *' }, function() {
	console.log(`freq:30 ${new Date()}`);
	checkforupdates();
});
checkforupdates();
