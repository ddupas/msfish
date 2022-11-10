'use strict'
const axios = require('axios');
const { JSDOM } = require('jsdom');
const SQLite3 = require('node-sqlite3');

async function getpage(snap) {
    return new Promise((resolve, reject) => {
        axios.get('https://stats.warbrokers.io/players/i/' + snap.pid).then((response) => {
            snap.page = response.data;
            resolve(snap);
        }).catch(function (error) {
                console.log(error);
                reject(error);
            })
    });
}

const xpathfor = {
    "Name": '/html/body/div[2]/div[1]/div/text()',
    "Kills": '//*[@id="player-details-summary-grid"]/div[2]/div[2]',
    "Deaths": '//*[@id="player-details-summary-grid"]/div[3]/div[2]',
    "wk": '//*[@id="player-details-summary-grid"]/div[7]/div[2]',
    "vk": '//*[@id="player-details-summary-grid"]/div[8]/div[2]',
    "dd": '//*[@id="player-details-summary-grid"]/div[9]/div[2]',
    "xp": '//*[@id="player-details-summary-grid"]/div[6]/div[2]',
    "hs": '//*[@id="player-details-summary-grid"]/div[10]/div[2]',
    "brw": '//*[@id="player-details-summary-grid"]/div[11]/div[2]',
    "cmw": '//*[@id="player-details-summary-grid"]/div[12]/div[2]'
};

function trimfixnode(v) {
    var toret = '';
    if (v._value.nodes[0].innerHTML)
        toret = v._value.nodes[0].innerHTML;
    else
        toret = v._value.nodes[0].textContent;
    return toret.trim().replace(/\n/g, '').replace(/,/g, '');
}

async function parsepage(snap) {
    return new Promise((resolve, reject) => {
        const dom = new JSDOM(snap.page);
        const doc = dom.window.document;
        let medalstext = '';
        // regular stats section 
        for (var xpath in xpathfor) {
            let val = doc.evaluate(xpathfor[xpath], doc, null, 0, null);

            snap[xpath] = trimfixnode(val);
        }
        // daily medals section   
        const xpathfor_dailys_xp = "//*[@class='player-details-daily-circle-container']";

        const xpathfor_value = "./span/div/*/[figure out index]"

        let dailys_node = doc.evaluate(xpathfor_dailys_xp, doc, null, 0, null);
        let node = dailys_node.iterateNext();
        while (node) {
            // place, category
            medalstext += node.children[0].textContent + ' ' + node.children[1].children[0].textContent + '\n';
            
            node = dailys_node.iterateNext();
        }
        snap["Medals"] = medalstext;
        snap["date"] = Date.now();
        snap["Name"] = snap["Name"].replace('[FISH] ','');
        snap.page = "🤡";
        resolve(snap);
    });
}

async function showparsed(snap) {
    return new Promise((resolve, reject) => {
        console.log(JSON.stringify(snap));
        resolve(snap);
    });
}

async function addtodb(snap) {
    return new Promise(async (resolve, reject) => {
        //console.log(JSON.stringify(snap));
        const db = new SQLite3('msfish.db');  // or file.sqlite3
        await db.open();
        let istmt_fields = 'INSERT INTO snapshots (';
        let istmt_values = 'VALUES (';

        Object.keys(snap).forEach(function (key) {
            // console.log('Key : ' + key + ', Value : ' + snap[key])
            if (key !== 'page') {
                istmt_fields += key + ',';
                istmt_values += `"${snap[key]}",`;
            }
        });
        const stmt = istmt_fields.slice(0, -1) + ') ' + istmt_values.slice(0, -1) + ');';
        var runres = await db.run(stmt);
        resolve(snap);
    });
}

async function getpids(pids) {
    return new Promise(async (resolve, reject) => {
        const db = new SQLite3('msfish.db');  // or file.sqlite3
        await db.open();
        const select_stmt = `select id from players;`
        var select_res = await db.all(select_stmt);
        select_res.forEach((r) => pids.push(r.id));
        resolve(pids);
    });
}

async function snapshotall() {
    getpids([]).then(pids => {
        pids.forEach(pid => getpage({ pid })
            .then(snap => parsepage(snap))
        //    .then(snap => showparsed(snap))
            .then(snap => addtodb(snap)))
    });
}
module.exports.snapshotall = snapshotall;
