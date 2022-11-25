const { SlashCommandBuilder } = require('discord.js');
const { ri } = require('../emoji');


const SQLite3 = require('node-sqlite3');
const db = new SQLite3('msfish.db');


async function dosend(interact) {
	let tosend = '';
	await db.open();
	const rows = await db.all('SELECT * FROM players');
	let x = 0;
	tosend = '```html\n';
	rows.forEach(row => {
		console.log(row.id, row.name);
		x++;
		let xstr = x.toString().padStart(3, ' ');
		tosend +=`${xstr} ${row.name}\nhttps://stats.warbrokers.io/players/i/${row.id}\n`;
	});
	await db.close();
	interact.channel.send(`${tosend}\n\`\`\`\n`);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gp')
		.setDescription('Get players from db'),
	async execute(interaction) {
		await interaction.reply('‎ ' + ri(' WarFish '));
		await dosend(interaction);
	},
};

