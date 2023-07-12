const cookieParser = require("cookie");
const { findUserPerId } = require("../queries/users.queries");
const jwt = require("jsonwebtoken");
const secret = "1713e54a-f93c-4f80-975e-f17130655284";

const decodeJwtToken = (token) => {
  return jwt.verify(token, secret);
};

exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/auth/signin/form");
  }
};

exports.ensureAuthenticatedOnSocketHandshake = async (request, success) => {
  try {
    const cookies = cookieParser.parse(request.headers.cookie || "");
    if (cookies && cookies.jwt) {
      const decodedToken = decodeJwtToken(cookies.jwt);
      const user = await findUserPerId(decodedToken.sub);
      if (user) {
        request.user = user;
        success(null, true);
      } else {
        success(400, false);
      }
    } else {
      success(403, false);
    }
  } catch (e) {
    success(400, false);
  }
};
