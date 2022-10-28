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

      const sqlite3 = require('sqlite3').verbose();

      // open the database
      let db = new sqlite3.Database('./msfish.db', sqlite3.OPEN_READWRITE, (err) => {
          if (err) {
              console.error(err.message);
          }
          console.log('Connected to msfish database.');
      });
      
      console.log('000000');
      db.serialize(() => {

        const stmt = db.prepare(
            `INSERT INTO players (id,name,snapfreq,lastsnap,discord,status) 
            VALUES (?,?,?,?,?,?) 
            ON CONFLICT(id) DO UPDATE SET
              name = excluded.name,
              snapfreq = excluded.snapfreq,
              lastsnap = excluded.lastsnap,
              discord = excluded.discord,
              status = excluded.status;`);
    console.log('000001');
              while (plist) {
                console.log('000002');
                const id = plist.toString().split('/').slice(-1)[0];
                const name = plist.textContent.trim().replace(/\n/g, '');
                stmt.run(id,name,'6', 'now', '432#234', 'active');
                plist = val.iterateNext();
              }
          
              console.log('000003');
        
        stmt.finalize();
    
        db.each(`SELECT * FROM players`, (err, row) => {
            if (err) {
                console.error(err.message);
            }
            console.log(row.id + "\t" + row.name);
        });
    });
    


     
      db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });



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