import { JSDOM } from 'jsdom';
import { DatabaseSync } from 'node:sqlite3';

function log(l) {
	console.log('snapshotnext: ' + l);
}

export async function updateall() {
	log('update all');
	const sqlstmnt = `
 
 select * from players`;

	const results = [];
	const db_check_ro = new DatabaseSync('public/msfish.db',  {open:true, readOnly:true});

	const stmt = db_check_ro.prepare("SELECT * FROM players");
	const arr_obj = stmt.all();
	arr_obj.foreach( (row) => {

	rows.forEach( async (row) => {
			log(row.id);
			if (row.id) {
				await snapshotone(row.id);
				log(row.name);
			}
		});
	});
	db_check_ro.close();
}

export async function checkforupdates() {
	// log('check for updates');
	const sqlstmnt = ` select * from getnext `;
	const db_check_ro = new DatabaseSync('public/msfish.db', {open:true, readOnly:true});
	const stmt = db_check_ro.prepare("SELECT * FROM players");
	const result = stmt.get();
		// log(JSON.stringify(result).Name);
	if (result && result.pid) {
			await snapshotone(result.pid);
	}
	db_check_ro.close();
}

async function getpage(snap) {
	//log('getpage');
	return new Promise(async (resolve, reject) => {
		try {
			const res = await fetch('https://stats.warbrokers.io/players/i/' + snap.pid);
			if (!res.ok) {
				reject(snap);

			}
			const data = await res.text();
			snap.page = data;
			//log('resolve getpage');
			resolve(snap);
		} catch (e) {
			reject(e);

		};

	});
}

const xpathfor = {
	'Name': '/html/body/div[2]/div[1]/div/text()',
	'Kills': '//*[@id="player-details-summary-grid"]/div[2]/div[2]',
	'Deaths': '//*[@id="player-details-summary-grid"]/div[3]/div[2]',
	'wk': '//*[@id="player-details-summary-grid"]/div[7]/div[2]',
	'vk': '//*[@id="player-details-summary-grid"]/div[8]/div[2]',
	'dd': '//*[@id="player-details-summary-grid"]/div[9]/div[2]',
	'xp': '//*[@id="player-details-summary-grid"]/div[6]/div[2]',
	'hs': '//*[@id="player-details-summary-grid"]/div[10]/div[2]',
	'brw': '//*[@id="player-details-summary-grid"]/div[11]/div[2]',
	'cmw': '//*[@id="player-details-summary-grid"]/div[12]/div[2]',
};

function trimfixnode(v) {
	let toret = '';
	if (v._value.nodes[0].innerHTML) { toret = v._value.nodes[0].innerHTML; }
	else { toret = v._value.nodes[0].textContent; }
	return toret.trim().replace(/\n/g, '').replace(/,/g, '');
}

async function parsepage(snap) {
	// log('parsepage');
	return new Promise((resolve, reject) => {
		const dom = new JSDOM(snap.page);
		const doc = dom.window.document;
		let medalstext = '';
		// regular stats section
		for (const xpath in xpathfor) {
			const val = doc.evaluate(xpathfor[xpath], doc, null, 0, null);
			snap[xpath] = trimfixnode(val);
		}
		// daily medals section
		const xpathfor_dailys_xp = '//*[@class=\'player-details-daily-circle-container\']';
		/*
		TODO: get the medal details
		const xpathfor_value = ``;

		*/
		const dailys_node = doc.evaluate(xpathfor_dailys_xp, doc, null, 0, null);
		let node = dailys_node.iterateNext();
		while (node) {
			// place, category
			medalstext += node.children[0].textContent + ' ' + node.children[1].children[0].textContent + '\n';

			node = dailys_node.iterateNext();
		}
		snap['Medals'] = medalstext;
		snap['date'] = Date.now();
		snap['Name'] = snap['Name'].replace('[FISH] ', '');
		snap.page = '🤡';
		resolve(snap);
	});
}

async function addtodb(snap) {
	//log('addtodb');
	return new Promise(async (resolve, reject) => {
		let istmt_fields = 'INSERT INTO snapshots (';
		let istmt_values = 'VALUES (';
		Object.keys(snap).forEach(function (key) {
			if (key !== 'page') {
				istmt_fields += key + ',';
				istmt_values += `"${snap[key]}",`;
			}
		});
		const stmt = istmt_fields.slice(0, -1) + ') ' + istmt_values.slice(0, -1) + ');';

		const db_add_rw = new DatabaseSync('public/msfish.db', { readOnly:false, open:true } );
		const exec_ret = db_add_rw.exec(stmt);

		db_add_rw.close();
		//log('addtodb resolve reached')
		resolve(snap);
			});
	}


export async function snapshotone(pid) {
	log('snapshotone');
	return new Promise(async (resolve, reject) => {
		getpage({ pid })
			.then(snap => parsepage(snap))
			.then(snap => addtodb(snap))
			.then(snap => log(JSON.stringify(snap)))
			.catch(e => {
				log(JSON.stringify(e))
				reject(e)
			});
		resolve(this);
	});
}
