window.addEventListener("DOMContentLoaded", () => {
  userLogDisplay();
});

const userLogDisplay = () => {
  const userLogCounter = document.getElementById("user-log-number");
  const user = localStorage.getItem("socketId");

  if (userLogCounter) {
    if (user !== ioClient.id) {
      ioClient.on("userConnected", (connectedUsers) => {
        userLogCounter.innerHTML = connectedUsers;
      });

      ioClient.on("userDisconnected", (connectedUsers) => {
        userLogCounter.innerHTML = connectedUsers;
      });
    } else {
      console.log("user already connected");
    }
  }
};
