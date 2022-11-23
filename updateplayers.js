const axios = require('axios');
const { JSDOM } = require('jsdom');
const sqlite3 = require('sqlite3').verbose();

const insert_statement =
    `INSERT INTO players (id,name,snapfreq,lastsnap,discord,status) 
    VALUES (?,?,?,?,?,?) 
    ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    snapfreq = excluded.snapfreq,
    lastsnap = excluded.lastsnap,
    status = excluded.status;`;
const squad_url = 'https://stats.warbrokers.io/squads/FISH';

// get player list from squad page and put it in db
async function updateplayers() {
	axios.get(squad_url).then(function(response) {
		const xpath = '//*[@id="squad-players"]/div[*]/div[1]/a';
		const dom = new JSDOM(response.data);
		const doc = dom.window.document;
		const val = doc.evaluate(xpath, doc, null, 0, null);
		let plist = val.iterateNext();
		const db = new sqlite3.Database('./msfish.db', sqlite3.OPEN_READWRITE, (err) => {
			if (err) {
				console.error(err.message);
			}
			console.log('Connected to msfish database.');
		});
		db.serialize(() => {
			const stmt = db.prepare(insert_statement);
			while (plist) {
				const id = plist.toString().split('/').slice(-1)[0];
				const name = plist.textContent.trim().replace(/\n/g, '');
				stmt.run(id, name, '6', new Date(), null, 'active');
				plist = val.iterateNext();
			}
			stmt.finalize();
			db.each('SELECT * FROM players', (err, row) => {
				if (err) {
					console.error(err.message);
				}
				console.log(row.id + '\t' + row.name);
			});
		});
		db.close((err) => {
			if (err) {
				console.error(err.message);
			}
			console.log('Close the database connection.');
		});
	}).catch((err) => {
		console.log(`ERROR: updateplayers ${new Date()}`);
	});
}

module.exports.updateplayers = updateplayers;
