import { promisify } from 'node:util';
import { exec } from 'node:child_process'
const promise_exec = promisify(exec);

import { re } from './emoji.mjs';

const minusc = `-c "core.sshCommand=ssh -i id_ed25519 -o UserKnownHostsFile=known_hosts" -c user.email=darrell@darrelldupas.info -c user.name=darrelld`;
const pushbranch = "main"

function log(l) {
    console.log("gitpushdb: " + l);
}

export async function pulldb() {
    return new Promise(async (resolve, reject) => {
        try {
            await promise_exec('git checkout -f ' + pushbranch);
            log('git checkout -f ' + pushbranch);
            await promise_exec('chmod 600 id_ed25519');
            log('chmod 600 id_ed25519');
            await promise_exec('chmod a+rw public/msfish.db');
            log('chmod a+rw public/msfish.db');
            try {
                await promise_exec('git remote add gh git@github.com:ddupas/msfish.git');
                log('remote add done');
            } catch (e) { }
            await promise_exec(`git ${minusc} pull gh ${pushbranch}`);
            log(`git ${minusc} pull gh ${pushbranch}`);
            resolve(this);
        } catch (e) {
            reject(e);
        }
    });
}

export async function pushdb() {
    return new Promise(async (resolve, reject) => {
        try {
            await promise_exec(`git ${minusc} add public/msfish.db`);
            //log(`git ${minusc} add msfish.db`);	
            const emore = re();
            await promise_exec(`git ${minusc} commit -m ${emore}`);
            //log(`git ${minusc} commit -m ${emore}`);
            await promise_exec(`git ${minusc} push --set-upstream gh +${pushbranch}`);
            //log(`git ${minusc} push --set-upstream gh +${pushbranch}`);
            log(emore);
            resolve(this);
        } catch (e) {
            reject(e);
        }
    });
}

export default pushdb;
