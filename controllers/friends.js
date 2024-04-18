const Users = require("../models/users"),
    Invitations = require("../models/invitation"),
    FriendRequest = require("../models/friendRequest");

const config = require('../config/environment'),
    fs = require("fs"),
    path = require("path"),
    jade = require("jade"),
    nodemailer = require('nodemailer');


async function get(req, res){
	try{
		let {user} = req.session;
        if(!user)
            return res.status(403).json("User not exists");

        let friends = await user.friends.map((user) => {
        	return Users.findOne({_id:user._id}).exec().then((u) => {return u;})
        });
        return res.status(200).json(friends);

    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


async function create(req, res){
	try{
		let {email, message} = req.body;
        if(!email)
            return res.status(401).json("Wrong syntax");

		let {user} = req.session;
        if(!user)
            return res.status(403).json("User not exists");

		let findUser = await Users.findOne({email:email}, ['nom','prenom','email'])
        if(findUser)
            return res.status(403).json("Utilisateur déjà enregistrer");


		findUser = new Users({email:email, validated:false});
		findUser = await findUser.save();

        let request = await FriendRequest.findOne({from:user._id, to:findUser._id})
        if(request)
            return res.status(403).json("Requête déjà envoyés");

        request = new FriendRequest({from:user._id, to:findUser._id});
        request = await request.save();

        let invitation = await Invitations.findOne({email:email, from:user._id});
        if(invitation)
            return res.status(403).json("Invitation déjà envoyés");

        invitation = new Invitations({email:email, from:user._id, request:request._id});
        invitation = await invitation.save();


        // Send Email
        let transporter = nodemailer.createTransport(config.mail.server);
        let host = req.get("host");
        let url = host+"/invitation/"+invitation._id;

        let contentHtml = fs.readFileSync(path.join(config.root,"views","invitation.jade"));
        let options = {
            hostname: req.get("host"),
            url: url,
            user: user,
            message: message
        };

        contentHtml = await jade.compile(contentHtml)(options)
        try{
            let sendMail = await transporter.sendMail({from:config.mail.sender, to:email, subject:"Invitation à voir des photos", html: contentHtml});
            if(sendMail)
                invitation = await Invitations.findOneAndUpdate({_id:invitation._id}, {sended:true}, {returnOriginal: false});
        }catch (error) {
            console.error(error);
            await Invitations.deleteOne({_id:invitation._id});
            await FriendRequest.deleteOne({_id:request._id});
            await Users.deleteOne({_id:findUser._id});
            return res.status(403).json(error);
        }

		await Users.findOneAndUpdate({_id:user._id}, {$push:{
            invitations:invitation._id, 
            friendRequests_send:request._id}});

        await Users.findOneAndUpdate({_id:findUser._id}, {$push:{
            invitations:invitation._id, 
            friendRequests_receive:request._id}});

        user = await Users.findOne({_id:user._id}, 
            ['picture','nom','prenom','friends','albums','photos','friendRequests_receive','friendRequests_send','createdAt','updatedAt'], 
            {returnOriginal: false});

        req.session.user = user
        user.friends = await user.getFriends();
        user.albums = await user.getAlbums();
        user.friendRequests_send = await user.getRequestSend();
        user.friendRequests_receive = await user.getRequestReceive();
		req.session.save(err => {
            if(err) return res.status(500).json(err)
            return res.status(200).json({
                token: user.getToken(),
                user:req.session.user,
                invitation:invitation
            });
        });

    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}



async function createMultiple(req, res){
	try{
		let {emails} = req.body;
        if(!emails)
            return res.status(401).json("Wrong syntax");

		let {user} = req.session;
        if(!user)
            return res.status(403).json("User not exists");

		let results = [];
		for(let i in emails){
			let email = emails[i];
			let findUser = Users.findOne({email:email})
			if(!findUser){
				findUser = new User({email:email, validated:false});
				findUser = await findUser.save();
			}
			let result = await Users.findOneAndUpdate({id:user._id}, {$push:{friends:findUser}});
			results.push({email:email, result:result});
		}
		user = await Users.findOne({id:user._id}, ['picture','nom','prenom','friends','albums','photos','createdAt','updatedAt']);
        req.session.user = user
        user.friends = await user.getFriends();
        user.albums = await user.getAlbums();
		req.session.save(err => {
            if(err) return res.status(500).json(err)
            return res.status(200).json({
                token: user.getToken(),
                user:req.session.user
            });
        });

    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}



async function add(req, res){
	try{
		let {id} = req.body;
        if(!id)
            return res.status(401).json("Wrong syntax")

		let {user} = req.session;
        if(!user)
            return res.status(403).json("User not exists");

        let findUser = await Users.findOne({_id:id}, ['email']);
        if(!findUser)
        	return res.status(404).json("User not found");


        // Send Email
        let transporter = nodemailer.createTransport(config.mail.server);
        let host = req.get("host");
        // let url = host+"/invitation/"+invitation._id;

        let contentHtml = fs.readFileSync(path.join(config.root,"views","friendRequest.jade"));
        let options = {
            hostname: req.get("host"),
            url: host,
            user: user
        };

        contentHtml = await jade.compile(contentHtml)(options)
        try{
            let sendMail = await transporter.sendMail({from:config.mail.sender, to:findUser.email, subject:"Invitation à voir des photos", html: contentHtml});
        }catch (error) {
            console.error(error);
            return res.status(403).json(error);
        }



        let request = new FriendRequest({from:user, to:findUser});
        request = await request.save();

        await Users.findOneAndUpdate({_id:user._id}, {$push:{friendRequests_send:request}});
        await Users.findOneAndUpdate({_id:findUser._id}, {$push:{friendRequests_receive:request}});

        user = await Users.findOne({_id:user._id}, ['picture','nom','prenom','friends','albums','photos','friendRequests_receive','friendRequests_send','createdAt','updatedAt']);
        req.session.user = user
        user.friends = await user.getFriends();
        user.albums = await user.getAlbums();
        user.friendRequests_send = await user.getRequestSend();
        user.friendRequests_receive = await user.getRequestReceive();
        req.session.save(err => {
            if(err){
                console.error(err);
                return res.status(500).json(err);
            }
            return res.status(200).json({
                token: user.getToken(),
                user:user
            });
        });

    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


async function remove(req, res){
	try{
		let {id} = req.body;
        if(!id)
            return res.status(401).json("Wrong syntax");

		let {user} = req.session;
        if(!user)
            return res.status(403).json("User not exists");

        let findUser = await Users.findOne({_id:id});
        if(!findUser)
        	return res.status(404).json("User not found");

        let request = await FriendRequest.findOne({from:user._id, to:findUser._id});
        if(!request)
            request = await FriendRequest.findOne({to:user._id, from:findUser._id});
        if(!request){
            // return res.status(404).json("Request not found");
            request = new FriendRequest({from:user._id, to:findUser._id});
            request = await request.save()
        }

        await Users.findOneAndUpdate({_id:user._id}, {$pull:{friends:findUser._id, friendRequests_send:request._id, friendRequests_receive:request._id}});
        await Users.findOneAndUpdate({_id:findUser._id}, {$pull:{friends:findUser._id, friendRequests_send:request._id, friendRequests_receive:request._id}});
        await FriendRequest.deleteOne({_id:request._id});

        user = await Users.findOne({_id:user._id}, ['picture','nom','prenom','friends','albums','photos','friendRequests_receive','friendRequests_send','createdAt','updatedAt']);
        req.session.user = user;
        user.friends = await user.getFriends();
        user.albums = await user.getAlbums();
        user.friendRequests_send = await user.getRequestSend();
        user.friendRequests_receive = await user.getRequestReceive();
        req.session.save(err => {
            if(err){
                console.error(err);
                return res.status(500).json(err);
            }
            return res.status(200).json({
                token: user.getToken(),
                user:user
            });
        });

    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


exports.get = get;
exports.create = create;
exports.createMultiple = createMultiple;
exports.add = add;
exports.remove = remove;
