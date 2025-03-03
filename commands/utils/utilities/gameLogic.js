function determineWinner(playerMove, botMove) {
    if (playerMove === botMove) return "tie";

    const winConditions = {
        rock: "scissors",
        paper: "rock",
        scissors: "paper",
    };

    return winConditions[playerMove] === botMove ? "win" : "lose";
}

export {
    determineWinner,
};
