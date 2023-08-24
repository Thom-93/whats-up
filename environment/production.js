const path = require("path");

module.exports = {
  dbUrl:
    "mongodb+srv://Alex:qwe@cluster0.u908xrg.mongodb.net/twitter?retryWrites=true&w=majority",
  cert: path.join("/etc/letsencrypt/live/www.whats-up.site-0001/fullchain.pem"),
  key: path.join("/etc/letsencrypt/live/www.whats-up.site-0001/privkey.pem"),
  portHttp: 80,
  portHttps: 443,
};
