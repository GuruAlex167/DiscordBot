import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

function getDirname(importMetaUrl) {
    const __filename = fileURLToPath(importMetaUrl);
    return path.dirname(__filename);
}

// read the json from listofcs.json
// where key ->commandName and value->description
// then create files in the 'my_commands' folder
// using the name of the command as the file name
// then add the snippet to the file

const dirname = getDirname(import.meta.url);
const jsonPath = path.join(dirname, "../listofcs.json");
const commandsDir = path.join(dirname, "../commands/my_commands");

const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

for (const [commandName, description] of Object.entries(jsonData)) {
    const commandFilePath = path.join(commandsDir, `${commandName}.js`);

    let commandContent = `import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
    .setName('${commandName}')
    .setDescription('Replies with ${description}!');

export async function execute(interaction) {
    await interaction.reply('${description}!');
}`
    fs.writeFileSync(commandFilePath, commandContent);
}