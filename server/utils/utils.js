const sendError = (socket, message) => {
  console.log(message);
  socket.emit("error", message);
};
const sendAlert = (socket, message) => {
  console.log(message);
  socket.emit("alert", message);
};
module.exports = { sendError, sendAlert };
