const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const emo = require('./emoji');

const minusc = `-c "core.sshCommand=ssh -i id_ed25519 -o UserKnownHostsFile=known_hosts" -c user.email=darrell@darrelldupas.info -c user.name=darrelld`;
const pushbranch = "main"

function log(l) {
	console.log("gitpushdb: " +l);
}

async function pulldb() {
	await exec('git checkout -f ' + pushbranch);
	log('git checkout -f ' + pushbranch );
	
	await exec('chmod 600 id_ed25519');
	log('chmod 600 id_ed25519');
	
	await exec('chmod a+rw msfish.db');
	log('chmod a+rw msfish.db');
	try {
	await exec('git remote add gh git@github.com:ddupas/msfish.git');
	log('remote add done');
	} catch (e){}
		
	await exec(`git ${minusc} pull gh ${pushbranch}`);
	log(`git ${minusc} pull gh ${pushbranch}`);
}

// main
async function pushdb() {
	await exec(`git ${minusc} add msfish.db`);
	//log(`git ${minusc} add msfish.db`);
		
	const emore = emo.re();
	await exec(`git ${minusc} commit -m ${emore}`);
	//log(`git ${minusc} commit -m ${emore}`);
	
	await exec(`git ${minusc} push --set-upstream gh +${pushbranch}`);
	//log(`git ${minusc} push --set-upstream gh +${pushbranch}`);
	log(emore);
}

module.exports.pulldb = pulldb;
module.exports.pushdb = pushdb;
