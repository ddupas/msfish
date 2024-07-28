import fs from 'fs';

const once = true;
const name = 'ready';

async function invoke(client) {
	const commands = fs
		.readdirSync('./discord-bot/events/commands')
		.filter((file) => file.endsWith('.mjs'))
		.map((file) => file.slice(0, -4));

	const commandsArray = [];

	for (let command of commands) {
		const commandFile = await import(`#commands/${command}`);
		commandsArray.push(commandFile.create());
	}

	client.application.commands.set(commandsArray);

	console.log(`Successfully logged in as ${client.user.tag}!`);
}

export { once, name, invoke };
