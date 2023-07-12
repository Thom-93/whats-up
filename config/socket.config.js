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
    console.log("connexion ios ok");
  });
  io.on("close", (socket) => {
    socket.disconnect(true);
  });
};

module.exports = { initSocketServer };
