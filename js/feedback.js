function showGameMessage(message) {
    $('#game-message-container').html(`<p class="alert-message">${message}</p>`);
}

function clearGameMessage() {
    $('#game-message-container').empty();
}

function updateStatsDisplay(stats) {
    const moves = stats.moves !== undefined ? stats.moves : 0;
    const combo = stats.combo !== undefined ? stats.combo : 0;
    const matchedPairs = stats.matchedPairs !== undefined ? stats.matchedPairs : 0;
    const totalPairs = stats.totalPairs !== undefined ? stats.totalPairs : 6;

    $('#moves-counter').text(moves);
    $('#combo-counter').text(combo);
    $('#matched-pairs-counter').text(`${matchedPairs}/${totalPairs}`);
}

function showGameResult(result) {
    let messageHtml = '';
    
    if (result === 'victory') {
        messageHtml = `<div class="result-box victory">🎉 Victory! You successfully matched all pairs!</div>`;
    } else if (result === 'game-over') {
        messageHtml = `<div class="result-box game-over">⏳ Time Expires! Game Over. Try again!</div>`;
    } else {
        messageHtml = `<div class="result-box">${result}</div>`;
    }

    $('#game-result-container').html(messageHtml);
}
