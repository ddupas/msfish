const { SlashCommandBuilder } = require('discord.js');
const SQLite3 = require('node-sqlite3');
const { ri, re } = require('../emoji');
//const { snapshotall } = require('../snapshotall');
const db = new SQLite3('msfish.db')

async function dosend (interact) {
   // await snapshotall();
    let days = interact.options.getNumber('days');
    if (!days) {
        days = '1.0';
    }
    const selectstmt =
    `SELECT name, rkills-kills as kills , rdeaths - deaths as deaths, 
    printf("%.2f", (rkills*1.0-kills*1.0)/(rdeaths *1.0 - Deaths *1.0 )) as kd,
    rcmw - cmw as cmw , rbrw - brw as brw
     FROM
    (SELECT pid, max(date) As recentdate
        , name, kills as rkills, Deaths as rdeaths, cmw as rcmw, brw as rbrw
    From snapshots
    Group By pid) t1  INNER JOIN
    (SELECT pid, max(date) As pastdate
        , kills, Deaths, cmw, brw
    From snapshots
    where date < (STRFTIME('%s', 'now') * 1000 ) - ( 86400000 * ${days} )
    Group By pid) t2 ON
    t1.pid = t2.pid
    where rkills-kills > 0
    order by kills desc`;

    let tosend = '';
    await db.open();
    var rows = await db.all(selectstmt);
    tosend = '```txt\n';
    tosend += `Last ${days} days:\n`
    rows.forEach( row =>  {
        tosend += row.name.toString().padEnd(20,".")
        tosend += row.kills.toString().padStart(5," ")
        tosend += row.deaths.toString().padStart(5," ")
        tosend += row.kd.toString().padStart(7," ")
        tosend += row.cmw.toString().padStart(5," ")
        tosend += row.brw.toString().padStart(5," ") +  '\n'
    });
    await db.close()
    interact.channel.send(`${tosend}\n\`\`\`\n`);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('last')
		.setDescription('Stats for last N days - kills, deaths, kd, wins, br wins')
        .addNumberOption(option =>
            option.setName('days')
                .setDescription('number of days to go back 1.0 default')),
	async execute(interaction) {
		await interaction.reply('‎ ' +` ${ri('Msfish')}` ); 
        await dosend(interaction);    
	},
};



        

        
