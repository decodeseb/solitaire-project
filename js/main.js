let deck_id="";
let stock = document.querySelector("div.stock img");

if(!localStorage.getItem("deck_id")){

  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => res.json()) //parse response as JSON
      .then(data => {
        console.log(data)
        deck_id = data.deck_id;

        localStorage.setItem("deck_id", deck_id);

        //draw a card if a deck doesnt exist

        fetch(`https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)
              .then(res => res.json()) //parse response as JSON
              .then(data => { 
                console.log(data, data.cards[0]["image"]);
              })

              .catch(err => {
                        console.log(`error ${err}`)
                    })

          console.log(deck_id, localStorage.getItem("deck_id"));
        })
      .catch(err => {
                console.log(`error ${err}`)
            });

} else { //if the deck already exists.
    deck_id = localStorage.getItem("deck_id");
    //draw a card
    fetch(`https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)
          .then(res => res.json()) //parse response as JSON
          .then(data => {
            console.log(data, data.cards[0]["image"]);
            stock.src = data.cards[0]['image'];
          })

          .catch(err => {
                    console.log(`error ${err}`)
                })

}

//tableau

// data structure representing the tableau, array of subarrays.
let tableau = [
  [],  //pile 1
  [],
  [],
  [],
  [],
  [],
  []  //pile 7
]; 

class Card {
  constructor(rank, suit, faceUp = false, image = null){
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

//dealing cards to tableau
for(let i=0; i<tableau.length; i++){
  for(let j=0; j < i+1; j++){
    tableau[i].push(new Card("Test", 'Test', false, "test.png"));
  }
}

//flip top-card
for(let i=0; i<tableau.length; i++){
  /* tableau[i][tableau[i].length-1]["faceUp"] = true; */ //not very readable
  const pile = tableau[i];
  const lastCard = pile[pile.length-1];
  lastCard.faceUp = true;
}


console.log(tableau);