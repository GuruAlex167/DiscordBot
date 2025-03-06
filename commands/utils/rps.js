import { determineWinner } from './utilities/gameLogic.js';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play Rock Paper Scissors! How fun!');

export async function execute(message, args, scores) {
    const validMoves = ['rock', 'paper', 'scissors'];
    const playerMove = args[0]?.toLowerCase();

    if (!playerMove || !validMoves.includes(playerMove)) {
        return message.reply(
            'Please provide a valid move: rock, paper, or scissors',
        );
    }

    // Generate bot's move
    const botMove = validMoves[Math.floor(Math.random() * validMoves.length)];

    // Determine winner
    const result = determineWinner(playerMove, botMove);

    // Update scores
    const userId = message.author.id;
    if (!scores.has(userId)) {
        scores.set(userId, { wins: 0, losses: 0, ties: 0 });
    }

    const userScore = scores.get(userId);
    if (result === 'win') userScore.wins++;
    else if (result === 'lose') userScore.losses++;
    else userScore.ties++;

    // Create response message
    const response = [
        `You chose: ${playerMove}`,
        `I chose: ${botMove}`,
        '',
        result === 'win'
            ? 'You win! 🎉'
            : result === 'lose'
                ? 'I win! 😎'
                : 'It\'s a tie! 🤝',
        '',
        `Your score: Wins: ${userScore.wins} | Losses: ${userScore.losses} | Ties: ${userScore.ties}`,
    ].join('\n');

    message.reply(response);
}
