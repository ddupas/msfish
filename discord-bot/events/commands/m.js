const { SlashCommandBuilder } = require('discord.js');
const { ri, re } = require('../emoji');
const sqlite3 = require('sqlite3').verbose();


const selectstmt =
    `select * from 
    
    ( SELECT MAX(date), Name, Medals
        FROM snapshots
        GROUP BY pid )
    
    where  not  ( medals is  null or medals  =  "")`;


async function mtext() {
	console.log('mtext');
	return new Promise(async (resolve, reject) => {
		let tosend = ri('Daily Medals') + '\n```txt\n';
		const db_m_ro = new sqlite3.Database('msfish.db',sqlite3.OPEN_READONLY);
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

module.exports = {
	data: new SlashCommandBuilder()
		.setName('m')
		.setDescription('Metallurgy - Display daily medals'),
	async execute(interaction) {
		await interaction.deferReply();
		const dmtext = await mtext();
		await interaction.editReply(dmtext);

	},
};

