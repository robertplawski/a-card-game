const roomState = {};
const { sendError, sendAlert, findStateByPlayer, getPlayerIndexById} = require("../utils/utils.js");

const getRoom = (code) => {
  const room = roomState[code];
  return room;
};
const generateRoomCode = () => {
  console.log(Object.keys(roomState));
  while (true) {
    let random = String(Math.floor(Math.random() * 90000) + 10000);
    if (!Object.keys(roomState).includes(random)) return random;
  }
};

const validRoomCode = (code) => {
  code = String(code);
  const regex = new RegExp("[0-9]", "g");
  const match = code.match(regex);
  if (match == null) return;
  return match.length == 5;
};

const roomExists = (code) => {
  return Boolean(roomState[code]);
};

const isNameDuplicate = (players, name) => {
  for (const player of players) {
    if (player.name == name && player.name != undefined) return true;
  }
  return false;
};

const RoomController = (io, socket) => {
  socket.emit("playerData", { id: socket.id });

  socket.on("exists", (code) => {
    code = Number(code);
    if (!validRoomCode(code)) {
      sendError(socket, "Invalid room code");
      return;
    }
    socket.emit("existsResponse", roomExists(code));
  });

  socket.on("getRoomCode", () => {
    socket.emit("roomCode", generateRoomCode());
  });

  socket.on("createRoom", (code = generateRoomCode()) => {
    if (roomExists(code)) {
      sendError(socket, "Room already exists");
      return;
    }
    if (!validRoomCode(code)) {
      sendError(socket, "Invalid room id");
      return;
    }
    code = Number(code);
    roomState[code] = {
      code: code,
      owner_id: socket.id,
      players: [{ id: socket.id }],
      max_capacity: 7,
      started: false,
    };
    roomExists(code);
    socket.join(code);
    io.to(code).emit("updateState", roomState[code]);
  });

  socket.on("startGame", (code) => {
    /*const room = roomState[code];
    if (!roomExists(code)) {
      sendError(socket, "Room doesn't exist");
      return;
    }
    if (!validRoomCode(code)) {
      sendError(socket, "Invalid room id");
      return;
    }
    if (room.players.length == 1) {
      sendError(socket, "Not enough players");
      return;
    }
    room.started = true;
    io.to(room.code).emit("updateState", room);*/
  });

  socket.on("updatedPlayer", (data) => {
    const room = findStateByPlayer(roomState, data.id);
    if (room == undefined) return;
    //console.log(room);
    const playerIndex = getPlayerIndexById(room.players, data.id);
    if (data.name.length > 15) {
      sendError(socket, "Username too long!");
      return;
    }
    if (isNameDuplicate(room.players, data.name)) {
      sendError(socket, "Duplicate name, choose another one");
      return;
    }
    room.players[playerIndex] = { ...data };
    console.log(data);
    io.to(room.code).emit("updateState", room);
  });

  socket.on("joinRoom", (code) => {
    code = Number(code);
    if (!validRoomCode(code)) {
      sendError(socket, "Invalid room id");
      return;
    }
    const room = roomState[code];
    if (!room) {
      sendError(socket, "Invalid room id");
      return;
    }
    if (room.max_capacity < room.players.length + 1) {
      sendError(socket, "Game is full");
      return;
    }
    if (room.started) {
      sendError(socket, "Game already started");
      return;
    }
    room.players.push({ id: socket.id });
    socket.join(code);
    io.to(code).emit("updateState", room);
  });

  socket.on("disconnect", () => {
    const room = findStateByPlayer(roomState, socket.id);
    if (!room) return;
    const { code } = room;
    if (room.owner_id == socket.id) {
      delete roomState[code];
      io.to(code).emit("deleteRoom", "");
      return;
    }
    const playerIndex = getPlayerIndexById(room.players, socket.id); //room.players.indexOf(socket.id)
    console.log(playerIndex);
    room.players.splice(playerIndex, 1);
    io.to(room.code).emit("updateState", room);
  });
};

module.exports = { RoomController, getRoom };
