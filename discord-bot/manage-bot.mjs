import schedule from 'node-schedule';
import { discordlogin } from './discordlogin.mjs';

let client = null;

schedule.scheduleJob('20,40,59 * * * *', function() {

	try {
		throw new Error("??");
		
	}
	catch (e) { console.log("scheduled restart"); return; }
});


async function init() {
	console.log(1);
	await sleep(4999);
	console.log(2);
	try {
		client = discordlogin();
	}
	catch (e) { console.log(e);
	}
}

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

init()


