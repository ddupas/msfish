const schedule = require('node-schedule');
const { snapshotall, snapshotone } = require('./snapshotall');
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

async function checkforupdates() {
	const fs = require('fs');
	const initSqlJs = require('./node_modules/sql.js/dist/sql-wasm.js');
	const filebuffer = fs.readFileSync('./msfish.db');
	initSqlJs().then( async (SQL) => {
		const db = new SQL.Database(filebuffer);
		const sqlstmnt = 'select * from playerstatus';
		let result = '';
		try { result = db.exec(sqlstmnt); }
		catch (e) { console.log(e); }
		result[0]['values'].forEach(async element => {
			const name = element[0];
			const pid = element[1];
			const lastseen = element[2];
			const lastsnap = element[3];
			if (lastsnap > nextsnap(lastseen)) {
				console.log(`update ${name}`);
				await snapshotone(pid);
			}
			// console.log(`${name} ${Date.now()}  ${lastseen} ${lastsnap}  ${nextsnap(lastseen)}`);
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
