const express = require('express');
const router = express.Router();
const photoCtrl = require("../controllers/photos");

var Auth = require("./lib/Auth");
const multiparty = require('connect-multiparty'),
	multipartyMiddleware = multiparty(),
	FileUploadController = require('./lib/FileUploadController');

router.post("/get", Auth.isConnected, photoCtrl.get)
router.post("/getFromUser", Auth.isConnected, photoCtrl.getFromUser)

router.post("/comment/add", Auth.isConnected, photoCtrl.addComment)
router.post("/comment/del", Auth.isConnected, photoCtrl.delComment)
router.post("/comment/update", Auth.isConnected, photoCtrl.updateComment)

router.post("/like/add", Auth.isConnected, photoCtrl.addLike)
router.post("/like/del", Auth.isConnected, photoCtrl.delLike)

router.post("/upload", Auth.isConnected, multipartyMiddleware, FileUploadController.uploadFilePhotos)

module.exports = router