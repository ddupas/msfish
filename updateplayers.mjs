import { JSDOM } from 'jsdom';
import { DatabaseSync } from 'node:sqlite';

const rm_statement = 'DELETE FROM players';
const rm2_statement = 'DELETE from snapshots where pid not in (select id from players)';
const insert_statement =
    `INSERT INTO players (id,name,snapfreq,lastsnap,discord,status) 
    VALUES (?,?,?,?,?,?) 
    ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    snapfreq = excluded.snapfreq,
    lastsnap = excluded.lastsnap,
    status = excluded.status;`;

const squad_url = 'https://stats.warbrokers.io/squads/FISH';


async function getsquadpage(snap) {
	return new Promise(async (resolve, reject) => {
		try {
			const res = await fetch (squad_url);
			if (!res.ok) {
				reject(snap);
				return;
			}
			const data = await res.text();
			snap.page = data;
			resolve(snap);
		} catch (e) {
			reject(e);
			return;
		};

	});
}

// get player list from squad page and put it in db
export async function updateplayers() {
	return new Promise(async (resolve, reject) => {
		console.log('update players');
		const xpath = '//*[@id="squad-players"]/div[*]/div[1]/a';
		const snap = {};
		getsquadpage(snap).then( (snap) => {
			const dom = new JSDOM(snap.page);
			const doc = dom.window.document;
			const val = doc.evaluate(xpath, doc, null, 0, null);
			let plist = val.iterateNext();

			const db_updatep_rw = new DatabaseSync('public/msfish.db', { readOnly: false, open: true });
			const run1 = db_updatep_rw.exec(rm_statement);

			const stmt = db_updatep_rw.prepare(insert_statement);

			while (plist) {
				const id = plist.toString().split('/').slice(-1)[0];
				const name = plist.textContent.trim().replace(/\n/g, '');
				stmt.run(id, name, '6', Date.now(), 0, 'active');
				plist = val.iterateNext();
			}

			const run2 = db_updatep_rw.exec(rm2_statement);

			db_updatep_rw.close();
			resolve('🐈');
		});
	});
};
	
