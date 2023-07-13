const socketio = require("socket.io");
const { ensureAuthenticatedOnSocketHandshake } = require("./guards.config");
const { getAllUsersLogged } = require("../queries/users.queries");
const { getTweets } = require("../queries/tweet.queries");

let io;
let connectedUsers = 0;

const initSocketServer = (server) => {
  io = socketio(server, {
    allowRequest: ensureAuthenticatedOnSocketHandshake,
  });

  console.log("Socket server initialized.");

  io.on("connect", async (socket) => {
    console.log("connexion ios ok");
    if (socket.request.user.local.admin) {
      socket.join("admin");
    }
  });

  io.on("close", (socket) => {
    socket.disconnect(true);
  });
  initLetterCount();
  initUserLogCount();
};

const initUserLogCount = () => {
  io.on("connect", async (socket) => {
    const log = await getAllUsersLogged();
    connectedUsers = log.length;
    io.to("admin").emit("userCount", connectedUsers); // Émettre le nombre d'utilisateurs connectés à tous les clients

    socket.on("disconnect", () => {
      connectedUsers--;
      io.to("admin").emit("userCount", connectedUsers); // Émettre le nombre d'utilisateurs connectés à tous les clients
    });
  });
};

const initLetterCount = () => {
  io.on("connect", async (socket) => {
    const letters = await getTweets();
    numberOfLetters = letters.length;
    io.emit("letterCount", numberOfLetters); // Émettre le nombre d'utilisateurs connectés à tous les clients
  });
};

module.exports = { initSocketServer };
