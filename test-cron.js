const schedule = require('node-schedule');
const { snapshotall, snapshotone } = require('./snapshotall');
const { updateplayers } = require('./updateplayers');
const { gitpushdb } = require('./gitpushdb');

const nextsnap = (lastseen) => {
	const m = 1000 * 60;
	const base = 5.0 * m;
	return (base > 2 * lastseen) ? base : lastseen / 2;
};

async function checkforupdates() {
	const fs = require('fs');
	const initSqlJs = require('./node_modules/sql.js/dist/sql-wasm.js');
	const filebuffer = fs.readFileSync('./msfish.db');
	initSqlJs().then(async (SQL) => {
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


schedule.scheduleJob('56 6 * * *', async function() {
	await snapshotall();
	console.log(`test-cron snapshotall: ${new Date()}`);
	await gitpushdb();
	console.log(`test-cron gitpushdb: ${new Date()}`);

});

schedule.scheduleJob('41 5 * * *', async function() {
	await updateplayers();
	console.log(`test-cron udateplayers: ${new Date()}`);
});

const startTime = new Date(Date.now() + 5000);
const endTime = new Date(startTime.getTime() + 90000);

schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/30 * * * * *' }, function() {
	console.log('Time for tea!');
});

schedule.scheduleJob({ rule: '* */5 * * * *' }, async function() {
	await gitpushdb();
	console.log(`test-cron gitpushdb: ${new Date()}`);
});

schedule.scheduleJob({ rule: '*/30 * * * * *' }, async function() {
	await checkforupdates();
	console.log(`test-cron checkforupdates: ${new Date()}`);
});

