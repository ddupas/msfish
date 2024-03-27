import { deletedup } from '../deletedup';
import { scheduleJob } from 'node-schedule';

scheduleJob('20 10 * * *', async function() {
    try {
        await  deletedup();
    }
    catch (e) {
        console.log('test-deletedup fail');
    }
});