import schedule from 'node-schedule';
import { discordlogin } from './bot.mjs';

function log(l) {
	console.log('manage-bot: ' + l);
}

let client = null;

// restart discord bot every 20 minutes



async function init() {
	log('init');
	await sleep(4999);
	
	try {
		client = discordlogin();
	}
	catch (e) { 
		log(e);	
		return;
	}

	log('discord login success');

	schedule.scheduleJob('19,39,59 * * * *', async function() {
		log('restarting discord');
		try {
			client = null;
			if (global.gc) {
				global.gc();
				log('global gc');
			} else {
				console.log('Garbage collection unavailable.  Pass --expose-gc '
				  + 'when launching node to enable forced garbage collection.');
			}
			await sleep(4999);
			client = discordlogin();
			log('discord login success');
		}
		catch (e) { log("restart error"); }
	});

}

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

init()


