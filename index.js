// @ts-check
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { getDirname } from './utils.js';

import { Client, Collection, Events, GatewayIntentBits } from "discord.js";

class ExtendedClient extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
    }
}

const client = new ExtendedClient({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

const __dirname = getDirname(import.meta.url);

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
console.log("commandFolders: ", commandFolders);

for (const folder of commandFolders) {
    console.log(`Loading commands from ${folder}...`);
    const commandsPath = path.join(foldersPath, folder);
    if (fs.statSync(commandsPath).isDirectory()) {
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const fileUrl = pathToFileURL(filePath).href;
            const command = await import(fileUrl);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}

const prefix = "!";

// Store user scores (session-based)
const scores = new Map();

client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    console.log("input recieved");
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);

    // @ts-ignore
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.log("Command not found");
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!, maybe restart the server?', ephemeral: true });
        } else {
            await interaction.followUp({ content: 'There was a serious error while executing this command!, try checking your code', ephemeral: true });
        }
    }
});
// const { commandName } = interaction;

// if (!client.commands.has(commandName)) return;

// try {
//     await client.commands.get(commandName).execute(interaction);
// } catch (error) {
//     console.error(error);
//     await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
// }
client.on("error", (error) => {
    console.error("Discord client error:", error);
});

client.login(process.env.DISCORD_TOKEN);
