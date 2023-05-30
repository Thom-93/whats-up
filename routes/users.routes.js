const router =require('express').Router();
const {ensureAuthenticated } = require('../config/guards.config');
const { signup, signupForm, uploadImage, userProfile, userList, followUser, unfollowUser, emailLinkVerification } = require('../controllers/users.controller');

router.get('/', userList);
router.get('/follow/:userId', followUser);
router.get('/unfollow/:userId', unfollowUser);
router.get('/:username', userProfile);
router.get('/signup/form', signupForm);
router.post('/signup', signup);
router.post('/update/image', ensureAuthenticated, uploadImage);
router.get('/email-verification/:userId/:token', emailLinkVerification);



module.exports = router;