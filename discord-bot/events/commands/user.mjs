import { SlashCommandBuilder } from 'discord.js';

function create() {
	const command = new SlashCommandBuilder()
	.setName('user')
	.setDescription('Provides information about the user.');
	return command.toJSON();
}

async function invoke(interaction) {
	await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
}

export { create, invoke };
