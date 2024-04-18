const express = require('express');
const router = express.Router();
const requestCtrl = require("../controllers/requests");

var Auth = require("./lib/Auth");

router.post("/get", Auth.isConnected, requestCtrl.get)
router.post("/getAll", Auth.isConnected, requestCtrl.getAll)
router.post("/accepted", Auth.isConnected, requestCtrl.accepted)
router.post("/refused", Auth.isConnected, requestCtrl.refused)
router.post("/remove", Auth.isConnected, requestCtrl.remove)
router.post("/setVue", Auth.isConnected, requestCtrl.setVue)
router.post("/setVueAll", Auth.isConnected, requestCtrl.setVueAll)

module.exports = router
