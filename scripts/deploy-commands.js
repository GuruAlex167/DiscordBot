import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { getDirname } from '../utils.js';

const __dirname = getDirname(import.meta.url);

// Checks to make sure the required environment variables are set
if (!process.env.DISCORD_TOKEN) {
    throw new Error('Missing DISCORD_TOKEN in environment variables.');
}
if (!process.env.clientId || !process.env.guildId || !process.env.guildId2) {
    throw new Error('Missing clientId or guildId(s) in environment variables.');
}
const guilds = [process.env.guildId, process.env.guildId2];

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

const commands = [];
const listPath = path.join(__dirname, '../', 'listofcs.json');
const listOfCommands = JSON.parse(fs.readFileSync(listPath, 'utf-8'));

for (const [name, description] of Object.entries(listOfCommands)) {
    commands.push(new SlashCommandBuilder().setName(name).setDescription(description).toJSON());
}

// Deploy the commands to the guild
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        for (const guildId of guilds) {
            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.clientId, guildId),
                { body: commands },
            );
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
    } catch (error) {
        console.error(error);
    }
})();