const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { JSDOM } = require('jsdom');
let tosend = 'error';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wg')
		.setDescription('Web Get Fish - Display the current list of members on stats.warbrokers.io'),
	async execute(interaction) {
		// download web page
    axios.get('https://stats.warbrokers.io/squads/FISH')
    .then(function (response) {
  
      const xpath = '//*[@id="squad-players"]/div[*]/div[1]/a';
  
      const dom = new JSDOM(response.data);
      const doc = dom.window.document;
  
      const val = doc.evaluate(xpath, doc, null, 0, null);
      let plist = val.iterateNext();
      tosend = '';
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