import { SlashCommandBuilder } from 'discord.js';
import { ri } from '../../../emoji.mjs'
import { DatabaseSync } from 'node:sqlite';

async function dosend(interact) {
	let tosend = '';
	let x = 0;
	tosend = '```html\n';
	const db_gp = new DatabaseSync('public/msfish.db', {open:true, readOnly:true});
	const stmt = db_gp.prepare("SELECT * FROM players");
	const arr_obj = stmt.all();
	arr_obj.foreach( (row) => {
		console.log(row.id, row.name);
		x++;
		let xstr = x.toString().padStart(3, ' ');
		tosend +=`${xstr} ${row.name}\nhttps://stats.warbrokers.io/players/i/${row.id}\n`;
  }
	interact.channel.send(`${tosend}\n\`\`\`\n`);
	db_gp.close();
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
		await interaction.followUp('‎ ' + ` ${ri('Msfish') + send}`);
	} catch (e) {
		console.log('discord interaction gp catch')
	}

}

export { create, invoke };
