import { SlashCommandBuilder } from 'discord.js';
import { ri } from '../../../emoji.mjs'
import sqlite3 from 'sqlite3';

const selectstmt =
    `select * from 
    
    ( SELECT MAX(date), Name, Medals
        FROM snapshots
        GROUP BY pid )
    
    where  not  ( medals is  null or medals  =  "")`;


async function mtext() {
	return new Promise(async (resolve, reject) => {
		let tosend = ri('Daily Medals') + '\n```txt\n';
		const db_m_ro = new sqlite3.Database('public/msfish.db',sqlite3.OPEN_READONLY);
		db_m_ro.each(selectstmt, (err,row) => {
			if (row.Medals !== '') {
				tosend += `${row.Name}\n${row.Medals}\n`;
			}
		},()=>{
				db_m_ro.close();
				resolve(`${tosend}\n\`\`\`\n`);
		});
	});
}

function create() {
	const command = new SlashCommandBuilder()
	.setName('m')
	.setDescription('Metallurgy - Display daily medals');
	return command.toJSON();
}

async function invoke(interaction) {
	console.log("invoke /m");
try {
	await interaction.deferReply();
	const dmtext = await mtext();
	interaction.followUp(dmtext);
} catch (e) {
	console.log('caught exception in invoke /m');
}
	
}

export { create, invoke };
