exports.CuList = async (req, res, next) => {
  try {
    res.render("CGU/Condition-d'utilisation", {
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
};

exports.PcList = async (req, res, next) => {
  try {
    res.render("CGU/politique-de-confidentialite", {
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
};
