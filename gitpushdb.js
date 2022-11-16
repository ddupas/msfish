const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const emo = require('./emoji');

async function gitpushdb() {
	try {
	console.log(`gitpushdb: ${new Date().toLocaleString()}`);
	const { stdout, stderr } = await
	exec(`git add msfish.db; git commit -m ${emo.re()}; git push`);
	} catch (e) {
		console.log(`ERROR gitpushdb: ${stdout} ${stderr}`);
		return;
	}
}

module.exports.gitpushdb = gitpushdb;
