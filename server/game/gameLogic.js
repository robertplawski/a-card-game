const isMoveValid = (card, discardPile) => {
  if (card.symbol >= 4) return true;
  if (card.color == discardPile.color) return true;
  if (
    discardPile.symbol == 0 &&
    card.symbol == 0 &&
    card.value == discardPile.value
  )
    return true;
  if (
    card.symbol == discardPile.symbol &&
    discardPile.symbol != 0 &&
    card.symbol != 0
  )
    return true;
  return false;
};

const getValidMoves = (deck, discardPile) => {
  return deck.map(card=>{
    card.valid = isMoveValid(card,discardPile)
    return card
  });
}

const getPlayingPlayers = (players) =>  players.filter(player=>!player.won)

const getNextPlayer = (game) => {
  const { turn, clockwise } = game;
  const players = getPlayingPlayers(game.players)
  let index = 0;
  for (const player of players ) {
    if (player.id == turn.player_id) {
      return players[(clockwise ? index + 1 : index - 1) % players.length];
    }
    index++;
  }
};
const nextTurn = (game) => {
  console.log(JSON.stringify(game))
  if(!game) return {}
  if (!game.turn) {
    return { player_id: game.players[0].id };
  } else {
    return { player_id: getNextPlayer(game).id };
  }

};

const getIndexOfCardInDeck = (deck, card) => deck.findIndex(
    (iCard) => JSON.stringify(iCard) === JSON.stringify(card) // iCardy
  );

const findCardInDeck = (deck, card) => {
  const cardIndex = getIndexOfCardInDeck(deck, card)
  deck.splice(cardIndex, 1)
  return deck
}

const validatePlayersCards = (game) => {
  game.players = game.players.map((player)=> {
    player.deck = getValidMoves(player.deck, game.discardPile) 
    return player
  })
  return game
}

const handlePlay = (card, game, myself, winCallback, gameWinCallback) => {
  game.turn = nextTurn(game);
  game.players.map((player) => {
    if (player.id == myself.id) {
      // improve this pls
      const deck = findCardInDeck(player.deck, card)
      player.deck = deck
      if(deck.length == 0){ 
        player.won = true;
        winCallback()
      }
    }
  });
  console.log(getPlayingPlayers(game.players).length + "PLAYERSSS")
  if(getPlayingPlayers(game.players).length < 2){
    game.won = true;
    return game
    //gameWinCallback(game)
  }
  //if(game.players.every((player) => player.won)){}
  //console.log(card.symbol, card.color);
  const newCard = { ...card };
  //console.log(newCard.symbol)
  if (newCard.symbol >= 4)
    newCard.color = Math.floor(Math.random() * 3) + 1;
  newCard.valid = true;
  //console.log(newCard.color, "COLOR NEWCARD");
  game.discardPile = newCard;
  //console.log("G", game)
  return game;
}

module.exports = { isMoveValid, nextTurn, handlePlay, getValidMoves, validatePlayersCards, getPlayingPlayers};
