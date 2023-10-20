// SETUP: /////////////////////////////////////////////

let numShown;
let isMatch;
let guesses = 0;
let bestScore;
let twoCards = [];
let timer;
let allImageUrls = new Array();
let maxImages = 20;
let urlString = "";
let curTotalPairs;
let curTotalCards;
let timerRunning = false;

// LISTENERS: /////////////////////////////////////////////

// when page loads:
$(document).ready(initialSetup);

// FUNCTIONS: ////////////////////////////////////////////

/**
 * Sets up page layout upon initial load.
 * @returns allImageUrls Array of strings with img URLs.
 */
function initialSetup() { //to be executed on page load
    // creates button elements
    createDashboard();

    // create tiles
    createMCItem();

    // Every time user clicks on a tile:
    $(".cardToFlip").on("click", { "thisCard": this }, userChoice); //END: on card click

    //New Game Button is clicked:
    $("#newGameBtn").click(newGameSetup);

    // how many pairs in the game
    curTotalPairs = 6; //BONUS: this could be decided by user
    curTotalCards = 2 * curTotalPairs;

    // fill array with img urls
    for (let i = 1; i <= maxImages; i++) {
        urlString = "https://picsum.photos/seed/" + i + "/240/320"; //specified size
        allImageUrls.push(urlString);
    }

    //set up new game
    newGameSetup();

    return allImageUrls;

}; //END: fn initialSetup

/**
 * Takes an array of URLs and reorders them randomly.
 * @param {Array} cardUrls Array of strings.
 * @returns cardUrls Array of strings.
 */
function shuffleCards(cardUrls) {
    let randIndex;
    let curIndex = cardUrls.length
    let temp;

    // cycle through all items in the array
    while (curIndex > 0) {

        // Pick a random element.
        randIndex = Math.floor(Math.random() * curIndex);
        curIndex--;

        // random element swaps places with current element
        temp = cardUrls[curIndex];
        cardUrls[curIndex] = cardUrls[randIndex];
        cardUrls[randIndex] = temp;
    }

    return cardUrls;

}; //END: fn shuffleCards

/**
 * Compares two card elements' src attributes.
 * @param {Array} cards A two-item array of card HTML elements.
 * @returns boolean Indicating whether the URLs match or not.
 */
function compareCards(cards) {

    // compare the src attributes of each card element
    if ($(cards[0]).attr("src") == $(cards[1]).attr("src")) {
        return true; // match
    } else {
        return false; // no match
    }

}; //END: fn compareCards

/**
 * Game Over: Show "Play Again" button, and display results.
 * @param {number} guesses The integer number of guesses.
 */
function gameOver(guesses) {

    // display Game Over text
    $("#subHeaderContent").text("Game Over: You won after " + guesses + " guesses!");

    // see if best score should be updated
    checkBestScore(guesses);

    //show newgame button
    $("#newGameBtn").css('visibility', 'visible');

}; //END: fn gameOver


/**
 * Check current score against bestScore, and update bestScore if necessary.
 * @param {number} guesses The integer number of guesses.
 */
function checkBestScore(guesses) {

    //check if current score is lower (or if it's the first)
    if (guesses < bestScore || isNaN(bestScore)) {

        //set new best
        bestScore = guesses;

        // set elem to show new best
        $("#bestScore").text(bestScore);

    }

}; //END: fn checkBestScore

/**
 * Clears a completed game (if applicable) and sets up a new game
 * Called by initialSetup() and the "Play Again" button.
 */
function newGameSetup() {

    // clear results and scores
    guesses = 0;

    $("#numGuesses").html("--");
    $("#result").html("");

    // flip all cards face-down
    $(".showCard").removeClass("showCard");
    $(".lockCard").removeClass("lockCard");

    // hide newgame button
    $("#newGameBtn").css('visibility', 'hidden');

    // generate random indexes
    let randomIndexes = [];
    let randomIndex;

    // create array of random indexes (to choose images)
    for (i = 0; i < curTotalPairs; i++) {

        // choose a unique random index
        do {

            randomIndex = Math.floor(Math.random() * allImageUrls.length);

        } while (randomIndexes.indexOf(randomIndex) >= 0); // while random index is already in array

        // add unique i to array
        randomIndexes.push(randomIndex);

    } //END: create rand index array

    // create array of card face images -- two of each image
    let curFaceImages = [];
    let rImage;

    for (let j in randomIndexes) {

        //url at the random index
        rImage = allImageUrls[randomIndexes[j]];

        // add to array twice -- two of each card in deck
        curFaceImages.push(rImage);
        curFaceImages.push(rImage);

    }

    // randomly shuffle the array of current images 
    let shuffledFaceImages = shuffleCards(curFaceImages);

    // place images into their tiles
    for (let i in shuffledFaceImages) {

        $("#face" + i).attr("src", shuffledFaceImages[i]);

    }

    // set subheader text
    $("#subHeaderContent").text("Pick a card, any card...");

}; //END: fn newGameSetup

/**
 * Responds to user's click.
 * Determines where the click occurred, the status of the element (card shown or hid).
 * Validates the click against required states to prevent hacks or unintended actions.
 * 
 * @param {Event} clickedCard All data from the click event.
 * @returns 
 */
function userChoice(clickedCard) {
    // Intent: refer to the div with the .cardToFlip class

    // Validate click -- if invalid, do nothing 
    if (timerRunning) { //cards currently waiting to flip face-down
        //console.log("timer: ABORT"); 
        return;

    } else if ($(".showCard").length >= 2) { //two or more non-locked cards are already revealed
        //console.log("too many cards: ABORT");
        return;

    } else if ($(clickedCard.currentTarget).hasClass("showCard")) { // this 2nd click occurred on same new card
        //console.log("clicked shown card: ABORT");
        return;

    } else if ($(clickedCard.currentTarget).hasClass("lockCard")) { // click occurred on a locked/revealed card
        //console.log("clicked locked card: ABORT");
        return;

    }

    // reset subheader text
    $("#subHeaderContent").text("Pick a card, any card...");

    // add .showCard class to div 
    $(this).addClass("showCard");

    // counts shown cards
    numShown = $(".showCard").length;

    // check if 2 cards are revealed
    if (numShown >= 2) { // 2 are shown

        // increase guesses and update element
        guesses++;
        $("#numGuesses").text(guesses);

        //array of the img elements that are descendants of elems w/ .showCard class
        twoCards = $(".showCard").find(".cardFace").find("img");

        // compare the cards
        isMatch = compareCards(twoCards);

        // check if it"s a match
        if (!isMatch) {// not a match

            // indicate MISS to user
            output("Not A Match! Try Again.");
            //$("#subHeaderContent").text("Not A Match! Try Again.");

            //indicate timer has started
            timerRunning = true;

            // DELAY: for readability
            timer = setTimeout(function () {

                //remove .showCard class
                $(".showCard").removeClass("showCard");

                //indicate timer has stopped
                timerRunning = false;

            }, 1300); //END: TIMER

        } else { // it"s a match!

            // indicate HIT to user
            output("It's A Match!!");
            //$("#subHeaderContent").text("It's A Match!!");

            //lock the cards in shown state
            $(".showCard").addClass("lockCard");

            //remove .showCard class
            $(".showCard").removeClass("showCard");

            // Check if unshown tiles remain -- if so, game continues
            if ($(".cardToFlip").length == $(".lockCard").length) { //if all cards are locked -- game over

                // cancel timer so that the text doesn't change
                clearTimeout(timer);

                // GAME OVER 
                gameOver(guesses);

            } //END:check GameOver

        }//END: check if match

    }//END: check 2 shown

}//END: fn clickedCard

/**
 * Standardized way to print string to the subheader text.
 * @param {string} str String to be outputted.
 */
function output(str) {
    $("#subHeaderContent").html(str);
}

/**
 * Sets up the elements that contain the game's instructions for user.
 */
function createDashboard() {
    let dashboard = document.getElementById("dashboard");

    // result
    let result = document.createElement("div");
    result.setAttribute("id", "result");
    dashboard.appendChild(result);

    // create & modify instructions' parent element
    let instruction = document.createElement("div");
    instruction.setAttribute("id", "instruction");

    // instructions child elements
    instruction.innerHTML = "<h3 style='text-align: center;'>Instructions</h3>" +
        "<ul>" +
        "<li>On each turn, you can flip over two cards to reveal their front pictures. </li>" +
        "<li>If the pictures match, the cards will stay revealed. </li>" +
        "<li>If the pictures don't match, they will be flipped back face-down. </li>" +
        "<li>Continue flipping two cards at a time, until you find all the matching pictures.</li>" +
        "<li>Your score is the number of tries it takes to find every pair ... so aim for a lower number!</li>" +
        "<li>See if you can beat your best score! Good Luck!!</li>" +
        "</ul>";

    // add instructions to parent element
    dashboard.appendChild(instruction);

}//END: createDashboard()

/**
 * Creates each card's unique element tree. 
 * THIS IS SCALABLE. If in the future, a form input is provided, the user could
 *  specify # of pairs (difficulty) and this loop would iterate accorind to that input.
 */
function createMCItem() {

    // get the middle column containing element
    let colMid = document.getElementById("tile-container");

    // create desired number of cards, and all elements required for each.
    for (i = 0; i < 12; i++) {

        let midColItem = document.createElement("div");
        midColItem.setAttribute("class", "middle-column-item");
        midColItem.innerHTML = "<article class=\"cardHolder\">" +
            "<div class=\"cardToFlip\">" +
            "<div class=\"cardToFlip-inner\">" +
            "<div class=\"cardBack\">" +
            "<img class=\"cardImg\" src=\"https://picsum.photos/240/320?random=1\" alt=\"card back image\">" +
            "</div>" +
            "<div class=\"cardFace\">" +
            "<img class=\"cardImg\" id=\"face" + i + "\" src=\"https://picsum.photos/240/320?random=8\" alt=\"card face image\">" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</article>";
        // picsum photo url is hardcoded, so that the card back stays the same every new game (but changes upon reload)

        //add card to middle column
        colMid.appendChild(midColItem);

    }//END: for loop - each card

}//END: fn createMCItem()
