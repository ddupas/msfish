import msFn from "./ms.mjs";

const logHtml = function(cssClass, ...args) {
    const ln = document.createElement('div');
    if (cssClass) ln.classList.add(cssClass);
    ln.append(document.createTextNode(args.join(' ')));
    document.body.append(ln);
};

const log = (...args) => logHtml('', ...args);
const warn = (...args) => logHtml('warning', ...args);
const error = (...args) => logHtml('error', ...args);

window.updatedb = async () => {
    const sqlite3 = window.sqlite3;
    const promise = fetch('msfish.db').then((response) => {
        if (!response.ok) {
            return null;
        }
        return response.arrayBuffer();
    }).catch((reason) => {
        return null;
    });
    const buf = await promise;
    if (!buf) {
        return null;
    }
    const bytes = new Uint8Array(buf);
    const p = sqlite3.wasm.allocFromTypedArray(bytes);
    window.db = new sqlite3.oo1.JsStorageDb('local' /* or 'session' */);
    //const db = new sqlite3.oo1.DB("/mydb.sqlite3",'ct');
    sqlite3.capi.sqlite3_deserialize(
        db.pointer,
        "main",
        p,
        bytes.length,
        bytes.length,
        sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE | sqlite3.capi.SQLITE_DESERIALIZE_RESIZEABLE
    );
}

/*
function: nextsnap
calculates when the expected next snapshot will occur
this is just here to provide info but mirrors checkforupdate.js
*/
window.nextsnap = (lastseen) => {
    const m = 1000 * 60;
    const base = 5.0 * m;
    if (lastseen < (4 * base)) {
        return base;
    }
    return lastseen / 4;
};

/*
function:listp
Lists the players on the left, along with their status. The playerstatus view
was created with create-view.sql. It shows when MSFISH last checked their
stats 📸,  when their kill count last changed 🎮, and finally the next expected
snapshot is calculated ➡️
*/
window.listp = () => {
    const db = window.db;
    let innerhtml = '<nav class="panel ">';
    const ele = document.getElementById('playerlist');
    const sql = 'select * from playerstatus';
    let result = '';
    db.exec({
        sql: "select * from playerstatus",
        rowMode: 'array', // 'array' (default), 'object', or 'stmt'
        callback: function(row) {
            //log("row ",++this.counter,"=",row);
            ++this.counter;
            if (this.counter == 1) {
                window.showchartid = row[1];
            }
            innerhtml += `<a class="panel-block" onclick="window.winscharts('${row[1]}');window.showcharts('${row[1]}');window.listp();">
				<label><div class="block"><div><span class="is-size-6">${row[0]}</span></div>
				<span class="is-size-7">
              🎮 ${msFn(row[2])}
              📸 ${msFn(row[3])}
              ➡️ ${msFn(window.nextsnap(row[2]))}
				</span></div></label></a>`;
        }.bind({ counter: 0 })
    });
    innerhtml += '</nav>';
    ele.innerHTML = innerhtml;
}
/* function: showlastsquad
  Display the activity for the squad over some periods of time.
  This is the charts with top row of k d k/d cw brw usually at the bottom right
*/
window.showlastsquad = async () => {
    const db = window.db;
    const ele = document.getElementById('lastsquad');
    // show which periods in days .04166666 is 60 minutes, .125 is 3 hours
    let show = [['hour', 0.0417], ['3 hours', 0.125], ['day', 1], ['3 days', 3], ['month', 31]];
    let innerhtml = '';
    let showheader = false;
    /* table header */
    innerhtml += ` <div class="block "><table class="table is-fullwidth "><tr>
	 <td width="25%"></td> <td>k</td><td>d</td><td>k/d</td><td>cw</td><td>brw</td></tr>`;

    show.forEach(async (days) => {
        showheader = false;
        db.exec({
            sql: `SELECT name, rkills-kills as kills , rdeaths - deaths as deaths,
    printf('%.2f', (rkills*1.0-kills*1.0)/(rdeaths *1.0 - Deaths *1.0 )) as kd,
    rcmw - cmw as cmw , rbrw - brw as brw FROM (SELECT pid, max(date) As recentdate,
  name, kills as rkills, Deaths as rdeaths, cmw as rcmw, brw as rbrw
    From snapshots Group By pid) t1  INNER JOIN
    (SELECT pid, max(date) As pastdate, kills, Deaths, cmw, brw
    From snapshots where date < (STRFTIME('%s', 'now') * 1000 ) - ( 86400000 * ${days[1]} )
    Group By pid) t2 ON t1.pid = t2.pid where rkills-kills > 0 order by kills desc`,
            callback: function(r) {
                if (!showheader) {
                    innerhtml += `<tr class='is-selected'><td colspan="6"> Last ${days[0]} </td> </tr>`;
                    showheader = true;
                }
                innerhtml += `<tr>`;
                r.forEach((col) => {
                    if (r[0] === col) {
                        innerhtml += `<td width="25%">${col}</td>`;
                    } else {
                        innerhtml += `<td width="15%">${col}</td>`;
                    }
                });
                innerhtml += `</tr>`;
            }
        }); // db.exec
    });
    innerhtml += `</table></div>`;
    ele.innerHTML = innerhtml;
};

/*
function: showcharts
use the id of a player to select all their snapshots, display kills and
k/d over the entire period
*/
window.winscharts = (id) => {
    if (id == undefined) {
        id = window.showchartid;
    }
    const db = window.db;
    const chartdata = [];
    const chartdata2 = [];
    let name = 'Spongebob';
    const query = `select date, cmw, brw, name from snapshots where pid='${id}'`;
    db.exec({
        sql: query,
        callback: function(r) {
            name = r[3];
            chartdata.push([parseInt(r[0]), parseInt(r[1])]);
            chartdata2.push([parseInt(r[0]), parseInt(r[2])]);
        }
    });

    Highcharts.chart('winschart', {
        chart: {
            type: 'line',
            height: `${window.innerHeight / 2 - 50}px`,
            backgroundColor: 'rgba(255,255,255,0)',
            styledMode: false,
            zooming: {
                type: 'x',
                singleTouch: true,
                resetButton: {
                    position: {
                        align: 'left', // by default
                        // verticalAlign: 'top', // by default
                        
                    }
                },
            },
            panning: {
                enabled: true,
                type: 'x',
            },
            
            panKey: 'shift'

        },
        legend: { enabled: false, },
        title: { text: name },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: function() {
                    const dd = new Date(this.value);
                    return dd.toLocaleDateString();
                },
            }
        },
        yAxis: [
            { title: { enabled: false } },
            {
                title: { enabled: false },
                opposite: true,
            }],
        series: [{
            yAxis: 0,
            name: 'cw',
            data: chartdata,
            color: '#9d00ff'

        }, {
            yAxis: 1,
            name: 'brw',
            data: chartdata2,
        }],
        plotOptions: {
            series: {
                color: '#0046aa',
                animation: false
            }
        },
    }
    );
};

/*
function: showcharts
use the id of a player to select all their snapshots, display kills and
k/d over the entire period
*/
window.showcharts = (id) => {
    if (id == undefined) {
        id = window.showchartid;
    }
    const db = window.db;
    const chartdata = [];
    const chartdata2 = [];
    let name = 'Spongebob';
    const query = `select date, kills, printf('%.4f', kills * 1.0 / deaths * 1.0) as kd, name from snapshots where pid='${id}'`;
    db.exec({
        sql: query,
        callback: function(r) {
            name = r[3];
            chartdata.push([parseInt(r[0]), parseInt(r[1])]);
            chartdata2.push([parseInt(r[0]), parseFloat(r[2])]);
        }
    });

    Highcharts.chart('killschart', {
        chart: {
            type: 'line',
            height: `${window.innerHeight / 2 - 50}px`,
            backgroundColor: 'rgba(255,255,255,0)',
            styledMode: false,
            zooming: {
                type: 'x',
                singleTouch: true,
                resetButton: {
                    position: {
                        align: 'left', // by default
                        // verticalAlign: 'top', // by default
                        
                    }
                },
            },
            panning: {
                enabled: true,
                type: 'x',
            },
            
            panKey: 'shift'

        },
        legend: { enabled: false, },
        title: { text: name },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: function() {
                    const dd = new Date(this.value);
                    return dd.toLocaleDateString();
                },
            }
        },
        yAxis: [
            { title: { enabled: false } },
            {
                title: { enabled: false },
                opposite: true,
            }],
        series: [{
            yAxis: 0,
            name: 'kills',
            data: chartdata,
            color: '#11FF11'

        }, {
            yAxis: 1,
            name: 'kd',
            data: chartdata2,
        }],
        plotOptions: {
            series: {
                color: '#FF0000',
                animation: false
            }
        },
    }
    );
};


window.getlastcommit = async function() {
  const response = await fetch ('https://api.github.com/users/ddupas/events/public');
  const data = await response.json();
    const msg = data[0].payload.commits[0].message;
    if (window.emojis[msg]) 
  document.querySelector('#lastcommit').textContent = msg + " " + window.emojis[msg].name; 
};

const update_msfish = async function() {
    
    await window.updatedb();
    window.listp();
    window.showlastsquad();
    window.showcharts();
    window.winscharts();
    window.getlastcommit();
    log('keep msfish alive ' + new Date() );
    setTimeout(update_msfish, (60000 + getRandomInt(30000)+ getRandomInt(30000)) );   
};

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//log("Loading and initializing sqlite3 module...");
self.sqlite3InitModule({
    print: log,
    printErr: error
}).then(function(sqlite3) {
    window.sqlite3 = sqlite3;
    try {
        update_msfish();
    } catch (e) {
        error("Exception:", e.message);
    }
});
