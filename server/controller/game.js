const gameState = {};
const { showCustomModal, sendError, sendAlert, findStateByPlayer, getPlayerIndexById} = require("../utils/utils.js");
const { getRoom } = require("./room.js");
const {
  drawRandomCards,
  drawRandomCard,
} = require("../game/drawRandomCard.js");
const { Action } = require("../game/cards.js");
const { isMoveValid, cardEffect, nextTurn, handlePlay, getValidMoves, validatePlayersCards} = require("../game/gameLogic.js");

const gameExists = (code) =>  Object.keys(gameState).includes(code)

const GameController = (io, socket) => {
  const playerWon = () => {
    showCustomModal(socket,{
      title: "Congratulations!",
      children:"You win!",
      type:"custom",
      icon:'<i class="ti ti-trophy"></i>',
      canClose: true,
      closeCallback: "()=>{closeModal()}"
    });
    return;
  }

  const gameWon = (game) => {
    const { code } = game;
    io.to(code).emit("gameWon", game)
    return;
  }

  socket.on("makeMove", (data) => {
    let { action, game, myself } = data;
    const { card } = action;
    console.log(action);
    if (action.type == Action.Play) {
      if (!isMoveValid(card, game.discardPile)) {
        sendAlert(socket, "Invalid move");
        return;
      }
      game = handlePlay(card, game, myself, playerWon, (game)=>gameWon(game));
      game = validatePlayersCards(game);
      io.to(game.code).emit("updateState", game );
    }
    if (action.type == Action.Draw) {
      let { game } = data;
      game.players.map((player) => {
        if (player.id == myself.id) {
          player.deck.push(drawRandomCard());
        }
        player.deck = getValidMoves(player.deck, game.discardPile) 
        return player
      });
      game.turn = nextTurn(game);    
      game = validatePlayersCards(game);
      io.to(game.code).emit("updateState", game);
    }
  });
  socket.on("startGame", (code) => {
    if (!gameExists(code)) {
      const room = getRoom(code);
      gameState[code] = room;
      console.log(room);
    }
    let game = gameState[code];
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
    game.discardPile.valid = true;
    game.started = true;
    game.clockwise = true;
    game.turn = nextTurn(game);     
    game = validatePlayersCards(game);
    io.to(game.code).emit("updateState", game);
  });

  const deleteGame = (code) => {
    delete gameState[code];
    io.to(code).emit("deleteRoom", "");
  }

  socket.on("disconnect", () => {
    const room = findStateByPlayer(gameState, socket.id);
    if (!room) return;
    const { code } = room;
    if (room.owner_id == socket.id) {
      deleteGame(code)
      return;
    }
    const playerIndex = getPlayerIndexById(room.players, socket.id); //room.players.indexOf(socket.id)
    console.log(playerIndex);
    room.players.splice(playerIndex, 1);
    io.to(room.code).emit("updateState", room);
  });
};

module.exports = { GameController: GameController };
