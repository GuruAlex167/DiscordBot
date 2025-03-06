// @ts-check
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { getDirname } from './utils.js';
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";

class ExtendedClient extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
    }
}

const client = new ExtendedClient({
    intents: [GatewayIntentBits.Guilds],
});

const __dirname = getDirname(import.meta.url);

// dynamically add commands to the client from listofcs.json
const listPath = path.join(__dirname, 'listofcs.json');
const listOfCommands = JSON.parse(fs.readFileSync(listPath, 'utf-8'));
for (const [name, response] of Object.entries(listOfCommands)) {
    client.commands.set(name, response);
}

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
console.log("commandFolders: ", commandFolders);

client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    console.log("input recieved");

    if (!interaction.isChatInputCommand()) return;

    console.log(interaction);
    const commandName = interaction.commandName;
    if (!client.commands.has(commandName)) {
        console.log(`Command: ${commandName} not found`);
        return;
    }

    try {
        await interaction.reply(client.commands.get(commandName));
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!, maybe restart the server?', ephemeral: true });
        } else {
            await interaction.followUp({ content: 'There was a serious error while executing this command!, try checking your code', ephemeral: true });
        }
    }
});

client.on("error", (error) => {
    console.error("Discord client error: ", error);
});

client.login(process.env.DISCORD_TOKEN);
