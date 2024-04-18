const express = require('express');
const router = express.Router();
const userCtrl = require("../controllers/users")

var Auth = require("./lib/Auth");

const multiparty = require('connect-multiparty'),
	multipartyMiddleware = multiparty(),
	FileUploadController = require('./lib/FileUploadController');

router.post('/connected', userCtrl.connected)
router.post('/get', userCtrl.get)
router.post('/getAll', userCtrl.getAll)
router.post('/login', userCtrl.Login)
router.post('/logout', userCtrl.Logout)
router.post('/register', userCtrl.Register)	
router.post('/getInvitation', userCtrl.getInvitation)	
router.post('/validEmail', userCtrl.validEmail)	
router.post('/getMe', Auth.isConnected, userCtrl.getMe)
router.post('/updatePicture', Auth.isConnected, userCtrl.updatePicture)
router.post('/find', Auth.isConnected, userCtrl.find)
router.post('/forgotPassword', userCtrl.forgotPassword)
router.post('/changePassword', userCtrl.changePassword)
router.post("/upload", Auth.isConnected, multipartyMiddleware, FileUploadController.uploadFileUser)


module.exports = router;
