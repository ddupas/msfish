const { SlashCommandBuilder } = require('discord.js');
const { ri } = require('../emoji');

const sqlite3 = require('sqlite3').verbose();

async function dosend(interact) {
	let tosend = '';

	let x = 0;
	tosend = '```html\n';
	const db_gp = new sqlite3.Database('msfish.db', sqlite3.OPEN_READONLY);
	db_gp.each("SELECT * FROM players", (err, row) => {
		console.log(row.id, row.name);
		x++;
		let xstr = x.toString().padStart(3, ' ');
		tosend +=`${xstr} ${row.name}\nhttps://stats.warbrokers.io/players/i/${row.id}\n`;
    }, () => {
			db_gp.close();
			interact.channel.send(`${tosend}\n\`\`\`\n`);
	});


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

