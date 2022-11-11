const { SlashCommandBuilder } = require('discord.js');
const SQLite3 = require('node-sqlite3');
const { ri, re } = require('../emoji');

const selectstmt =
    `SELECT MAX(date), Name, Medals
    FROM snapshots
    GROUP BY pid`;

const db = new SQLite3('msfish.db');

async function dosend(interact) {
	let tosend = '';
	await db.open();
	const rows = await db.all(selectstmt);
	tosend = '```txt\n';
	rows.forEach(row => {
		if (row.Medals !== '') {
			tosend += `${row.Name}\n${row.Medals}\n`;
		}
	});
	await db.close();
	interact.channel.send(`${tosend}\n\`\`\`\n`);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('m')
		.setDescription('Metallurgy - Display daily medals'),
	async execute(interaction) {
		await interaction.reply('‎ ' + ` ${ri('Daily Medals')}`);
		await dosend(interaction);
	},
};

