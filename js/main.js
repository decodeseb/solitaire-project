let deck_id="";
let stock;

if(!localStorage.getItem("deck_id")){

  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => res.json()) //parse response as JSON
      .then(data => {
        console.log(data)
          deck_id = data.deck_id;
          localStorage.setItem("deck_id", deck_id);

        console.log(deck_id, localStorage.getItem("deck_id"));
      })

      .catch(err => {
                console.log(`error ${err}`)
            });

} else {

     deck_id = localStorage.getItem("deck_id");

}

console.log(deck_id, localStorage.getItem("deck_id"))
// Draw a card


fetch(`https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)
      .then(res => res.json()) //parse response as JSON
      .then(data => {
        console.log(data, data.cards[0]["image"]);
      })

      .catch(err => {
                console.log(`error ${err}`)
            });

