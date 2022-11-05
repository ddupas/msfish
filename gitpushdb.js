const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const emo = require('./emoji');

async function gitpushdb() {
  const { stdout, stderr } = await 
  exec(`git add msfish.db; git commit -m ${emo.re()}; git push`);
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}

module.exports.gitpushdb = gitpushdb;