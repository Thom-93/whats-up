const router = require("express").Router();

const { CuList, PcList } = require("../controllers/CGU.controller");

router.get("/condition-d'utilisation", CuList);
router.get("/politique-de-confidentialite", PcList);

module.exports = router;
