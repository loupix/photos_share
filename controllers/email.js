var Album = require("../models/albums"),
	Users = require("../models/users");


async function sendMail(req, res){
	try{	
		let {user} = req.session;
		if(!user)p
			return res.status(401).json("not connected");


	}catch (error) {
        return res.status(500).json({ error });
    }
}