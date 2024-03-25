import schedule from 'node-schedule';
import { discordlogin } from './bot.mjs';

function log(l) {
	console.log('manage-bot: ' + l);
}

let client = null;

// restart discord bot every 20 minutes
schedule.scheduleJob('20,40,59 * * * *', async function() {
	log('restart schedule added');
	try {
		client = null;
		if (global.gc) {
			global.gc();
		} else {
			console.log('Garbage collection unavailable.  Pass --expose-gc '
			  + 'when launching node to enable forced garbage collection.');
		}
		await sleep(4999);
		client = discordlogin();
	}
	catch (e) { log("restart error"); }
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


