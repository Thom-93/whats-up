const cookieParser = require("cookie");
const { findUserPerId } = require("../queries/users.queries");
const jwt = require("jsonwebtoken");
const secret = "1713e54a-f93c-4f80-975e-f17130655284";
const axios = require("axios");

const decodeJwtToken = (token) => {
  return jwt.verify(token, secret);
};

const verifyCaptcha = async (token) => {
  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: "6Lei_BknAAAAAERYIEsymIe7HwgsWzK-3oLnBWR5",
          response: token,
        },
      }
    );

    return response.data.success;
  } catch (e) {
    next(e);
  }
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

exports.ensureIsNotBot = async (req, res, next) => {
  const recaptchaResponse = req.body["g-recaptcha-response"];
  console.log(recaptchaResponse);
  if (!recaptchaResponse) {
    return res.status(400).json({ message: "reCAPTCHA is required" });
  }

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: "6Lei_BknAAAAAERYIEsymIe7HwgsWzK-3oLnBWR5",
          response: recaptchaResponse,
        },
      }
    );

    if (response.data.success) {
      // Le reCAPTCHA est valide
      next();
    } else {
      // Le reCAPTCHA est invalide
      return res.status(403).json({ message: "Invalid reCAPTCHA response" });
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return res.status(500).json({ message: "reCAPTCHA verification error" });
  }
};
