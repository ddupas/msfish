const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { JSDOM } = require('jsdom');
let tosend = 'error';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('udb')
		.setDescription('Update Database - Add / update players into db using web get'),
	async execute(interaction) {
		// download web page
    axios.get('https://stats.warbrokers.io/squads/FISH')
    .then(function (response) {
  
      const xpath = '//*[@id="squad-players"]/div[*]/div[1]/a';
  
      const dom = new JSDOM(response.data);
      const doc = dom.window.document;
  
      const val = doc.evaluate(xpath, doc, null, 0, null);
      let plist = val.iterateNext();
      tosend = 'INSERT INTO "players"("id","name","snapfreq","lastsnap","discord","status") VALUES (\'1\',\'\',\'6\',NULL,NULL,NULL);';
      let x = 0;
  
      while (plist) {
        x++;
        console.log(`${plist.textContent.trim().replace(/\n/g, '')} ==> https://stats.warbrokers.io${plist}`);
        tosend += x.toString().padStart(3,' ',x.toString()) + ' ' + plist.textContent.trim().replace(/\n/g, '').padEnd(20,'.') 
        + 'https://stats.warbrokers.io' + plist + '\n';
        plist = val.iterateNext();
      }
  
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(async function () {
      // always executed
      //const channel = client.channels.getAll("name", "mining-and-stats");
      
      //await channel.send('hi ' + tosend);
      await interaction.channel.send("```txt\n" + tosend + "\n```");
    });

		await interaction.reply(`...`);
	},
};