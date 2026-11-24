# FlipQuest – Memory Matching Game

Subject: CC104 – Data Structures and Algorithms  
Section: BSIT DA 2-1

## About Our Project

FlipQuest is a single-player memory matching game that we developed for our final project in Data Structures and Algorithms. The goal of the game is to find all the matching cards before the time runs out while using as few moves as possible.

We wanted to make our game more interesting than a basic memory game, so we designed it to look like a retro handheld gaming console. We added different difficulty levels, power-ups, music, sound effects, and a scoreboard. While working on this project, we learned how to use arrays, loops, searching, shuffling, and comparison in an actual game.

## Group Members and Contributions

| Group Member | Contribution |
| --- | --- |
| [Victorino A Adobas Jr.] | User interface, HTML and CSS, deck creation, card shuffling, Peek power-up, sfx, and project integration |
| [Andrei de Castro] | Timer, difficulty controls, freeze power up music and support the creator |
| [Justine Jaymark S Rudriguez] | Card matching, game logic, Hint power-up, pause, restart, and music |
| [Jade Cedric S Melido] | Game messages, statistics, result window, best moves,  |

## Game Features

- Three difficulty levels with different card layouts and color themes.
- Randomly shuffled cards every round.
- Timer, time limit, moves, combo, and matched-pair counters.
- Freeze, Hint, and Peek power-ups.
- Pause, resume, restart, and Play Again controls.
- Background music and sound effects with separate controls.
- Victory and Game Over result windows.
- Best-move records for each difficulty using the browser's local storage, when available.
- Support the Creator popup.

## Difficulty Levels

| Difficulty | Cards | Pairs | Time Limit |
| --- | ---: | ---: | ---: |
| Easy | 12 | 6 | 90 seconds |
| Medium | 18 | 9 | 60 seconds |
| Hard | 24 | 12 | 50 seconds |

## How to Play

1. Choose Easy, Medium, or Hard, then press Play.
2. Click a card to reveal its symbol and choose another card to find its match.
3. If both symbols are the same, the cards stay open. If they do not match, they flip back after a short delay.
4. Every attempt to match two cards counts as one move. Matching pairs consecutively increases the combo, while a wrong match resets it.
5. Match all pairs before the time limit reaches zero to win. If the time runs out, the game ends.
6. Press Play Again to start a new round with a newly shuffled deck.

### Power-ups

Each available power-up can only be used once per round.

| Power-up | Description |
| --- | --- |
| Freeze | Temporarily stops the countdown. The duration depends on the difficulty. |
| Hint | After selecting one unmatched card, highlights a row or column where its matching card is located. |
| Peek | Briefly reveals the unmatched cards when no card is currently selected. |

### Game Statistics

- Time: Shows the elapsed time in minutes and seconds.
- Limit: Shows how many seconds are left in the round.
- Moves: Counts the number of attempts to match two cards.
- Combo: Counts consecutive successful matches.
- Pairs: Shows the number of matched pairs out of the total pairs.

## Data Structures Used

### Arrays and Arrays of Objects

We used arrays as the main data structure in our game. The `deck` array stores the cards for the selected difficulty. Each card is represented by an object containing its name, value, symbol, and flipped status.

For example, a card object looks like this:

```javascript
{
    name: "card1",
    value: 1,
    symbol: "✦",
    flipped: false
}
```

We also use the `matchedCards` array to keep track of the cards that have already been matched. This helps us prevent the player from selecting completed pairs again.

### Set and Objects

In our `validateDeck()` function, we use a `Set` to check for duplicate card values and an object to count how many times each symbol appears. This function checks whether a deck has the correct number of cards and exactly two cards for each symbol.

We also use objects such as `difficultyTimes` and `freezeTimes` to store settings for each difficulty.

## Algorithms Used

| Algorithm or Operation | How We Used It |
| --- | --- |
| Fisher–Yates shuffle | We shuffle the deck by swapping each card with a randomly selected card from the remaining unshuffled portion of the array. This makes the card positions different each round. |
| Array traversal | We use loops to create card pairs, update the board, check the deck, and reveal cards during Peek. |
| Searching | We use array searching, including `find()`, to locate the matching card for Hint. |
| Equality comparison | We compare the symbols of two selected cards to determine whether they are a matching pair. |
| Input validation | We check if the selected card exists, is already flipped or matched, or if card selection is temporarily locked. |
| Win detection | We compare the number of matched pairs with the total number of pairs in the selected difficulty. |

## Key Functions

| Function | File | Purpose |
| --- | --- | --- |
| `createDeck()` | `deck.js` | Creates the required number of matching card pairs. |
| `shuffleDeck()` | `deck.js` | Randomizes the positions of the cards using Fisher–Yates. |
| `displayDeck()` | `deck.js` | Displays the shuffled card symbols on the board. |
| `validateDeck()` | `deck.js` | Checks the deck for invalid values, duplicates, and incomplete pairs. |
| `peekCards()` | `deck.js` | Temporarily reveals unmatched cards. |
| `startGame()` | `game.js` | Resets the game state and prepares a fresh deck. |
| `handleCardClick()` | `game.js` | Handles card selection, matching, moves, and combo updates. |
| `cardsMatch()` | `game.js` | Compares the symbols of two different cards. |
| `Hint()` | `game.js` | Searches for the matching card and highlights its row or column. |
| `endGame()` | `game.js` | Ends the round when the player wins or runs out of time. |
| `startTimer()` | `timer.js` | Starts the countdown and checks for a timeout. |
| `updateTimerDisplay()` | `timer.js` | Updates the elapsed time and remaining time on the screen. |
| `freezeTime()` | `timer.js` | Temporarily stops the countdown. |
| `pauseGame()` / `resumeGame()` | `pause.js` | Opens the pause menu and resumes gameplay. |
| `restartGame()` | `game.js`, `pause.js` | Starts a new round using the Play control. |
| `showGameResult()` | `feedback.js` | Displays victory or game-over feedback. |
| `saveBestMoves()` | `feedback.js` | Saves the fewest moves used to win each difficulty. |

## Technologies Used

- HTML5 – game structure
- CSS3 – layout, retro design, themes, and animations
- JavaScript – game logic, data structures, and algorithms
- jQuery – event handling and interface updates
- Git and GitHub – version control and group collaboration
- Visual Studio Code – code editor

## Project Files

| File or Folder | Description |
| --- | --- |
| `index.html` | Main game page and controls |
| `css/` | Game and Support the Creator styles |
| `js/deck.js` | Card data, shuffle, validation, and Peek |
| `js/game.js` | Core gameplay and Hint |
| `js/timer.js` | Timer, controls, and Freeze |
| `js/pause.js` | Pause menu and restart controls |
| `js/sounds.js` | Background music and sound effects |
| `js/feedback.js` | Messages, statistics, and results |
| `js/support.js` | Support popup, music, and GIF animation |
| `js/jquery.min.js` | Local jQuery library |
| `assets/` | Music, images, GIFs, and screenshots |
| `README.md` | Project documentation |

## How to Run the Game

1. Open our [GitHub repository](https://github.com/iamdevjay/CC104-BSITDA-2-1-GroupX-FlipQuest).
2. Click Code, then Download ZIP, or clone the repository using GitHub Desktop.
3. Extract the ZIP file if you downloaded it.
4. Open the project folder and double-click `index.html` to launch the game in a modern web browser.
5. Select a difficulty and press Play.



## Screenshots

### Hard Mode Interface

![FlipQuest hard mode interface](assets/screenshots/flipquest-hard.png)

The screenshot shows our retro console layout with 24 cards, the scoreboard, difficulty selection, and game controls.

screenshot ng game rito pag natapos na----------------------------------------------------------------

## Challenges We Encountered

One challenge we encountered was connecting the timer, game logic, and feedback because we worked on different files and branches. We also had to make sure that a player could not choose a third card while an unmatched pair was still being displayed.

We worked on these problems by coordinating our functions, using a card-selection lock, clearing pending timers when restarting, and reviewing changes before merging them into our repository.

## What We Learned

Making FlipQuest helped us understand that data structures and algorithms are not just concepts we study in class. We were able to use them to organize our cards, randomize their positions, compare values, and manage the game's progress. We also learned the importance of communication, testing, and version control when working on a group project.

## Credits

- Developed by our BSIT DA 2-1 group 5 for CC104 – Data Structures and Algorithms.
- jQuery 3.7.1 – [jQuery](https://jquery.com/) ([license information](https://jquery.org/license/)).
- Pixelify Sans – [Google Fonts](https://fonts.google.com/specimen/Pixelify+Sans).
- Music, images, and GIFs – 

## Group Demonstration

youtube link dito
