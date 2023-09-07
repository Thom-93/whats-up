const path = require("path");

module.exports = {
  dbUrl:
    "mongodb+srv://Alex:qwe@cluster0.u908xrg.mongodb.net/twitter?retryWrites=true&w=majority",
  cert: path.join(
    __dirname,
    ".../etc/letsencrypt/live/www.whats-up.site/fullchain.pem"
  ),
  key: path.join(
    __dirname,
    ".../etc/letsencrypt/live/www.whats-up.site/privkey.pem"
  ),
  portHttp: 80,
  portHttps: 443,
};
