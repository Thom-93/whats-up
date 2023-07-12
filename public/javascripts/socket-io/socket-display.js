window.addEventListener("DOMContentLoaded", () => {
  userLogDisplay();
});

const userLogDisplay = () => {
  const userLogCounter = document.getElementById("user-log-number");

  if (userLogCounter) {
    ioClient.on("userConnected", (connectedUsers) => {
      userLogCounter.innerHTML = connectedUsers;
    });

    ioClient.on("userDisconnected", (connectedUsers) => {
      userLogCounter.innerHTML = connectedUsers;
    });
  }
};
