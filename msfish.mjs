import {
    deletedup
} from './deletedup.mjs';
import {
    pushdb,
    pulldb
} from './gitpushdb.mjs';
import {
    checkforupdates,
    updateall
} from './snapshotnext.mjs';
import {
    updateplayers
} from './updateplayers.mjs';
import {
    scheduleJob
} from 'node-schedule';


function log(msg) {
    console.log('msfish: ' + msg);
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

log('init');
await init();
log('init done');

async function init() {

    // log('pre pulldb');
    // try {
    //     await pulldb();
    // } catch (e) {
    //     log(e);
    // }
    // log('post pulldb')

    // await sleep(90000);

    log('adding schedules');

    scheduleJob('20 10 * * *', async function () {
        try {
            await deletedup();
        } catch (e) {
            log('deletedup fail');
        }
    });

    scheduleJob('4,19,24,29,34,39,44,49,54,59 * * * *', async function () {
        try {
            await pushdb();
        } catch (e) {
            log('push fail ' + e);
        }
    });

    scheduleJob('*/1 * * * *', async function () {
        try {
            await sleep(30000);
            await checkforupdates();
        } catch (e) {
            log('check for updates fail ' + e);
        }
    });

    scheduleJob('26 11 * * *', async function () {
        try {
            await updateplayers();
            await updateall();
        } catch (e) {
            log('updateplayers fail' + e);
        }
    });

    log('schedules added');
}
