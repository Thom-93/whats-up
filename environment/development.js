const path = require('path');

module.exports = {
  dbUrl: 'mongodb+srv://Alex:qwe@cluster0.u908xrg.mongodb.net/twitter?retryWrites=true&w=majority',
  cert: path.join( __dirname, '../ssl/local.crt'),
  key: path.join(__dirname, '../ssl/local.key')
}