let gameBoard = document.querySelector("#gameBoard")
let timerValue = document.querySelector("#timerValueHolder")
let startButton = document.querySelector("#startButton")
let gameMovesHolder = document.querySelector("#gameMovesHolder")
let gameTitle = document.querySelector("#gameTitle")
let numbersArray = []
let interval = 0;
let cardsFound = 0;
let cardIsFlipped = false;
let disableBoard = false;
let gameStarted = false;
let card, cardText, gameArray, shuffledArray, firstCard, secondCard, currentCard;
const gameStatements = {
    winStatement: "Congrats! You Won the Game 😁",
    loseStatement: "Oops! You Lost the Game 😟",
    startButtonHolder: "REPLAY"
}

//create the game board
const createGameBoard = () => {
    for (let i = 0; i < 20; i++) {
        card = document.createElement("div");
        cardText = document.createTextNode("")
        card.classList.add("card", "card-front")
        gameBoard.appendChild(card);
    }
}


//generate random numbers
const generateRandomNumbersArray = array => {
    while (array.length < 10) {
        var num = Math.floor(Math.random() * 30) + 1
        if (array.indexOf(num) === -1) array.push(num)
    }
    gameArray = [...array, ...array]
    return gameArray;
}

//shuffling the array
const shuffleArray = array => {
    let arrayLength = array.length, randomIndex;
    while (arrayLength != 0) {
        randomIndex = Math.floor(Math.random() * arrayLength);
        arrayLength--;
        [array[arrayLength], array[randomIndex]] = [array[randomIndex], array[arrayLength]]
    }
    shuffledArray = array;
    return shuffledArray
}

//Mapping the numbers into cards
const fillCards = (numberArray, cardArray) => {
    let i = 0;
    numberArray.map(num => {
        cardArray.children[i].innerHTML = num;
        i++;
    })
}

//Game start function
const startGame = () => {
    if (!gameStarted) {
        timer();
        return;
    }
    window.location.reload();
}

startButton.addEventListener("click", () => {
    startGame();
    gameStarted = true;
})

//timer function
const timer = () => {
    clearInterval(interval);
    interval = setInterval(() => {
        timerValueHolder.textContent++;
    }, 1000)
    startButton.innerHTML = gameStatements.startButtonHolder;
}

//Flipping the cards on click and reverting back
const flipCards = () => {
    document.querySelectorAll(".card").forEach(element => {
        element.addEventListener("click", (event) => {
            if (gameStarted) {
                currentCard = event.target;
                //In case of cards gets opened before the other two clicked card gets closed
                if (disableBoard) return;
                //In order to prevent double clicks
                if (currentCard === firstCard) return;
                currentCard.classList.remove("card-front")

                if (!cardIsFlipped) {
                    firstCard = currentCard;
                    cardIsFlipped = true;
                    return;
                }
            }
            secondCard = currentCard;
            checkForMatch();
        })
    });
}

//to check for card matches
const checkForMatch = () => {
    firstCard.textContent === secondCard.textContent ? foundCards() : unflipCards();
    gameMovesHolder.textContent--;
    if (parseInt(gameMovesHolder.textContent) === 0) gameResult(gameStatements.loseStatement)
}

const foundCards = () => {
    firstCard.removeEventListener("click", flipCards);
    secondCard.removeEventListener("click", flipCards);
    cardsFound++;
    if (cardsFound === 10) gameResult(gameStatements.winStatement)
    resetBoard();
}

const unflipCards = () => {
    disableBoard = true;
    setTimeout(() => {
        firstCard.classList.add("card-front");
        secondCard.classList.add("card-front");
        resetBoard();
    }, 1000);

}

//result of the game
const gameResult = result => {
    gameTitle.innerHTML = result;
    gameStarted = false;
    clearInterval(interval)
}

//Resetting the board
const resetBoard = () => {
    [cardIsFlipped, disableBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

//Rendering functions
window.addEventListener("load", (event) => {
    event.preventDefault()
    createGameBoard()
    generateRandomNumbersArray(numbersArray)
    shuffleArray(gameArray)
    fillCards(shuffledArray, gameBoard)
    flipCards();
})


//disabling  the selection of elements
const disableSelect = (e) => {
    return false
}
document.onselectstart = disableSelect
document.onmousedown = disableSelect
