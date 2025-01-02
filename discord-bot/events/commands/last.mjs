import { SlashCommandBuilder } from 'discord.js';
import { ri } from '../../../emoji.mjs'
import { DatabaseSync } from 'node:sqlite3';

async function dosend(interact) {
  return new Promise((resolve,reject) => {
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
		tosend = '```txt\n';
		tosend += `Last ${days} days:\n`;
		const db_last_ro = new DatabaseSync('public/msfish.db',{ open:true, readOnly:true });
		const stmt = db_last_ro.prepare(selectstmt);
		const arr_obj = stmt.all();

		arr_obj.forEach( (row) => {
			tosend += row.name.toString().padEnd(20, '.');
			tosend += row.kills.toString().padStart(5, ' ');
			tosend += row.deaths.toString().padStart(5, ' ');
			tosend += row.kd.toString().padStart(7, ' ');
			tosend += row.cmw.toString().padStart(5, ' ');
			tosend += row.brw.toString().padStart(5, ' ') + '\n';
		});
		
		db_last_ro.close();
		resolve(`${tosend}\n\`\`\`\n`);

}

function create() {
	const command = new SlashCommandBuilder()
	.setName('last')
		.setDescription('Stats for last N days - kills, deaths, kd, wins, br wins')
		.addNumberOption(option =>
			option.setName('days')
				.setDescription('number of days to go back 1.0 default'))
	return command.toJSON();
}

async function invoke(interaction) {
	try {
		await interaction.deferReply();
		const send = await dosend(interaction);
		await interaction.followUp('‎ ' + ` ${ri('Msfish') + send}`);
	} catch (e) {
		console.log('last interaction catch ')
	}
}

export { create, invoke };
