'use strict';
import {
    deletedup
} from '../deletedup';
import {
    pushdb,
    pulldb
} from '../gitpushdb';
import {
    checkforupdates
} from '../snapshotnext';
import {
    updateplayers
} from '../updateplayers';
import {
    scheduleJob
} from 'node-schedule';
import {
    parseArgs
} from 'node:util';

function log(msg) {
    console.log('msfish: ' + msg);
}

try {
    pulldb();
} catch (e) {
    log(e);
}

scheduleJob('20 10 * * *', async function() {
    try {
        await deletedup();
    } catch (e) {
        log('deletedup fail');
    }
});

schedule.scheduleJob('4,19,24,29,34,39,44,49,54,59 * * * *', async function() {
    try {
        await pushdb();
    } catch (e) {
        log('push fail ' + e);
    }
});

schedule.scheduleJob('*/120 * * * * *', async function() {
    try {
        await checkforupdates();
    } catch (e) {
        log('check for updates fail ' + e);
    }
});

schedule.scheduleJob('26 11 * * *', async function() {
    try {
        await updateplayers();
    } catch (e) {
        log('updateplayers fail');
    }
});