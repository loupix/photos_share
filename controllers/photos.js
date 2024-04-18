let Photos = require("../models/photos"),
	Albums = require("../models/albums"),
	Users = require("../models/users"),
	Commentaires = require("../models/commentaires"),
	Likes = require("../models/likes");


async function addComment(req, res){
	try{
		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		let {text, photo_id} = req.body;
		if(!text || !photo_id)
			return res.status(400).json("Wrong syntax");

		let photo = await Photos.findOne({_id:photo_id});
		if(!photo)
			return res.status(404).json("photo not exists");
		let comment = new Commentaires({text:text, photo:photo, author:user});
		comment = await comment.save();

		photo = await Photos.findOneAndUpdate({_id:photo_id}, {$push:{commentaires:comment}, $inc:{nbCommentaires:1}}, {returnOriginal: false});
		await Albums.findOneAndUpdate({_id:photo.album}, {$inc:{nbCommentaires:1}})
		await Users.findOneAndUpdate({_id:user._id}, {$push:{commentaires:comment}});

		let commentaires = await photo.getCommentaires();

		return res.status(200).json(commentaires);
	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}



async function updateComment(req, res){
	try{
		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		let {text, photo_id, comment_id} = req.body;
		if(!text || !photo_id || !comment_id)
			return res.status(400).json("Wrong syntax");

		let photo = await Photos.findOne({_id:photo_id});
		if(!photo)
			return res.status(404).json("photo not found");

		let comment = await Commentaires.findOne({_id:comment_id})
		if(!comment)
			return res.status(404).json("comment not exists");
		if(comment.author != user._id)
			return res.status(401).json("user is not author");

		await Commentaires.findOneAndUpdate({_id:comment_id}, {text:text});

		let commentaires = await photo.getCommentaires();

		return res.status(200).json(commentaires);
	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}



async function delComment(req, res){
	try{
		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		let {comment_id, photo_id} = req.body;
		if(!comment_id || !photo_id)
			return res.status(400).json("Wrong syntax");

		let photo = await Photos.findOne({_id:photo_id})
		if(!photo)
			return res.status(404).json("photo not found");

		let comment = await Commentaires.findOne({_id:comment_id});
		if(!comment)
			return res.status(404).json("comment not found");
		if(comment.author != user._id)
			return res.status(401).json("user is not author");

		photo = await Photos.findOneAndUpdate({_id:photo_id}, {$pull:{commentaires:comment._id}, $inc:{nbCommentaires:-1}}, {returnOriginal: false});
		await Albums.findOneAndUpdate({_id:photo.album}, {$inc:{nbCommentaires:-1}})
		await Users.findOneAndUpdate({_id:user._id}, {$pull:{commentaires:comment._id}});
		await Commentaires.deleteOne({_id:comment_id});

		let commentaires = await photo.getCommentaires();

		return res.status(200).json(commentaires);
	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}



async function addLike(req, res){
	try{
		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		let {photo_id} = req.body;
		if(!photo_id)
			return res.status(400).json("Wrong syntax");

		let photo = await Photos.findOne({_id:photo_id})
		if(!photo)
			return res.status(404).json({text:"photo not exists"});

		let like = new Likes({photo:photo, author:user})
		like = await like.save();

		await Photos.findOneAndUpdate({_id:photo_id}, {$push:{likes:like}, $inc:{nbLikes:1}});
		await Albums.findOneAndUpdate({_id:photo.album}, {$inc:{nbLikes:1}})
		await Users.findOneAndUpdate({_id:user._id}, {$push:{likes:like}});

		return get(req, res);

	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}



async function delLike(req, res){
	try{
		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		let {photo_id} = req.body;
		if(!photo_id)
			return res.status(400).json("Wrong syntax");

		let photo = await Photos.findOne({_id:photo_id})
		if(!photo)
			return res.status(404).json("photo not found");

		let like = await Likes.findOne({photo:photo, author:user});
		if(!like)
			return res.status(404).json("like not exists");
		if(like.author != user._id)
			return res.status(401).json("user is not author");

		await Photos.findOneAndUpdate({_id:photo_id}, {$pull:{likes:like._id}, $inc:{nbLikes:-1}});
		await Albums.findOneAndUpdate({_id:photo.album}, {$inc:{nbLikes:-1}})
		await Users.findOneAndUpdate({_id:user._id}, {$pull:{likes:like._id}});
		await Likes.deleteOne({_id:like._id});

		return get(req, res);
	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}





async function get(req, res){
    try{
		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		let {photo_id} = req.body;
		if(!photo_id || photo_id===undefined)
			return res.status(400).json("Wrong syntax");

		let photo = await Photos.findOne({_id:photo_id})
		if(!photo)
			return res.status(404).json("photo not found");


		let vues = await photo.getVues();
		if(!vues.map(v => v.author.toString()).includes(user._id)){
			let vue = new Photos.Vue({author:user._id, photo:photo});
		    vue = await vue.save()
		    await Albums.findOneAndUpdate({_id:photo.album}, {$inc:{nbVues:1}});
		    photo = await Photos.findOneAndUpdate({_id:photo._id}, {$push:{vues:vue}, $inc:{nbVues:1}}, {returnOriginal: false});
		}

		let next = await photo.getNext(photo_id);

		photo.author = await photo.getAuthor();
		photo.album = await photo.getAlbum();
		let userBanned = await photo.album.getBanned();
		if(userBanned)
			photo.album.isBanned = userBanned.includes(user._id) ? true : false;
		
		photo.commentaires = await photo.getCommentaires();
		photo.likes = await photo.getLikes();

		return res.status(200).json({photo:photo, next:next});

	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }

}



async function getFromUser(req, res){
    try{
    	let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		let {user_id} = req.body;
		if(!user_id)
			return res.status(400).json("Wrong syntax");


	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}

exports.addComment = addComment
exports.updateComment = updateComment
exports.delComment = delComment
exports.addLike = addLike
exports.delLike = delLike
exports.get = get
exports.getFromUser = getFromUser
