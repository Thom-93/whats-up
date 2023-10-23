const secret = "1713e54a-f93c-4f80-975e-f17130655284";
const jwt = require("jsonwebtoken");
const { findUserPerId } = require("../queries/users.queries");
const app = require("../app");

const createJwtToken = ({ user = null, id = null }) => {
  const jwtToken = jwt.sign(
    {
      sub: id || user._id.toString(),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    },
    secret
  );
  return jwtToken;
};

exports.createJwtToken = createJwtToken;

const checkExpirationToken = (token, res) => {
  const tokenExp = token.exp;
  const nowInSec = Math.floor(Date.now() / 1000);

  if (nowInSec <= tokenExp) {
    return token;
  } else if (nowInSec > tokenExp && nowInSec - tokenExp < 60 * 60 * 24) {
    const refreshedToken = createJwtToken({ id: token.sub });
    res.cookie("jwt", refreshedToken);
    return jwt.verify(refreshedToken, secret);
  } else {
    throw new Error("token expired");
  }
};

const extractUserFromToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      let decodedToken = jwt.verify(token, secret, { ignoreExpiration: true });
      decodedToken = checkExpirationToken(decodedToken, res);
      const user = await findUserPerId(decodedToken.sub);
      if (user) {
        req.user = user;
        next();
      } else {
        res.clearCookie("jwt");
        res.redirect("/auth/form");
      }
    } catch (e) {
      res.clearCookie("jwt");
      res.redirect("/auth/form");
    }
  } else {
    next();
  }
};

const addJwtFeatures = (req, res, next) => {
  req.isAuthenticated = () => !!req.user;
  req.logout = () => res.clearCookie("jwt");
  req.login = (user) => {
    const token = createJwtToken({ user });
    res.cookie("jwt", token);
  };
  next();
};

app.use(extractUserFromToken);
app.use(addJwtFeatures);
