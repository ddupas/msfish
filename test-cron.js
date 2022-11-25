const schedule = require('node-schedule');
const { snapshotall, snapshotone } = require('./snapshotall');
const { updateplayers } = require('./updateplayers');
const { gitpushdb } = require('./gitpushdb');

const SQLite3 = require('node-sqlite3');
const db = new SQLite3('msfish.db');

const nextsnap = (lastseen) => {
	const m = 1000 * 60;
	const base = 5.0 * m;
	if (lastseen < (4 * base)) {
		return base;
	}
	return lastseen / 4;
};

async function checkforupdates() {
	console.log(`checkforupdates: ${new Date().toLocaleString()}`);
	try {
		db.open();
		const sqlstmnt = 'select * from playerstatus';
		const result = await db.all(sqlstmnt);
		result.forEach(async row => {
			const name = row.name;
			const pid = row.pid;
			const lastseen = row.miliago;
			const lastsnap = row.lsmiliago;
			if (lastsnap > nextsnap(lastseen)) {
				console.log(`checkforupdates: ${name}`);
				try { await snapshotone(pid); }
				catch (e) { console.log(e); return;}
			}
		});
		await db.close();
	}
	catch (e) { console.log(e); return;}
}


schedule.scheduleJob('56 6 * * *', async function() {
	try {
		await snapshotall();
	}
	catch (e) { console.log(e); return;}
	try {
		await gitpushdb();
	}
	catch (e) { console.log(e); return; }
});

schedule.scheduleJob('41 5 * * *', async function() {
	try {
		await updateplayers();
	}
	catch (e) { console.log(e); return;}
});

const startTime = new Date(Date.now() + 5000);
const endTime = new Date(startTime.getTime() + 90000);

schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/30 * * * * *' }, function() {
	console.log('Time for tea!');
});

schedule.scheduleJob('*/5 * * * *', async function() {
	try {
		await gitpushdb();
	}
	catch (e) { console.log(e); return; }
});

schedule.scheduleJob({ rule: '*/30 * * * * *' }, async function() {
	try {
		await checkforupdates();
	}
	catch (e) { console.log(e); return; }
});

