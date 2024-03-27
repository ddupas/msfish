import { promisify } from 'node:util';
import { exec } from 'node:child_process'

const promise_exec = promisify(exec);

function log(l) {
	console.log('deletedup: ' + l);
}

export async function deletedup() {
	try {
		log(new Date().toLocaleString());
		const { stdout, stderr } = await
		await promise_exec('cat dd.sql | sqlite3 msfish.db');
		log('successful delete duplicates');
	}
	catch (e) {
		log('error ' + e);
	}
}