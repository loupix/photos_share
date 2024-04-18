const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = require('mongoose').Types.ObjectId; 

const albumSchema = new Schema({

	name:{type:String, required:true},
	description:{type:String, required:false},

    photos:[{type: Schema.Types.ObjectId, ref:'Photos'}],
    tags:[{type: Schema.Types.ObjectId, ref:'Tags'}],
    author:{type: Schema.Types.ObjectId, ref:'Users'},

    commentaires:[{type: Schema.Types.ObjectId, ref:'Commentaires'}],
    nbCommentaires:{type: Number, default:0},

    likes:[{type: Schema.Types.ObjectId, ref:'Likes'}],
    nbLikes:{type: Number, default:0},

    nbVues:{type: Number, default:0},

    show:{type:Boolean, default:true},

    banned:[{type: Schema.Types.ObjectId, ref:'Users'}],
    isBanned:{type:Boolean, default:false},
    restricted:{type:Boolean, default:false},

    dateCreated: {type: Date, default: Date.now},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

albumSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

albumSchema.methods.getData = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Albums").find({_id:this._id}, ['name','description','photos','tags','author','show','dateCreated']).then(album => {
            album.load().then(alb => resolve(alb), err => reject(err));
        }, err => reject(err));
    })
}


albumSchema.methods.getCommentaires = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Photos").find({_id:{$in:this.photos}}).then(photos => {
            Promise.all(photos.map(photo => {
                return new Promise((res, rej) => {
                    photo.getCommentaires().then(coms => res(coms), err => rej(err));
                })
            })).then(commentaires => {
            	let coms = [];
				for(let i in commentaires){
					for(let j in commentaires[i])
						coms.push(commentaires[i][j]);
				}
                resolve(coms);
            }, err => reject(err));
        });
    });
}


albumSchema.methods.getNbCommentaires = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Photos").find({_id:{$in:this.photos}}).then(photos => {
            resolve(photos.map(photo => photo.nbCommentaires).reduce((a, b) => a+b));
        });
    });
}


albumSchema.methods.getLikes = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Photos").find({_id:{$in:this.photos}}).then(photos => {
            Promise.all(photos.map(photo => {
                return new Promise((res, rej) => {
                    photo.getLikes().then(liks => res(liks), err => rej(err));
                })
            })).then(likes => {
            	let liks = [];
				for(let i in likes){
					for(let j in likes[i])
						liks.push(likes[i][j]);
				}
                resolve(liks);
            }, err => reject(err));
        });
    });
}


albumSchema.methods.getNbLikes = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Photos").find({_id:{$in:this.photos}}).then(photos => {
            resolve(photos.map(photo => photo.nbLikes).reduce((a, b) => a+b));
        });
    });
}


albumSchema.methods.getPhotos = function(){
    return new Promise((resolve, reject) => {
        mongoose.model('Photos').find({_id:{$in:this.photos.map(v => ObjectId(v))}}, ['src', 'commentaires', 'likes', 'nbCommentaires', 'nbLikes', 'nbVues', 'createdAt']).exec().then((photos) => resolve(photos), err => reject(err));
    });
}

albumSchema.methods.getTags = function(){
    return new Promise((resolve, reject) => {
        mongoose.model('Tags').find({_id:{$in:this.tags}}, ['value']).then((tags) => resolve(tags), err => reject(err));
    });
}

albumSchema.methods.getAuthor = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Users").findOne({_id:this.author}, ['picture','nom','prenom','createdAt','updatedAt']).then(user => resolve(user), err => reject(err));
    });
}


albumSchema.methods.getBanned = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Users").findOne({_id:{$in:this.banned}}, ['picture','nom','prenom','createdAt','updatedAt']).then(users => resolve(users), err => reject(err));
    });
}

albumSchema.methods.load = function(){
    let elt = this;
    return new Promise((resolve, reject) => {
        this.getPhotos().then(photos => {
            elt.photos = photos;
            this.getTags().then(tags =>{
                elt.tags = tags;
                this.getAuthor().then(author => {
                    elt.author = author;
                    this.getCommentaires().then(coms => {
                    	elt.commentaires = coms;
                    	this.getLikes().then(likes => {
                    		elt.likes = likes;
		                    if(elt.restricted){
		                        this.getBanned().then(users => {
		                            elt.banned=users;
		                            resolve(elt);
		                        })
		                    }else
		                        resolve(elt);
		                }, err => reject(err));
                    }, err => reject(err));
                }, err => reject(err));
            }, err => reject(err));
        }, err => reject(err));
    });
}

module.exports = mongoose.model('Albums', albumSchema);