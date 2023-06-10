const router = require('express').Router();
const { ensureAuthenticated } = require('../config/guards.config');
const tweets = require('./letters.routes');
const users = require('./users.routes')
const auth = require('./auth.routes');

router.use('/letters', ensureAuthenticated, tweets);
router.use('/users', users);
router.use('/auth', auth);

router.get('/', (req, res) => {
  res.redirect('/letters');
});

module.exports = router;