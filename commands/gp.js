const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const SQLite3 = require('node-sqlite3');



async function dosend (interact) {
// opendb
// select and build string
// close db
// send string
let tosend = '';
const db = new SQLite3('msfish.db')  // or file.sqlite3
    await db.open()  // must open first
    
    var rows = await db.all("SELECT * FROM players")  // params must be iterable
    x = 0;
    tosend = '```txt\n';
    rows.forEach(row => {
        console.log(row.id, row.name)
        x++
        xstr = x.toString().padStart(3,' ');
        tosend += `${xstr} https://stats.warbrokers.io/players/i/${row.id} ${row.name}\n`
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
		await interaction.reply('---');
        await dosend(interaction);    
	},
};



        

        
