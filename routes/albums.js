const express = require('express');
const router = express.Router();
const albumCtrl = require("../controllers/albums");

var Auth = require("./lib/Auth");

router.post("/ajout", Auth.isConnected, albumCtrl.ajout)
router.post("/update", Auth.isConnected, albumCtrl.update)
router.post("/remove", Auth.isConnected, albumCtrl.remove)

router.post("/show", Auth.isConnected, albumCtrl.show)
router.post("/unShow", Auth.isConnected, albumCtrl.unShow)

router.post("/get", Auth.isConnected, albumCtrl.get)
router.post("/getMe", Auth.isConnected, albumCtrl.getMe)
router.post("/getFromFriends", Auth.isConnected, albumCtrl.getFromFriends)
router.post("/getDashboard", Auth.isConnected, albumCtrl.getDashboard)

router.post("/getBanned", Auth.isConnected, albumCtrl.getBanned)
router.post("/addBanned", Auth.isConnected, albumCtrl.addBanned)
router.post("/delBanned", Auth.isConnected, albumCtrl.delBanned)

router.post("/find", Auth.isConnected, albumCtrl.find)
router.post("/findTag", Auth.isConnected, albumCtrl.findTag)
router.post("/limitAccess", Auth.isConnected, albumCtrl.limitAccess)

module.exports = router;