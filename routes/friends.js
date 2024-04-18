const express = require('express');
const router = express.Router();
const friendCtrl = require("../controllers/friends")

var Auth = require("./lib/Auth");

router.post("/get", Auth.isConnected, friendCtrl.get)
router.post("/create", Auth.isConnected, friendCtrl.create)
router.post("/createMultiple", Auth.isConnected, friendCtrl.createMultiple)
router.post("/add", Auth.isConnected, friendCtrl.add)
router.post("/remove", Auth.isConnected, friendCtrl.remove)

module.exports = router;