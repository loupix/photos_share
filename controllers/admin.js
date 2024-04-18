var Album = require("../models/albums"),
	Photo = require("../models/photos"),
	Users = require("../models/users");


async function banUser(req, res){
	try{
		var {user_id} = req.body;
		var {user} = req.session;

		var userObj = await Users.findOne({id:user_id});
		if(!userObj)
			return res.status(404).json({text:"user not exists"});

		let result = await Users.findOneAndUpdate({id:user_id}, {banned:true});
		return res.status(200).json(JSON.stringify(result));
	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}


async function unBanUser(req, res){
	try{
		var {user_id} = req.body
		var {user} = req.session

		var userObj = await Users.findOne({id:user_id});
		if(!userObj)
			return res.status(404).json({text:"user not exists"});

		let result = await Users.findOneAndUpdate({id:user_id}, {banned:false});
		return res.status(200).json(JSON.stringify(result));
	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}



async function adminUser(req, res){
	try{
		var {user_id} = req.body
		var {user} = req.session

		var userObj = await Users.findOne({id:user_id});
		if(!userObj)
			return res.status(404).json({text:"user not exists"});

		let result = await Users.findOneAndUpdate({id:user_id}, {admin:true});
		return res.status(200).json(JSON.stringify(result));
	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}


async function unAdminUser(req, res){
	try{
		var {user_id} = req.body
		var {user} = req.session

		var userObj = await Users.findOne({id:user_id});
		if(!userObj)
			return res.status(404).json({text:"user not exists"});

		let result = await Users.findOneAndUpdate({id:user_id}, {admin:false});
		return res.status(200).json(JSON.stringify(result));
	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}


async function getUser(req, res){
	try{
		var {user_id} = req.body

		var userObj = await Users.findOne({id:user_id});
		if(!userObj)
			return res.status(404).json({text:"user not exists"});
		return res.status(200).json(JSON.stringify(userObj));
	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}

async function getAllUsers(req, res){
	try{
		var users = await Users.find({});
		return res.status(200).json(JSON.stringify(users));
	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}



exports.banUser = banUser;
exports.unBanUser = unBanUser;
exports.adminUser = adminUser;
exports.unAdminUser = unAdminUser;
