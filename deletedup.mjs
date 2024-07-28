import { promisify } from 'node:util';
import { exec } from 'node:child_process'

const promise_exec = promisify(exec);

function log(l) {
	console.log('deletedup: ' + l);
}

export async function deletedup() {
	try {
		log(new Date().toLocaleString());
		const { stdout, stderr } = await promise_exec('echo "delete from snapshots where rowid in (select * from duplicates); vacuum;" | sqlite3 public/msfish.db');
		log('successful delete duplicates');
	}
	catch (e) {
		log('error ' + e);
		throw e;
	}
}