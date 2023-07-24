const sendError = (socket, message) => {
  console.log(message);
  socket.emit("error", message);
};
const sendAlert = (socket, message) => {
  console.log(message);
  socket.emit("alert", message);
};
const showCustomModal = (socket, modal) => {
  socket.emit("customModal", modal);
}

const findStateByPlayer = (state, id) => {
  if (state == {}) return;
  for (const [key, room] of Object.entries(state)) {
    if (room.players.some((player) => player.id == id)) return room;
  }

  return;
};

const getPlayerIndexById = (players, id) => {
  let i = 0;
  for (const player of players) {
    if (player.id == id) return i;
    i++;
  }
  return -1;
};



module.exports = { sendError, sendAlert, showCustomModal, findStateByPlayer, getPlayerIndexById};
