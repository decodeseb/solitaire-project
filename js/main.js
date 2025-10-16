let deck_id="";

fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => res.json()) //parse response as JSON
      .then(data => {
        console.log(data)
        deck_id = data.deck_id;
        console.log(deck_id);
      })

      .catch(err => {
                console.log(`error ${err}`)
            });

