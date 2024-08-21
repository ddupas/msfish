import { SlashCommandBuilder } from 'discord.js';
import { ri } from '../../../emoji.mjs'
import sqlite3 from 'sqlite3';

async function dosend(interact) {
	let tosend = '';
	let x = 0;
	tosend = '```html\n';
	const db_gp = new sqlite3.Database('public/msfish.db', sqlite3.OPEN_READONLY);
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

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
function create() {
	const command = new SlashCommandBuilder()
		.setName('gp')
		.setDescription('Get players from db');
	return command.toJSON();
}

async function invoke(interaction) {
	try {
		await interaction.deferReply();
		const send = await dosend(interaction);
		await interaction.editReply('‎ ' + ` ${ri('Msfish') + send}`);
	} catch (e) {
		console.log('discord interaction gp catch')
	}

}

export { create, invoke };
