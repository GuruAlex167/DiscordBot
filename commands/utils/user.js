import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
    .setName('user')
    .setDescription('Replies with User information!');
export async function execute(interaction) {
    await interaction.reply(`this command was run by ${interaction.user.username}\nYour tag: ${interaction.user.tag}, and joined on ${interaction.user.joinedAt}`);
}