const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./msfish.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to msfish database.');
});

db.serialize(() => {

    const stmt = db.prepare(
        `INSERT INTO players (id,name,snapfreq,lastsnap,discord,status) 
        VALUES (?,?,?,?,?,?) 
        ON CONFLICT(id) DO UPDATE SET
	        name = excluded.name,
	        snapfreq = excluded.snapfreq,
	        lastsnap = excluded.lastsnap,
	        discord = excluded.discord,
	        status = excluded.status;`);

    stmt.run('234', 'bbMcccilanzzz', '6', 'now', '432#234', 'active');
    stmt.run('1234', 'abbzMilanzzz', '6', 'now', '432#234', 'active');
    stmt.run('2234', 'zabbzcccMilanzzz', '6', 'now', '432#234', 'active');
    stmt.run('3234', 'bbzzazcccMilanzzz', '6', 'now', '432#234', 'active');
    stmt.finalize();

    db.each(`SELECT * FROM players`, (err, row) => {
        if (err) {
            console.error(err.message);
        }
        console.log(row.id + "\t" + row.name);
    });
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
});