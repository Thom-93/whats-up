let init = false;
let messages = [];

const ioClient = io({
  reconnection: false,
});

ioClient.on("connect", () => {
  console.log("connexion client ok !");
});

ioClient.on("userCount", (count) => {
  // Mettre à jour le compteur affiché sur le client
  const userLogCount = document.getElementById("user-log-number");
  if (userLogCount) {
    userLogCount.innerHTML = count;
  }
});
