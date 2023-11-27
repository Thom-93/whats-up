const cookieParser = require("cookie");
const {
  findUserPerId,
  findUserIdAndUpdateLastActiveTime,
  findUserPerIdAndUpdateLogged,
  getAllUsersLogged,
} = require("../queries/users.queries");
const jwt = require("jsonwebtoken");
const secret = "1713e54a-f93c-4f80-975e-f17130655284";
const axios = require("axios");
const { checkUserBan, unBanUser } = require("../queries/banList.queries");
const cron = require("node-cron");

const decodeJwtToken = (token) => {
  return jwt.verify(token, secret);
};

exports.checkIfIsLoged = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    next();
  }
};

exports.ensureAuthenticated = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const userId = req.user._id;
      if (userId) {
        let lastActiveTime = req.user.lastActiveTime;
        if (lastActiveTime || lastActiveTime == undefined) {
          lastActiveTime = Date.now();
          const updatedUserLAT = await findUserIdAndUpdateLastActiveTime(
            userId,
            lastActiveTime
          );
          if (!updatedUserLAT) {
            throw new Error("LAT Error");
          }
        }
      }
      next();
    } else {
      res.redirect("/auth/form");
    }
  } catch (e) {
    next(e);
  }
};

exports.ensureIsAdmin = async (req, res, next) => {
  try {
    if (req.user.local.admin) {
      next();
    } else {
      res.redirect("/");
    }
  } catch (e) {
    next(e);
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

exports.ensureIsNotBan = async (req, res, next) => {
  try {
    if (!req.user) {
      res.redirect("/auth/form");
    } else {
      const userVerification = await checkUserBan(req.user.local.email);
      if (userVerification) {
        const banTimestamp = userVerification.createdAt.getTime();
        const nowTimestamp = Date.now();
        if (userVerification.delay === "24H") {
          const banDuration = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
          const remainingTime = banTimestamp + banDuration - nowTimestamp;
          const remainingHours = Math.ceil(remainingTime / (60 * 60 * 1000));
          if (remainingHours <= 0) {
            await unBanUser(req.user.local.email);
            next();
          } else {
            return res.status(403).json({
              message: `You are banned. You will be unbanned in ${remainingHours} hours.`,
            });
          }
        } else {
          return res.status(403).json({
            message: `You are permanently banned.`,
          });
        }
      } else {
        next();
      }
    }
  } catch (e) {
    next(e);
  }
};

cron.schedule("*/60 * * * *", async () => {
  try {
    console.log("Vérification des sessions expirantes");
    const usersLogged = await getAllUsersLogged();

    const currentTime = Date.now();

    for (const user of usersLogged) {
      if (user.lastActiveTime) {
        const timeSinceLastActivity = currentTime - user.lastActiveTime;

        // Si le temps depuis la dernière activité est supérieur à 15 minutes (900 000 millisecondes),
        // déconnectez l'utilisateur en mettant à jour le statut "logged" à "false"
        if (timeSinceLastActivity > 900000) {
          await findUserPerIdAndUpdateLogged(user._id, false); // Mettez à jour le statut "logged" en base de données
        }
      } else if (user.lastActiveTime == undefined || !user.lastActiveTime) {
        await findUserIdAndUpdateLastActiveTime(user._id, currentTime); // Si l'user n'a pas de LAT, mettez à jour sa LAT en base de données
      }
    }
    console.log("Vérification des sessions expirantes terminée");
  } catch (error) {
    console.error(
      "Erreur lors de la vérification des sessions expirantes :",
      error
    );
  }
});
