var express = require('express');
var router = express.Router();
var path = require("path");
const config = require('../config/environment');
const Users = require("../models/users"),
	Invitations = require("../models/invitation");

/* GET home page. */
router.get('*', function(req, res, next) {
	res.sendFile(path.join(config.root, '/public/index.html'));
});

module.exports = router;
