
/* ==========================================
   1. GET FLIPQUEST CARD SYMBOLS
========================================== */

function getCardSymbols() {

    return [
        "✦", "◆", "◈", "⬢",
        "⚡", "☽", "☼", "♛",
        "🗝", "🛡", "👁", "✧"
    ];

}


/* ==========================================
   2. CREATE MATCHING CARD PAIRS
========================================== */

function createDeck(pairCount) {

    if (![6, 9, 12].includes(pairCount)) {
        throw new Error("Choose 6, 9, or 12 pairs.");
    }

    let symbols = getCardSymbols();

    let deck = [];


    for (let i = 0; i < pairCount; i++) {

        let firstValue = i * 2 + 1;

        let secondValue = firstValue + 1;


        deck.push({
            name: "card" + firstValue,
            value: firstValue,
            symbol: symbols[i],
            flipped: false
        });


        deck.push({
            name: "card" + secondValue,
            value: secondValue,
            symbol: symbols[i],
            flipped: false
        });

    }


    return deck;

}





/* ==========================================
   3. SHUFFLE CARDS USING FISHER-YATES
========================================== */

function shuffleDeck(deck) {

    for (let i = deck.length - 1; i > 0; i--) {

        let randomIndex = Math.floor(Math.random() * (i + 1));

        let temporaryCard = deck[i];


        deck[i] = deck[randomIndex];

        deck[randomIndex] = temporaryCard;

    }


    // Update names based on new card positions.
    // Keep values unchanged so pairs still match.

    deck.forEach(function(card, index) {

        card.name = "card" + (index + 1);

        card.flipped = false;

    });


    return deck;

}





/* ==========================================
   4. DISPLAY CARD SYMBOLS USING JQUERY
========================================== */

function displayDeck(deck) {

    $(".card").each(function(index) {

        let cardElement = $(this);

        let cardData = deck[index];


        // Remove previous card states

        cardElement.removeClass("is-flipped is-matched");


        if (cardData) {

            // Put the matching symbol on the card front

            cardElement.find(".card-front").text(cardData.symbol);

            cardElement.prop("disabled", false);

        } else {

            // Disable cards not used in this difficulty

            cardElement.find(".card-front").text("");

            cardElement.prop("disabled", true);

        }

    });

}





/* ==========================================
   5. VALIDATE THE CARD DECK
========================================== */

function validateDeck(deck) {

    if (!Array.isArray(deck) ||
        ![12, 18, 24].includes(deck.length)) {

        return false;

    }


    let symbols = getCardSymbols();

    let usedValues = new Set();

    let symbolCounts = {};


    for (let i = 0; i < deck.length; i++) {

        let card = deck[i];


        // Check the card's name

        if (!card || card.name !== "card" + (i + 1)) {
            return false;
        }


        // Check for invalid or repeated values

        if (!Number.isInteger(card.value) ||
            card.value < 1 ||
            card.value > deck.length ||
            usedValues.has(card.value)) {

            return false;

        }


        usedValues.add(card.value);


        // Check whether the card has the correct symbol

        let symbolIndex = Math.floor((card.value - 1) / 2);

        if (card.symbol !== symbols[symbolIndex]) {
            return false;
        }


        // Count appearances of every symbol

        symbolCounts[card.symbol] =
            (symbolCounts[card.symbol] || 0) + 1;

    }


    // Every symbol must appear exactly twice

    return Object.keys(symbolCounts).length === deck.length / 2 &&
           Object.values(symbolCounts).every(function(count) {

               return count === 2;

           });

}
