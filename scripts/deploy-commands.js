//@ts-check
import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'node:fs';
import path from 'node:path';
import { getDirname } from '../utils.js';

const commands = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = getDirname(import.meta.url);

// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, '../', 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const fileUrl = pathToFileURL(filePath).href;
        const command = await import(fileUrl);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Construct and prepare an instance of the REST module
if (!process.env.DISCORD_TOKEN) {
    throw new Error('Missing DISCORD_TOKEN in environment variables.');
}
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        if (!process.env.clientId || !process.env.guildId) {
            throw new Error('Missing clientId or guildId in environment variables.');
        }

        const data = /** @type {Array<Object>} */ (await rest.put(
            Routes.applicationGuildCommands(process.env.clientId, process.env.guildId),
            { body: commands },
        ));
        //second set
        if (!process.env.clientId || !process.env.guildId2) {
            throw new Error('Missing clientId or guildId2 in environment variables.');
        }
        const data2 = /** @type {Array<Object>} */ (await rest.put(
            Routes.applicationGuildCommands(process.env.clientId, process.env.guildId2),
            { body: commands },
        ));


        console.log(`Successfully reloaded ${data.length} application (/) commands.`);

        console.log(`Successfully reloaded ${data2.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();