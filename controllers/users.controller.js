const { createUser, findUserPerUsername, searchUsersPerUsername, findUserPerId, addUserIdToCurrentUserFollowing, removeUserIdToCurrentUserFollowing } = require('../queries/users.queries');
const { getUserTweetsFromAuthorId } = require('../queries/tweet.queries');
const path = require('path');
const multer = require('multer');
const { sendMail } = require('../public/javascripts/emails/email.send');
const upload = multer({ storage: multer.diskStorage({ 
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images/avatars'));
  },
  filename: (req, file, cb) => {
    cb(null, `${ Date.now() }-${ file.originalname }}`);
  }
})})

exports.userList = async (req, res, next) => {
  try {
    const search = req.query.search;
    const users = await searchUsersPerUsername(search);
    res.render('includes/search-menu', { users });
  } catch(e) {
    next(e);  
  }
}

exports.userProfile = async (req, res ,next) => {
  try {
    const username = req.params.username;
    const user = await findUserPerUsername(username);
    const tweets = await getUserTweetsFromAuthorId(user._id);
    res.render('tweets/tweet', { 
      tweets, 
      isAuthenticated: req.isAuthenticated(), 
      currentUser: req.user, 
      user, 
      editable: false });
  } catch(e) {
    next(e);
  }
}

exports.signupForm = (req, res, next) => {
  res.render('users/users-form', { errors: null, isAuthenticated: req.isAuthenticated(), currentUser: req.user})
}

exports.signup = async (req, res, next) => {
  const body = req.body;
  try{
    const user = await createUser(body);
    req.login(user);
    sendMail(user);
    res.redirect('/');
  } catch(e) {
    res.render('users/users-form', { errors: [ e.message ], isAuthenticated: req.isAuthenticated(), currentUser: req.user });
  }
}

exports.uploadImage = [
  upload.single('avatar'),
  async (req, res, next) => {
    try {
      const user = req.user;
      user.avatar = `/images/avatars/${ req.file.filename }`;
      await user.save();
      res.redirect('/')
    } catch(e) {
      next(e);
    }
  }
]

exports.followUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const [, user] = await Promise.all([ addUserIdToCurrentUserFollowing(req.user, userId), findUserPerId(userId) ])
    res.redirect(`/users/${ user.username }`);
  } catch(e) {
    next(e);
  }
}

exports.unfollowUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const [, user] = await Promise.all([ removeUserIdToCurrentUserFollowing(req.user, userId), findUserPerId(userId) ])
    res.redirect(`/users/${ user.username }`);
  } catch(e) {
    next(e);
  }
}