let init = false;
let messages = [];

const ioClient = io({
  reconnection: false,
});

ioClient.on("connect", () => {
  console.log("connexion client ok !");
  localStorage.setItem("socketId", ioClient.id);
});
