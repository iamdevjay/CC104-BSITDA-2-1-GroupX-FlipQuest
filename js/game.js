
 // var correctPairs = [
 //   [1, 2], [2, 1],
 //   [3, 4], [4, 3],
 //   [5, 6], [6, 5],
 //   [7, 8], [8, 7],
 //   [9, 10], [10, 9],
 //   [11, 12], [12, 11],
 //   [13, 14], [14, 13],
 //   [15, 16], [16, 15],
 //   [17, 18], [18, 17],
 //   [19, 20], [20, 19],
 //   [21, 22], [22, 21],
 //   [23, 24], [24, 23]
 // ];
 // // ohh yeah pede palitan yung value for image location to display
 // var cards = [
 //   { name: "card1", value: 1, flipped: false },
 //   { name: "card2", value: 2, flipped: false },
 //   { name: "card3", value: 3, flipped: false },
 //   { name: "card4", value: 4, flipped: false },
 //   { name: "card5", value: 5, flipped: false },
 //   { name: "card6", value: 6, flipped: false },
 //   { name: "card7", value: 7, flipped: false },
 //   { name: "card8", value: 8, flipped: false },
 //   { name: "card9", value: 9, flipped: false },
 //   { name: "card10", value: 10, flipped: false },
 //   { name: "card11", value: 11, flipped: false },
 //   { name: "card12", value: 12, flipped: false },
 //   { name: "card13", value: 13, flipped: false },
 //   { name: "card14", value: 14, flipped: false },
 //   { name: "card15", value: 15, flipped: false },
 //   { name: "card16", value: 16, flipped: false },
 //   { name: "card17", value: 17, flipped: false },
 //   { name: "card18", value: 18, flipped: false },
 //   { name: "card19", value: 19, flipped: false },
 //   { name: "card20", value: 20, flipped: false },
 //   { name: "card21", value: 21, flipped: false },
 //   { name: "card22", value: 22, flipped: false },
 //   { name: "card23", value: 23, flipped: false },
 //   { name: "card24", value: 24, flipped: false }
 // ];
 // i asked ai to do this shi
 // startGame starts a new game for the chosen difficulty, resets the game values, creates and shuffles the deck, and updates the page.
 // isPair checks whether two card numbers are listed as a matching pair.
 // findCard looks through the cards array and returns the card with the matching name.
 // flipCardUp turns a card face up and marks it as flipped.
 // flipCardDown turns a card face down and marks it as not flipped.
 // cardsMatch checks whether two different cards have the same symbol.
 // CardClick handles a card selection: it flips the card, saves the first card, checks the second card, updates the score, and flips unmatched cards back.
 // endGame stops the game and displays the win or time-up message.
 // restartGame restarts the game by triggering the Play button.





//para sa mgacards
var cards = [];
var deck = [];
var matchedCards = []; // dagdag: para sa mga tapos nang cards

//count lang then default na gamemode 6
var correct = 0;
var fail = 0;
var gameMode = 6;
var moves = 0;
var combo = 0;

//unang click
var firstCard = null;
var canClick = true;

//dre ===============
var hideCardsTimer;





// =====dre ito hanap mo ====================================
function startGame(difficulty)
{
    if (difficulty === "easy")
    {
        gameMode = 6;
    }
    else if (difficulty === "medium")
    {
        gameMode = 9;
    }
    else
    {
        gameMode = 12;
    }

    // good daw na i clear for next game
    clearTimeout(hideCardsTimer);
    hideCardsTimer = null;

    // Reset
    correct = 0;
    fail = 0;
    firstCard = null;
    canClick = true;
    moves = 0;
    matchedCards = [];
    combo = 0;

    //==== displaay cards  from dick.js
    deck = createDeck(gameMode);
    deck = shuffleDeck(deck);
    cards = deck; // dagdag: para same cards ang gamit ng findCard at game
    displayDeck(deck);

    // reset sa page
    $("#moves").text("0");
    $("#matched-pairs").text(correct);
    $("#total-pairs").text(gameMode);
    $("#game-message").text("Find all the matching pairs!");
    $("#combo").text("x0");
}





//check if pair,   need 2 input
function isPair(firstNumber, secondNumber)
{
    // dagdag: since naka-comment na ang old correctPairs array
    return firstNumber !== secondNumber &&
           Math.floor((firstNumber - 1) / 2) === Math.floor((secondNumber - 1) / 2);
}





//look for card locarion int the cards array kung gamit ng html id
function findCard(cardName)
{
    for (var i = 0; i < cards.length; i++)
    {
        if (cards[i].name === cardName)
        {
            return cards[i];
        }
    }

    return null;
}





//to flip cards  up
function flipCardUp(card)
{
    card.flipped = true;
    $("#" + card.name).addClass("is-flipped");
}





// unflip cards down
function flipCardDown(card)
{
    card.flipped = false;
    $("#" + card.name).removeClass("is-flipped");
}





function cardsMatch(c1, c2)
{
    return c1 !== c2 && c1.symbol === c2.symbol; // ai told me simbol and val is different
}





// pinalitan lang name para match sa timer.js ni Andrei
function handleCardClick(index)
{
    var clickedCard = deck[index];

    if (canClick === false)
    {
        return;
    }

    if (!clickedCard)
    {
        return;
    }

    if (clickedCard.flipped === true)
    {
        return;
    }

    if (matchedCards.indexOf(clickedCard) !== -1)
    {
        return;
    }

    flipCardUp(clickedCard);


    //this savess teh first card
    if (firstCard === null)
    {
        firstCard = clickedCard;
        return;
    }


    // second -------------------------
    var secondCard = clickedCard;

    moves++;
    $("#moves").text(moves);


    if (cardsMatch(firstCard, secondCard))
    {
        matchedCards.push(firstCard, secondCard);

        $("#" + firstCard.name).addClass("is-matched");
        $("#" + secondCard.name).addClass("is-matched");

        correct++;

        combo++;
        $("#matched-pairs").text(correct);
        $("#combo").text("x" + combo);
        $("#game-message").text("Match!");

        firstCard = null;

        if (correct === gameMode)
        {
            endGame("win");
        }
    }
    else
    {
        fail++;

        //here combo
        combo = 0;
        $("#combo").text("x" + combo);
        $("#game-message").text("No match...");

        var cardToTurnBack = firstCard;
        firstCard = null;
        canClick = false; // lock the board while the cards are showing

        hideCardsTimer = setTimeout(function ()
        {
            flipCardDown(cardToTurnBack);
            flipCardDown(secondCard);

            canClick = true;
            hideCardsTimer = null;

            $("#game-message").text("Find all the matching pairs!");

        }, 800);
    }
}





// ---------- END / RESTART ----------
// reason is "win" or "timeout" (timer.js calls endGame('timeout'))
function endGame(reason)
{
    canClick = false;

    // dagdag: huwag na i-flip back kapag tapos na ang game
    clearTimeout(hideCardsTimer);
    hideCardsTimer = null;

    if (typeof stopTimer === "function")
    {
        stopTimer();
    }

    if (reason === "win")
    {
        $("#game-message").text("You win! Finished in " + moves + " moves.");
    }
    else
    {
        $("#game-message").text("Time is up!");
    }
}





// reset nahh reuse
function restartGame()
{
    $("#play-button").trigger("click");
}
