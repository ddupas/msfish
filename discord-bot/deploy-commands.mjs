import fs from 'fs';
import {
	REST,
	Routes
} from 'discord.js';

import config from '../config.mjs';

const clientId = config.clientId;
const token = config.token;

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./events/commands').filter(file => file.endsWith('.mjs'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	let command = await import(`./events/commands/${file}`).then((module) => {
		commands.push(module.create());
	})
	//commands.push(command.create());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
