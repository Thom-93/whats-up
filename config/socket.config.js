const socketio = require("socket.io");
const { ensureAuthenticatedOnSocketHandshake } = require("./guards.config");
const { getAllUsersLogged } = require("../queries/users.queries");

let io;
let connectedUsers = 0;

const initSocketServer = (server) => {
  io = socketio(server, {
    allowRequest: ensureAuthenticatedOnSocketHandshake,
  });

  console.log("Socket server initialized.");

  io.on("connect", async (socket) => {
    console.log("connexion ios ok");

    const log = await getAllUsersLogged();
    connectedUsers = log.length;
    io.emit("userCount", connectedUsers); // Émettre le nombre d'utilisateurs connectés à tous les clients

    socket.on("disconnect", () => {
      connectedUsers--;
      io.emit("userCount", connectedUsers); // Émettre le nombre d'utilisateurs connectés à tous les clients
    });
  });

  io.on("close", (socket) => {
    socket.disconnect(true);
  });
};

module.exports = { initSocketServer };
