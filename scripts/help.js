export const name = 'help';
export const description = 'Display help information';
export async function execute(message) {
    const helpMessage = [
        '**Rock Paper Scissors Bot - Commands**',
        '',
        '`!rps <move>` - Play Rock Paper Scissors',
        'Available moves: rock, paper, scissors',
        'Example: !rps rock',
        '',
        '`!help` - Show this help message',
        '',
        'Your scores are tracked during the bot\'s session!',
    ].join('\n');

    message.reply(helpMessage);
}
