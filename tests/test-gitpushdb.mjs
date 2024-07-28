import pushdb from '../gitpushdb.mjs';
import { exit } from 'node:process';

function log(l) {
	console.log('test gitpushdb: ' + l);
}

try {
	await pushdb();
}
catch (e) {
	log('push fail ' + e);
	exit(1);
}
log('push success')
