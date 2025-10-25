let deck_id="";
let stock;
fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => res.json()) //parse response as JSON
      .then(data => {
        console.log(data)
        if(!localStorage.getItem("deck_id")){
          deck_id = data.deck_id;
          localStorage.setItem("deck_id", deck_id);
        };

        console.log(deck_id, localStorage.getItem("deck_id"));
      })

      .catch(err => {
                console.log(`error ${err}`)
            });

// Draw initial cards


/* fetch(`https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=7`)
      .then(res => res.json()) //parse response as JSON
      .then(data => {
        console.log(data.deck_id, data.code);
        for(let i=0 )
      })

      .catch(err => {
                console.log(`error ${err}`)
            });

 */
