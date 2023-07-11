const socketio = require("socket.io");
const { ensureAuthenticatedOnSocketHandshake } = require("./guards.config");

let io;
let connectedUsers = 0;

const initSocketServer = (server) => {
  io = socketio(server, {
    allowRequest: ensureAuthenticatedOnSocketHandshake,
  });
  console.log("init socket server ok");
  io.on("connect", (socket) => {
    connectedUsers++;
    console.log("connexion ios ok");
    io.emit("userConnected", connectedUsers);
  });
  io.on("close", (socket) => {
    connectedUsers--;
    io.emit("userDisconnected", connectedUsers);
    socket.disconnect(true);
  });
};

module.exports = { initSocketServer };
