var height = 6; // Number of guesses
var width = 5; // Is the length of the word

// The first word will be on the position 0 - 0 ( 0 row, 0 col)
var row = 0; // current guess
var col = 0; // current letter for that attempt

let userWord = '';

var isGameOver = false; 
//var word = "SQUID"; // Current word to guess
const wordleWords = [
  "APPLE", "GRAPE", "CHAIR", "FLAME", "SUGAR", "BRAVE", "CRANE", "SHINY", "PROUD", "SWING",
  "TABLE", "GLOBE", "PIANO", "BLEND", "SHINE", "CLOUD", "FROST", "BRICK", "TRACE", "GHOST",
  "SWEET", "DREAM", "LAUGH", "BEACH", "SMILE", "JUICE", "PLANE", "LIGHT", "BREAD", "SCORE",
  "STORM", "WHALE", "PLANT", "DRIFT", "SPEAK", "SPICE", "HOVER", "BLOOM", "SKATE", "FLOCK",
  "TRUTH", "CRISP", "TRICK", "ZEBRA", "NOBLE", "TRACK", "BLINK", "SHARP", "MATCH", "SPOON",
  "HAPPY",
];

const validWords = [
  "APPLE", "GRAPE", "BRAIN", "CLOUD", "PLANE",
  "CHAIR", "LIGHT", "WATER", "SUGAR", "SMILE",
  "BRAVE", "HEART", "MOUSE", "STONE", "CRANE",
  "GHOST", "LEMON", "BREAD", "SLEEP", "SHINE",
  "EARTH", "DREAM", "NIGHT", "SOUND", "FLAME",
  "GLASS", "FLOOR", "GRASS", "SHELL", "OCEAN",
  "STORM", "LEARN", "SIGHT", "CLEAN", "COVER",
  "MUSIC", "TRUTH", "STAGE", "FRUIT", "PLANT",
  "BLADE", "STEAM", "SPACE", "FAITH", "SWEET",
  "TEACH", "SMELL", "HONEY", "FIELD", "BLOOD",
  "BLAZE", "CATCH", "SCARE", "TASTE", "SPOON",
  "CROWN", "PRIZE", "BROWN", "LOVER", "TOWER",
  "GUARD", "SLICE", "ROAST", "BRUSH", "BEACH",
  "CABLE", "HORSE", "FIRED", "GLOVE", "SLOPE",
  "REACH", "SCORE", "TRUCK", "SHEET", "CANDY",
  "ALARM", "ANGEL", "TRAIL", "BIRTH", "DANCE",
  "MAYOR", "STRAW", "CHAIN", "FAIRY", "CLOCK",
  "FRESH", "STICK", "BLACK", "BRICK", "SOUTH",
  "NORTH", "EASTS", "WESTS", "TIGER", "ZEBRA",
  "RIVER", "PEACH", "BUNNY", "NOISE", "SLEEP",
    "HAPPY", "APPLE", "GRAPE", "CHAIR", "FLAME", "SUGAR", "BRAVE", "CRANE", "SHINY", "PROUD", "SWING",
    "TABLE", "GLOBE", "PIANO", "BLEND", "SHINE", "CLOUD", "FROST", "BRICK", "TRACE", "GHOST",
    "SWEET", "DREAM", "LAUGH", "BEACH", "SMILE", "JUICE", "PLANE", "LIGHT", "BREAD", "SCORE",
    "STORM", "WHALE", "PLANT", "DRIFT", "SPEAK", "SPICE", "HOVER", "BLOOM", "SKATE", "FLOCK",
    "TRUTH", "CRISP", "TRICK", "ZEBRA", "NOBLE", "TRACK", "BLINK", "SHARP", "MATCH", "SPOON",
];



var positonOnArray = Math.floor(Math.random() * wordleWords.length);

var word = wordleWords[positonOnArray];

window.onload = function () {
    initialize();
}

function initialize() {
    
    // Create the board (6 attempts)
    for (let r = 0; r < height; r++){
        for( let c = 0; c < width; c++){
            // You are creating a <span id= "0-0" class= 'tile'> 
            let tile = document.createElement('span');
            tile.id = r.toString() + '-' + c.toString();
            tile.classList.add('tile');
            tile.innerHTML = '';
            document.getElementById('board').appendChild(tile);
        }
    }

    // Create the key board
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
    ];


    for (let i = 0; i < keyboard.length; i++){
        let currentRow = keyboard[i];
        let keyboardRow  = document.createElement('div');
        keyboardRow.classList.add('keyboard-row');


        for ( let j = 0 ; j < currentRow.length; j++){
            let keyTile = document.createElement('div');

            let key = currentRow[j];
            keyTile.innerHTML = key;
            
            if ( key == 'ENTER'){
                keyTile.id = 'Enter';
            } else if (key == '⌫'){
                keyTile.id = 'Backspace';
            } else if ('A' <= key && key <= 'Z'){
                keyTile.id = 'Key' + key; // Key + A
            }

            keyTile.addEventListener('click', processKey);

            if ( key == 'Enter') {
                keyTile.classList.add('enter-key-tile');
            } else {
                keyTile.classList.add('key-tile');
            }
            
            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow);
        
    }



    // Listen for Keypress 
    // We want to wait when the user keyup the key to register the letter
    document.addEventListener('keyup', (e) => {
        processInput(e);
        
    });
}

function processKey(){
    let e = {'code' : this.id};
    processInput(e);
}


function processInput(e){
    if(isGameOver) return;
        
    //alert(e.code); // This will tell us the key tha was pressed

    // We only allow to press alphabet keys
    if ('KeyA' <= e.code && e.code <= 'KeyZ') {
        if (col < width) {
            let currentTile = document.getElementById(row.toString() + '-' + col.toString());
            
            if (currentTile.innerHTML === '') {
                currentTile.innerHTML = e.code[3]; // The position 3 because "KeyA" = index 3 is "A"
                col++;
                userWord += e.code[3];
                updateTile();
            }
        }
    } else if (e.code === 'Backspace') {
        if (col > 0) {
            col--;
            let currentTile = document.getElementById(row.toString() + '-' + col.toString());
            currentTile.innerText = '';
            userWord = userWord.slice(0, -1);
            updateTile();
        }
    } else if (e.code == 'Enter') {
        if (userWord.length != width) {
            tileAnimation();
            return;
        }

        if (!isValidWord(userWord)) {
            document.getElementById('answer').innerHTML = userWord + ' is not in the wordlist';
            tileAnimation();
            return;
        }

        update();
        wordAnimation();
        row++;
        col = 0;
        userWord = '';
    }

    if(!isGameOver && row === height){
        isGameOver = true;
        document.getElementById('answer').innerHTML = word;
    }
}

function update(){
    console.log(word);
    let correct = 0;
    let letterCount = new Map();
    let letter;

    for (let i = 0; i < word.length; i++){
        letter = word[i];
        if ( letterCount.has(letter)) {
            letterCount.set(letter, letterCount.get(letter) + 1);
        } else {
            letterCount.set(letter, 1);
        }
    }

    // First iteration, check all the correct ones
      for(let c = 0; c < width; c++){
        let currentTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currentTile.innerHTML;

        // Is it in the correct position?
        if (word[c] === letter){
            currentTile.classList.add('correct');

            let keyTile = document.getElementById('Key' + letter);
            
            keyTile.classList.remove('present');
            keyTile.classList.add('correct');
            correct++;
            letterCount.set(letter, letterCount.get(letter) + 1);
        }

          if (correct === width) {
              isGameOver = true;
              document.getElementById('answer').innerHTML = `The word was ${word}!`;
          }
        
    }



    // Go again and mark which ones are present but in wrong position

    for(let c = 0; c < width; c++){
        let currentTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currentTile.innerHTML;
        let keyTile = document.getElementById('Key' + letter);

        if(!currentTile.classList.contains('correct')){
            // Is it in the correct position?
            if (word.includes(letter) && letterCount.get(letter) > 0){ // Is the letter present in the word?
                currentTile.classList.add('present');
                
                if(!keyTile.classList.contains('correct')) {
                    keyTile.classList.add('present');
                }

                letterCount.set(letter, letterCount.get(letter) - 1);
            } else {
                currentTile.classList.add('absent');
                keyTile.classList.add('key-absent');
            }
        }
    }
}

function isValidWord(word){
    return validWords.includes(word);
}

function hasMoreLetters(word){
    let guessword = {...word.toString()};

    for (let index = 0; index < word.length; index++) {
        if (word[index].includes(guessword)){
            guessword = guessword.replace(guessword[index], '');
        }
        
    }

    return guessword;
}

function updateTile(){
    document.querySelectorAll('.tile.chosen').forEach( tile => {
        tile.classList.remove('chosen');
    });

    if(col< width && row < height){
        let nextTile = document.getElementById(row.toString() + '-' + col.toString());
        if (nextTile){
            nextTile.classList.add('chosen');
        }
    }
}

function tileAnimation(){
     for (let i = 0; i < width; i++) {
        let tile = document.getElementById(row.toString() + '-' + i.toString());
        tile.classList.add('notFilled');
        tile.addEventListener('animationend', () => {
            tile.classList.remove('notFilled');
        }, { once: true });
    }
    return;
}

function wordAnimation(){
     for (let i = 0; i < width; i++) {
        let tile = document.getElementById(row.toString() + '-' + i.toString());
        tile.style.animationDelay = `${i * 200}ms`;
        tile.classList.add('flip');
        tile.addEventListener('animationend', () => {
            tile.classList.remove('flip');
            tile.style.animationDelay = '';
        }, { once: true });
    }
    return;
}