const gameState = {};
const { sendError, sendAlert } = require("../utils/utils.js");
const { getRoom } = require("./room.js");
const {
  drawRandomCards,
  drawRandomCard,
} = require("../game/drawRandomCard.js");
const { Action } = require("../game/cards.js");
const { isMoveValid } = require("../game/gameLogic.js");

const gameExists = () => false;

const getNextPlayer = (game) => {
  const { players, turn, clockwise } = game;
  let index = 0;
  for (const player of players) {
    if (player.id == turn.player_id) {
      return players[(clockwise ? index + 1 : index - 1) % players.length];
      break;
    }
    index++;
  }
};

const nextTurn = (game) => {
  let output;
  if (!game.turn) {
    output = { player_id: game.players[0].id };
  } else {
    output = { player_id: getNextPlayer(game).id };
  }
  return output;
};

const GameController = (io, socket) => {
  socket.on("makeMove", (data) => {
    const { action, game, myself } = data;
    const { card } = action;
    console.log(action);
    if (action.type == Action.Play) {
      console.log(card, game.discardPile);
      if (!isMoveValid(card, game.discardPile)) {
        sendAlert(socket, "Invalid move");
        return;
      }
      game.turn = nextTurn(game);
      game.players.map((player) => {
        if (player.id == myself.id) {
          // improve this pls
          player.deck = player.deck.filter(
            (thisCard) => JSON.stringify(thisCard) !== JSON.stringify(card)
          );
        }
      });
      console.log(card.symbol, card.color);
      const newCard = { ...card };
      if (newCard.symbol >= 4)
        newCard.color = Math.floor(Math.random() * 4) + 1;
      console.log(newCard.color, "COLOR NEWCARD");
      game.discardPile = newCard;
      io.to(game.code).emit("updateState", game);
    }
    if (action.type == Action.Draw) {
      const { game } = data;
      game.players.map((player) => {
        if (player.id == myself.id) {
          player.deck.push(drawRandomCard());
        }
      });
      game.turn = nextTurn(game);
      io.to(game.code).emit("updateState", game);
    }
  });
  socket.on("startGame", (code) => {
    if (!gameExists(code)) {
      const room = getRoom(code);
      gameState[code] = room;
      console.log(room);
    }
    const game = gameState[code];
    if (game.players.length == 0) {
      // Change to 1 please
      sendAlert(socket, "Not enough players");
      return;
    }
    game.players.map((player) => {
      player.deck = drawRandomCards(7);
      return player;
    });
    game.discardPile = drawRandomCard();
    game.started = true;
    game.clockwise = true;
    game.turn = nextTurn(game);
    io.to(game.code).emit("updateState", game);
    io.to(game.code).emit("gameTurn", game.turn);
  });
};

module.exports = { GameController: GameController };
