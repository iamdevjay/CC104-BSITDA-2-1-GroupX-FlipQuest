var correctPairs = [
  [1, 2], [2, 1],
  [3, 4], [4, 3],
  [5, 6], [6, 5],
  [7, 8], [8, 7],
  [9, 10], [10, 9],
  [11, 12], [12, 11],
  [13, 14], [14, 13],
  [15, 16], [16, 15],
  [17, 18], [18, 17],
  [19, 20], [20, 19],
  [21, 22], [22, 21],
  [23, 24], [24, 23]
];
// ohh yeah pede palitan yung value for image location to display
var cards = [
  { name: "card1", value: 1, flipped: false },
  { name: "card2", value: 2, flipped: false },
  { name: "card3", value: 3, flipped: false },
  { name: "card4", value: 4, flipped: false },
  { name: "card5", value: 5, flipped: false },
  { name: "card6", value: 6, flipped: false },
  { name: "card7", value: 7, flipped: false },
  { name: "card8", value: 8, flipped: false },
  { name: "card9", value: 9, flipped: false },
  { name: "card10", value: 10, flipped: false },
  { name: "card11", value: 11, flipped: false },
  { name: "card12", value: 12, flipped: false },
  { name: "card13", value: 13, flipped: false },
  { name: "card14", value: 14, flipped: false },
  { name: "card15", value: 15, flipped: false },
  { name: "card16", value: 16, flipped: false },
  { name: "card17", value: 17, flipped: false },
  { name: "card18", value: 18, flipped: false },
  { name: "card19", value: 19, flipped: false },
  { name: "card20", value: 20, flipped: false },
  { name: "card21", value: 21, flipped: false },
  { name: "card22", value: 22, flipped: false },
  { name: "card23", value: 23, flipped: false },
  { name: "card24", value: 24, flipped: false }
];

//para sa mga tapos nang cards
var matchedCards = [];

//count lang then default na gamemode 6
var correct = 0;
var fail = 0;
var gameMode = 6;

//unang click
var firstCard = null;



var canClick = true;

//check if pair,   need 2 input
function isPair(firstNumber, secondNumber) 
{
  for (var i = 0; i < correctPairs.length; i++) 
    {
    if (correctPairs[i][0] === firstNumber && correctPairs[i][1] === secondNumber) 
        {
        return true;
        }
    }

  return false;
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

  $("#" + card.name)
    .addClass("is-flipped")
    .find(".card-front")
    //.text(card.value);
}


// unflip cards down
function flipCardDown(card) 
{
  card.flipped = false;

  $("#" + card.name)
    .removeClass("is-flipped")
    .find(".card-front")
    //.text("");
}




$("#play-button").on("click", function () {
  // hanapiin yung game mode dto

  // Reset the game for the selected mode.
  correct = 0;
  fail = 0;
  firstCard = null;
  matchedCards = [];
  canClick = true;

  $("#matched-pairs").text("0");
  $("#game-message").text("Find all the matching pairs!");


});