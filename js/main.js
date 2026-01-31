//implemented a MVC model naturally (Model (state, data structures), view(visuals through the DOM), controller (player input validated through event-listeners))

let deck_id="";
let stockPile = [];
let wastePile = [];

let tableau = [
  [],  //7 piles
  [],
  [],
  [],
  [],
  [],
  []  
]; 

class Card {
  constructor(code, rank, suit, faceUp = false, image = null){
    this.id = code; // card id for the DOM
    this.rank = rank; // 2-10, A, K, Q
    this.suit = suit; // spades, 'hearts'...
    this.faceUp = faceUp; // false by default
    this.image = image; //url path (unknown at class creation time)
  }

  //methods 
  flip() {
    this.faceUp = !this.faceUp;
  }
}


if(!localStorage.getItem("deck_id")){

  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => res.json()) //parse response as JSON
      .then(data => {
        console.log(data)
        deck_id = data.deck_id;
        localStorage.setItem("deck_id", deck_id);

        //draw a card if a deck doesnt exist

        initialSetUp(deck_id);
        saveGame();
      })

      .catch(err => {
                console.log(`error ${err}`)
            });

} else { //if the deck already exists
    //resume the game
    deck_id = localStorage.getItem("deck_id");
    loadGame();
}

//initial dealing of cards to tableau and stockpile

function initialSetUp(deck_id) {
  //draw a card
  fetch(`https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=52`)
        .then(res => res.json()) //parse response as JSON
        .then(data => {
          const cardsFromApi = data.cards; // object of 52 cards drawn
          let cardIndex = 0; //Create a seperate index to track the cards of the array because the indexes of the nested loop are not linear!
          
          //1. Fill the tableau with 28 cards, 7 piles
          for(let i=0; i<tableau.length; i++){
            for(let j=0; j < i+1; j++){

              const apiCard = cardsFromApi[cardIndex++]; // *cardIndex is used becasue we are trying to keep the linear indexing of the api array separate from the non-linear indexing of the tableau.
              //we pull the cards in a linear pattern while the i and j indexes deal the cards in a non-linear pattern.
              tableau[i].push( 
                new Card(
                apiCard.code, 
                apiCard.value, 
                apiCard.suit, 
                false, 
                apiCard.image ));
            };
            //2. Turn last card face up
            tableau[i][tableau[i].length -1].flip();
          };

          
          //3. Fill the stock pile
          for(; cardIndex < cardsFromApi.length; cardIndex++){ // remaining cards from deck;
            const apiCard = cardsFromApi[cardIndex];
            stockPile.push(
              new Card(
                apiCard.code, 
                apiCard.value, 
                apiCard.suit, 
                false, 
                apiCard.image)
            );
          };

        })     

        .catch(err => {
                  console.log(`error ${err}`)
              })

console.log(tableau, stockPile);
}


// Function that savec game state

function saveGame(){
  //want to save tableau, stockpile, wastepile.

  //using JSON to stringify (serialize the model part of MVC (arrays, objects))
  //serialize= flatten the data into text
  //THIS DOES NOT SAVE THE METHODS!

  localStorage.setItem('stockPile', JSON.stringify(stockPile)); //arr of objects
  localStorage.setItem('tableau', JSON.stringify(tableau)); //arr of arrays of objects
  localStorage.setItem('wastePile', JSON.stringify(wastePile)); // arr of objects
}

function loadGame(){
  const rawStockPile = JSON.parse(localStorage.getItem('stockPile')) || []; //creates an array of objects with no methods
  const rawTableau = JSON.parse(localStorage.getItem('tableau')) || [];
  const rawWastePile = JSON.parse(localStorage.getItem('wastePile')) || []; // Give me the stored data or give me an empty array

  /* Why an empty array? to make sure that rawWastePile.map(...) still works. it treat 'empty' array as a valid state 
because it is logical that for example, the waste pile might be empty when you want to load the game. It also avoids conditinal
clutter and keeps the logic resilient. When you map an empty array, you get an empty array*/

// Anytime you load persisted data, ask yourseld: what is the default valid state if this data does NOT exist? In this case its an empty arr.

  stockPile = rawStockPile.map(card => {
    return new Card(
      card.id,
      card.rank,
      card.suit,
      card.faceUp,
      card.image,
    )
  } );
  
  wastePile = rawWastePile.map(card => new Card(card.id, card.rank, card.suit, card.faceUp, card.image));

  tableau = rawTableau.map(pile => pile.map(card => new Card(card.id, card.rank, card.suit, card.faceUp, card.image)));
}

// draw() = stockpile - wastepile drawing behavior
// returns an object (changesObj) that describes the changes that took place. (1 card drawn, or all wastepile card recycled)

function draw() {

  if(stockPile.length > 0) { // has cards
    let drawnCard = stockPile.pop();
    drawnCard.flip();
    wastePile.push(drawnCard);
    saveGame();
    
    const changesObj = {
      action: "draw",
      cards: [drawnCard],
      faceUp: true,
      from: 'stockPile',
      to: 'wastePile',
    }

    return changesObj;

  } else if (stockPile.length === 0 && wastePile.length !== 0){
    wastePile.forEach(card => card.flip());
    stockPile = wastePile.reverse();
    wastePile = [];

    saveGame();

    const changesObj = {
      action: 'recycle', 
      cards: [...stockPile],
      faceUp: false,
      from: 'wastePile',
      to:'stockPile',
    }

    return changesObj;

  } else {
    return null;
  }  

}

document.querySelector('.stock').addEventListener('click', () => {
  let responseObj = draw();
  if(responseOnj !== null){
    applyChanges(responseObj);
  };
});

function applyChanges(moveResult) { //only translates the info from changesObj (model) into DOM movement(view)
  
    switch(moveResult.action){
    case 'draw':
      let cardIdToMove = moveResult.cards[0].id; //takes id of card that moved in the model
      const domCard = document.querySelector(`[data-card-id="${cardIdToMove}"]`); //selects that card in the dom
      document.querySelector('.waste').appendChild(domCard); //places it in waste

      //visually speaking in the dom, we see:
      if(moveResult.faceUp === true){
        domCard.src = moveResult.cards[0].image;
      }
      break;

    case 'recycle':
      let arrOfCardsToMove = moveResult.cards.map(elem=> elem.id);
      for(let i = arrOfCardsToMove.length-1; i>=0; i--){ //loops through the arr of ids
        const domCard = document.querySelector(`[data-card-id="${arrOfCardsToMove[i]}"]`); //selects 1 card per iteration
        document.querySelector('.stock').appendChild(domCard) // places in stock
        domCard.src = "https://www.deckofcardsapi.com/static/img/back.png"; //picture of the back of the card
      };
      break;
      
    default:
      break;
  }
}