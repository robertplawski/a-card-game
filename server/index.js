const { Server } = require("socket.io");
const { RoomController } = require("./controller/room");
const { GameController } = require("./controller/game");

require("dotenv").config();

const { WS_PORT } = process.env;
const io = new Server(WS_PORT, {
  cors: { origin: "*" },
  connectionStateRecovery: {
    reconnectionDelay: 10000,
    reconnectionDelayMax: 10000,
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});
io.on("connection", (socket) => {
  RoomController(io, socket);
  GameController(io, socket);
});
