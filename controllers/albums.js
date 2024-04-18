let Album = require("../models/albums"),
	Photo = require("../models/photos"),
	Tag = require("../models/tags"),
	Users = require("../models/users"),
	friendRequest = require("../models/friendRequest");

const config = require('../config/environment'),
  path = require("path"),
  fs = require("fs"),
  ObjectId = require('mongoose').Types.ObjectId; 


async function ajout(req, res){
	try{
		let {name, description, dateCreated, tags, banned, photos} = req.body;
		if(!name || !photos)
			return res.status(400).json("Wrong syntax");

		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");
		
		let photosData = await Promise.all(photos.map((src) => {
			let photo = new Photo({src:src, author:user});
			return photo.save();
		}));


		let tagData = await Promise.all(tags.map((txt) => {
			return Tag.findOne({value:txt}).exec().then((tagObj) => {
				if(!tagObj){
					let tag = new Tag({value:txt});
					return tag.save();
				}
				return tagObj;
			});
		}));

		let userBanned = [];
		if(banned.length > 0)
			userBanned = await Users.find({_id:{$in:banned}});

		let album = {
			name:name,
			description:description,
			dateCreated:dateCreated,
			author:user,
			tags:tagData,
			banned:userBanned,
			photos:photosData,
		}

		let albumData = new Album(album);
		albumData = await albumData.save();
		user = await Users.findOneAndUpdate({_id:user._id}, {$push:{albums:albumData}}, {returnOriginal: false}).exec();
		await Photo.updateMany({_id:{$in:photosData.map(p => p._id)}}, {$set:{album:albumData}}).exec();
		req.session.user = user;
		req.session.save(err => {
			if(err){
                console.error(err);
                return res.status(500).json(err);
            }
            return res.status(200).json(albumData);
		});

	}catch (error) {
		console.error(error);
        return res.status(500).json({ error });
    }
}

async function update(req, res){
	try{
		var {id, name, description, dateCreated, tags} = req.body;
		if(!id || !name || !description || !dateCreated || !tags)
			return res.status(400).json("Wrong syntax");

		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");


		let findAlbum = await Album.findOne({_id:id, author:user._id});
		if(!findAlbum)
			return res.status(404).json("Album not found");

		// let photosData = await photos.map((pict) =>{
		// 	return Photo.findOne({src:pict.src}).exec().then((photo) => {
		// 		if(!findPict){
		// 			let pictObj = new Photo({src:pict.src, album:findAlbum});
		// 			return pictObj.save();
		// 		}
		// 		return findPict;
		// 	});
		// });

		let tagData = await Promise.all(tags.map((txt) => {
			return Tag.findOne({value:txt}).exec().then((tagObj) => {
				if(!tagObj){
					let tag = new Tag({value:txt});
					return tag.save();
				}
				return tagObj;
			});
		}));

		let update = {
			name:name,
			description:description,
			tags:tagData,
			dateCreated: dateCreated,
			updatedAt : new Date(Date.now()),
			// photos:photosData,
		}
		
		let albumData = await Album.findOneAndUpdate({_id:id, author:user._id}, update, {returnOriginal: false});
		albumData = await albumData.load()
		return res.status(200).json(albumData);
	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}



async function remove(req, res){
	try{
		let {id} = req.body;
		if(!id)
			return res.status(400).json("Wrong syntax");

		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		let album = await Album.findOne({_id:id});
		if(!album)
			return res.status(404).json("album not found");
		if(album.author!=user._id)
			return res.status(403).json("album is not yours");

		// Delete photos files
		album.getPhotos().then(photos => {
			Promise.all(photos.map(photo => {
				return new Promise((resolve, reject) => {
					let pathName = path.join(config.root, "public", "images", "photos", "original", photo.src);
					fs.unlink(pathName, err => {
						if(err)
							reject(err)
						else{
							pathName = path.join(config.root, "public", "images", "photos", "medium", photo.src);
							fs.unlink(pathName, err => {
								if(err) reject(err);
								else{
									pathName = path.join(config.root, "public", "images", "photos", "small", photo.src);
									fs.unlink(pathName, err => {
										if(err) reject(err);
										else resolve(true);
									});
								}
							});
						}
					});
				}).then(rep => {

					// Delete photos & albums in BDD
					let photoIds = photos.map(p => p._id);
					Photo.deleteMany({_id:{$in:photoIds}}).then(rep => {
						Users.findOneAndUpdate({_id:user._id}, {$pull:{albums:album._id}}, {returnOriginal: false}).then(user => {
							Album.deleteOne({_id:album._id}).then(rep => {
								req.session.user = user;
								req.session.save(err => {
									if(err){
						                console.error(err);
						                return res.status(424).json(err);
						            }
						            user.getAlbums().then(albums => {
						            	return res.status(200).json(albums);
						            }, err => {
						            	console.error(err);
						                return res.status(424).json(err);
						            })
						        });
							}, err => {
								console.error(err);
								return res.status(424).json(err);
							})
						}, err => {
							console.error(err);
							return res.status(424).json(err);
						})
					}, err => {
						console.error(err);
						return res.status(424).json(err);
					});

				}, err => {
					console.error(err);
					return res.status(424).json(err);
				})
			}))
		})


	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}




async function limitAccess(req, res){
	try{
		var {id, userIds} = req.body;
		if(!id)
			return res.status(400).json("Wrong syntax");

		var {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		var album = await Album.findOne({_id:id});
		if(!album)
			return res.status(404).json("album not found");

		if(album.author!=user._id)
			return res.status(403).json("album is not yours");

		let users = await Users.find({_id:{$in:userIds}});
		album = await Album.findOneAndUpdate({_id:album.id}, {restricted:true, banned:users});
		album = await album.load();
		return res.status(200).json(album);

	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}


async function unShow(req, res){
	try{
		var {id} = req.body;
		var {user} = req.session;
		var findAlbum = await Album.findOne({id:id, user:user});
		if(!findAlbum)
			return res.status(404).json({text:"album not exists"});

		// var result = await Album.deleteOne({id:id})

		var albumData = await Album.findOneAndUpdate({id:id}, {show:false}, {returnOriginal: false});
		return res.status(200).json(JSON.stringify(albumData));

	}catch (error) {
        return res.status(500).json({ error });
    }
}


async function show(req, res){
	try{
		var {id} = req.body;
		var {user} = req.session;
		var findAlbum = await Album.findOne({id:id, user:user});
		if(!findAlbum)
			return res.status(404).json({text:"album not exists"});

		// var result = await Album.deleteOne({id:id})

		var albumData = await Album.findOneAndUpdate({id:id}, {show:true}, {returnOriginal: false});
		return res.status(200).json(JSON.stringify(albumData));
	}catch (error) {
        return res.status(500).json({ error });
    }
}

async function get(req, res){
	try{
		let {id} = req.body;
		if(!id)
			return res.status(400).json("Wrong syntax");

		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		let album = await Album.findOne({_id:id}, ['name','description','photos','tags','author','dateCreated','show','banned','isBanned','restricted']);
		if(!album)
			return res.status(404).json("album not found");


		// Recherche les limitation d'acces
		if(album.author.toString() !== user._id){
			album.author = await album.getAuthor();
			album.tags = await album.getTags();
			let request = await friendRequest.findOne({from:user._id, to:album.author});
			if(!request)
	            return res.status(200).json({album:album, error:"Aucunes invitation envoyés"});
	        else if(!request.vue)
	            return res.status(200).json({album:album, error:"Invitation envoyée mais pas vue"});
	        else if(!request.accepted)
	            return res.status(200).json({album:album, error:"Invitation non acceptée"});


			if(album.restricted){
				if(album.banned.includes(user._id)){
					album.isBanned=true;
					return res.status(200).json(album);
				}
			}
		};

		album = await album.load();
		if(album.author.toString() !== user._id){
			let authorFriends = await album.author.getFriends();
			if(authorFriends.map(u => u._id).includes(user._id))
				album.isBanned=true;
		}

		return res.status(200).json(album);
	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}

async function getMe(req, res){
	try{
		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		let proms = user.albums.map((albumId) => {
			return new Promise((resolve, reject) => {
				Album.findOne({_id:albumId}, ['name','description','photos','tags','author','nbCommentaires', 'nbLikes', 'nbVues', 'dateCreated','show']).then((album) => {
					album.load().then(albumData => resolve(albumData), err => reject(err));
				}, err => reject(err));
			});
		});
		return await Promise.all(proms).then(albums => res.status(200).json(albums), err => {console.error(err);res.status(500).json(error);})
	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}



async function getBanned(req, res){
	try{
		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		let {album_id} = req.body;
		if(!album_id)
			return res.status(400).json("Wrong syntax");

		let album = await Album.findOne({_id:album_id}, ['banned']);
		if(!album)
			return res.status(404).json("Abum not found");

		user = await Users.findOne({_id:user._id});
		let users = await user.getFriends();
		users = users.map(user => {
			user.banned = false;
			if(album.banned.includes(user._id))
				user.banned = true;
			return user;
		});

		return res.status(200).json(users);


	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}


async function addBanned(req, res){
	try{
		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		let {album_id, user_id} = req.body;
		if(!album_id || !user_id)
			return res.status(400).json("Wrong syntax");

		let userObj = await Users.findOne({_id:user_id});
		if(!userObj)
			return res.status(404).json("User not found");

		let album = await Album.findOne({_id:album_id, author:user._id}, ['banned']);
		if(!album)
			return res.status(404).json("Album not found");

		if(!album.banned.includes(user_id)){
			await Album.findOneAndUpdate({_id:album_id, author:user._id}, {$push:{banned:userObj}});
		}
		return getBanned(req, res);


	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}


async function delBanned(req, res){
	try{
		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		let {album_id, user_id} = req.body;
		if(!album_id || !user_id)
			return res.status(400).json("Wrong syntax");

		let userObj = await Users.findOne({_id:user_id});
		if(!userObj)
			return res.status(404).json("User not found");

		let album = await Album.findOne({_id:album_id, author:user._id}, ['banned']);
		if(!album)
			return res.status(404).json("Album not found");

		if(album.banned.includes(user_id)){
			await Album.findOneAndUpdate({_id:album_id, author:user._id}, {$pull:{banned:userObj._id}});
		}
		return getBanned(req, res);


	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}


async function find(req, res){
	try{
		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		let {value} = req.body;

		// user = await Users.findOne({_id:user._id}, ['friends']);
		// let friends = await user.getFriends()
		// friends = friends.map(u => ObjectId(u._id));
		// if(!friends.includes(user._id))
		// 	friends.push(ObjectId(user._id));


		let tags = await Tag.find({value:{$regex:'.*'+value+'*'}});
		let albums = await Album.find({$or:[{tags:{$in:tags}}, {name:{$regex:'.*'+value+'*'}}, {description:{$regex:'.*'+value+'*'}}], show:true});
		albums = albums.map(album => {
			if(album.author == user._id)
				return album;

			if(album.restricted){
				if(album.banned.includes(user._id))
					return false;
			}

			if(user.friends.includes(album.author))
				return album;

			return false;
		}).filter(a=>a);

		Promise.all(albums.map(album => album.load())).then(albums => res.status(200).json(albums), err => res.status(500).json(err))

	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}



async function findTag(req, res){
	try{
		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		let {tag} = req.body;
		if(!tag)
			return res.status(400).json("Wrong syntax");

		// user = await Users.findOne({_id:user._id}, ['friends']);
		// let friends = await user.getFriends()
		// friends = friends.map(u => u._id);
		// if(!friends.includes(user._id))
		// 	friends.push(user._id);
		
		let tags = await Tag.find({value:{$regex:'.*'+tag+'*'}});
		let albums = await Album.find({tags:{$in:tags},show:true});
		albums = albums.map(album => {
			if(album.author == user._id)
				return album;

			if(album.restricted){
				if(album.banned.includes(user._id))
					return false;
			}

			if(user.friends.includes(album.author))
				return album;

			return false;
		}).filter(a=>a);

		Promise.all(albums.map(album => album.load())).then(albums => res.status(200).json(albums), err => res.status(500).json(err))

	}catch (error) {
		console.error(error);
        return res.status(500).json(error);
    }
}



async function getFromFriends(req, res){
	try{
		var {id} = req.body;
	}catch (error) {
        return res.status(500).json({ error });
    }
}


async function getDashboard(req, res){
	try{
		let {user} = req.session;
		if(!user)
			return res.status(401).json("Not connected");

		let friends = user.friends;
		if(!friends.includes(user._id))
			friends.push(user._id);

		let albums = await Album.find({author:{$in:friends}, show:true});
		albums = albums.filter(album => {
			return !album.banned.includes(user._id);
		}).sort((a,b) => {return a.createdAt - b.createdAt});

		let commentaires = [],
			likes = [];

		Promise.all(albums.map(album => {
			return album.load();
		})).then(albums => {
			for(let i in albums){
				for(let j in albums[i].commentaires)
					commentaires.push(albums[i].commentaires[j]);
				for(let j in albums[i].likes)
					likes.push(albums[i].likes[j]);
			}
			commentaires.sort((a,b) => {return b.createdAt-a.createdAt});
			likes.sort((a,b) => {return b.createdAt-a.createdAt});
			albums.sort((a,b) => {return b.createdAt-a.createdAt});
			res.status(200).json({albums:albums, commentaires:commentaires, likes:likes});
		}, err => res.status(500).json(err));

	}catch (error) {
        return res.status(500).json({ error });
    }
}



exports.ajout = ajout
exports.update = update
exports.remove = remove
exports.show = show
exports.unShow = unShow

exports.get = get
exports.getMe = getMe
exports.getFromFriends = getFromFriends
exports.getDashboard = getDashboard

exports.getBanned = getBanned
exports.addBanned = addBanned
exports.delBanned = delBanned

exports.find = find
exports.findTag = findTag
exports.limitAccess = limitAccess