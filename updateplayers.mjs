import { JSDOM } from 'jsdom';
import sqlite3 from 'sqlite3';






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

			const db_updatep_rw = new sqlite3.Database('public/msfish.db',sqlite3.OPEN_READWRITE, (open_err) => {
				if (open_err) {
					console.log(`ERR updateplayers open_err ${ JSON.stringify(open_err)}`);
					reject(open_err);
				}

				db_updatep_rw.serialize(function() {
					const run1 = db_updatep_rw.run(rm_statement,[],(run_err) => {
						if (run_err) {
							console.log(`ERR updateplayers run_err ${ JSON.stringify(run_err)}`);
							reject(run_err);
						}
					});
				});

				const stmt = db_updatep_rw.prepare(insert_statement);

				while (plist) {
					const id = plist.toString().split('/').slice(-1)[0];
					const name = plist.textContent.trim().replace(/\n/g, '');
					db_updatep_rw.serialize( () => {
						stmt.run(id, name, '6', new Date(), null, 'active',(run_err) => {
							if (run_err) {
								console.log(`ERR updateplayers run_err ${ JSON.stringify(run_err)}`);
								reject(run_err);
							}
						});
					});

					plist = val.iterateNext();
				}
				stmt.finalize();

				db_updatep_rw.serialize(function() {
					const run2 = db_updatep_rw.run(rm2_statement,[],(run_err) => {
						if (run_err) {
							console.log(`ERR updateplayers run_err ${ JSON.stringify(run_err)}`);
							reject(run_err);
						}
					});
				});

				db_updatep_rw.close();
				resolve('🐈');
			});
		});
	});
}