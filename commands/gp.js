const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const SQLite3 = require('node-sqlite3');
const { ri, re } = require('../emoji');

const db = new SQLite3('msfish.db')

async function dosend (interact) {
    let tosend = '';
    await db.open();
    var rows = await db.all("SELECT * FROM players");
    x = 0;
    tosend = '```html\n';
    rows.forEach(row => {
        console.log(row.id, row.name)
        x++
        xstr = x.toString().padStart(3,' ');
        tosend += 
            `${xstr} ${row.name}\nhttps://stats.warbrokers.io/players/i/${row.id}\n`
    })
/*
    await db.each("SELECT * FROM users", [], function(row) {
        console.log(row);
        tosend += row.id;
    })
*/
    await db.close()

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



        

        
