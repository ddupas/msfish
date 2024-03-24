const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function deletedup() {
	try {
		console.log(`deletedup: ${new Date().toLocaleString()}`);
		const { stdout, stderr } = await
		exec('cat dd.sql | sqlite3 msfish.db');
	}
	catch (e) {
		console.log(`ERROR gitpushdb: ${stdout} ${stderr}`);
		return;
	}
}

module.exports.deletedup = deletedup;
