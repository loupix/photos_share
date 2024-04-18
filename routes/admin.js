const express = require('express');
const router = express.Router();
const adminCtrl = require("../controllers/admin");

var Auth = require("./lib/Auth");

router.post("/banUser", Auth.isAdmin, adminCtrl.banUser)
router.post("/unBanUser", Auth.isAdmin, adminCtrl.unBanUser)
router.post("/adminUser", Auth.isAdmin, adminCtrl.adminUser)
router.post("/unAminUser", Auth.isAdmin, adminCtrl.unAdminUser)

module.exports = router;