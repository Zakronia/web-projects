let numWords = 0;
let words = [''];
var word = '', category = '';
var nuhUh = 0, countLetters = 0;
var wordArray = [['','']];

// these variables are for the tracking of stats during a session
var wins = 0;
var losses = 0;

async function initialise() {
    // stuff that should be run on page load that aren't in the endGame() function
    let body = document.getElementsByClassName('body_part');
    for (var part of body)
        part.classList.add('hidden');
    document.getElementById('category').classList.add('hidden');
    
    // parsing the wordbank for usage by the game
    let response = await fetch('hangman/wordbank.txt');
    let data = await response.text();
    wordArray = data.trim().replaceAll('\r','').split('\n');
    for (i = 0; i < wordArray.length; i++)
        wordArray[i] = wordArray[i].split(",");
    words = wordArray;
}

function filterWordBank() {
    let inputs = document.getElementById('setCategories').getElementsByTagName('input');
    words = []
    for (const input of inputs) {
        id = input.id.toString();
        if (input.checked) {
            if (input.id == 'all') {
                words = wordArray;
                break;
            }
            words = words.concat(wordArray.filter((k) => k[1] == id));
        }
    }
    numWords = words.length;
}

function startGame() {   
    // 'randomly' select the word from the word bank
    filterWordBank();
    const table = document.getElementById('wordrow');
    let index = Math.floor(Math.random() * numWords);
    word = words[index]['0'];
    category = words[index]['1'];
    word = word.toUpperCase();
    console.log(word);

    // resetting anything that needs to be reset between rounds
    table.innerHTML = '';
    const buttons = document.getElementsByTagName('button');
    for (const button of buttons) {
        button.disabled = false;
        button.classList.remove('hidden','guessedNuhUh','guessedYuhHuh');
    }
    document.getElementById('gameStatus').classList.add('hidden');
    document.getElementById('hangyThing').classList.remove('hidden');
    let body = document.getElementsByClassName('body_part');
    for (var part of body)
        part.classList.add('hidden');
    countLetters = 0;

    // create the blank spaces for the letters
    for (i = 0; i < word.length; i++) {
        const cell = table.insertCell();
        if (word.charAt(i) === ' ')
            cell.innerHTML = '<pre>   </pre>';
        else if (word.charAt(i) === '\'')
            cell.innerHTML = ' \' ';
        else {
            cell.innerHTML = '__';
            countLetters++;
        }
        cell.id = 'cell' + i;
    }
    
    // print the category to the webpage
    for (var i = 0; i < category.length; i++)
        if (category.substring(i, i+1) === '_')
            category = category.substring(0, i) + ' ' + category.substring(i+1);
    document.getElementById('catName').innerHTML = category;
    document.getElementById('category').classList.remove('hidden');
}

function guessLetter(letter, button) {
    let perchance = false;
    document.getElementById(button).disabled = true;
    let hangman = document.getElementById('hangman-lines');

    for (i = 0; i < word.length; i++) {
        if (letter.toUpperCase() === word.charAt(i)) {
            document.getElementById('cell' + i).innerHTML = letter;
            perchance = true;
            document.getElementById(button).classList.add('guessedYuhHuh');
            countLetters--;
        }
    }

    if (!perchance) {
        nuhUh++;
        document.getElementById(button).classList.add('guessedNuhUh');
        document.getElementsByClassName('line')[nuhUh].classList.remove('hidden');
    }

    console.log(countLetters + ' ' + nuhUh);
    if (nuhUh >= 6) {
        endGame(0);
    }

    if (countLetters == 0) {
        endGame(1);
    }
}

function endGame(gameStatus) {
    const buttons = document.getElementsByClassName('guessButton');
    var wordrow = document.getElementById('wordrow');

    for (const button of buttons) {
        button.disabled = true;
        button.classList.add('hidden');
        button.classList.remove('guessedYuhHuh','guessedNuhUh');
    }

    for (let i = 0; i < word.length; i++) {
        var cell = document.getElementById('cell' + i);
        if (cell.innerHTML = '__')
            cell.innerHTML = word.charAt(i);
    }

    if (gameStatus == 0) {
        losses++;
        document.getElementById('printGameStatus').innerHTML = 'You didn\'t get the word in time, better luck next time\!';
    }

    if (gameStatus == 1) {
        wins++;
        document.getElementById('printGameStatus').innerHTML = 'Congratulations, you got the word\!';
    }

    updateStats();

    document.getElementById('gameStatus').classList.remove('hidden');
    nuhUh = 0;
}

function updateStats() {
    document.getElementById('wins').innerHTML = wins;
    document.getElementById('losses').innerHTML = losses;
}