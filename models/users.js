const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passwordHash = require("password-hash")
const jwt = require("jwt-simple")
const config = require('../config/environment')

const userSchema = new Schema({
    nom:{
        type: String,
        // lowercase: true,
        // trim: true,
        required: false
    },

    prenom:{
        type: String,
        // lowercase: true,
        // trim: true,
        required: false
    },

    email:{
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    },

    password:{type:String,required:false},
    picture:{type:String,default:false},

    albums:[{type: Schema.Types.ObjectId, ref:'Albums'}],
    photos:[{type: Schema.Types.ObjectId, ref:'Photos'}],

    invitations:[{type: Schema.Types.ObjectId, ref:'Invitations'}],
    notifications:[{type: Schema.Types.ObjectId, ref:'Notifications'}],
    friends:[{type: Schema.Types.ObjectId, ref:'Users'}],

    friendRequests_send:[{type: Schema.Types.ObjectId, ref:'FriendRequest'}],
    friendRequests_receive:[{type: Schema.Types.ObjectId, ref:'FriendRequest'}],

    commentaires:[{type: Schema.Types.ObjectId, ref:'Commentaires'}],
    likes:[{type: Schema.Types.ObjectId, ref:'Likes'}],

    validated:{type:Boolean,default:false},
    verified:{type:Boolean,default:false},
    banned:{type:Boolean,default:false},
    moderateur:{type:Boolean,default:false},
    admin:{type:Boolean,default:false},

    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

userSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

userSchema.methods = {
    authenticate: function(password) {
        return passwordHash.verify(password, this.password);
    },
    getToken: function() {
        return jwt.encode(this, config.secrets.session);
    }
}



////// Gestion des amis /////

userSchema.methods.getFriends = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Users").find({_id:{$in:this.friends}}, ['picture','nom','prenom', 'email', 'albums', 'friends', 'validated','createdAt','updatedAt']).then(users => resolve(users), err => reject(err));
    });
}


userSchema.methods.getFriendsAccepted = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("FriendRequest").find({_id:{$in:this.friendRequests_send}, accepted:true, vue:true}, ['to']).then(requests => {
            let userIds = requests.map(request => request.to);
            mongoose.model("Users").find({_id:{$in:userIds}}, ['picture','nom','prenom', 'email', 'validated','createdAt','updatedAt']).then(users => resolve(users), err => reject(err));
        }, err => reject(err));
    });
}


userSchema.methods.getFriendsBackAccepted = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("FriendRequest").find({_id:{$in:this.friendRequests_receive}, accepted:true, vue:true}, ['from']).then(requests => {
            let userIds = requests.map(request => request.from);
            mongoose.model("Users").find({_id:{$in:userIds}}, ['picture','nom','prenom', 'email', 'validated','createdAt','updatedAt']).then(users => resolve(users), err => reject(err));
        }, err => reject(err));
    });
}


userSchema.methods.getFriendsRequest = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("FriendRequest").find({_id:{$in:this.friendRequests_send}}, ['to','accepted','vue','createdAt']).then(requests => {
            let userIds = requests.map(request => request.to);
            let values = {};
            for(let i in requests){
                let request = requests[i];
                values[request.to] = {_id:request._id, accepted:request.accepted, vue:request.vue};
            }
            mongoose.model("Users").find({_id:{$in:userIds}}, ['picture','nom','prenom', 'email', 'validated','createdAt','updatedAt']).then(users => {
                for(let i in users){
                    let u = users[i];
                    let v = values[u._id];
                    users[i].request = {_id:v._id, vue:v.vue, accepted:v.accepted};
                }
                resolve(users);
            }, err => reject(err));
        }, err => reject(err));
    });
}



userSchema.methods.getFriendsBackRequest = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("FriendRequest").find({_id:{$in:this.friendRequests_receive}}, ['from','accepted','vue','createdAt']).then(requests => {
            let userIds = requests.map(request => request.from);
            let values = {};
            for(let i in requests){
                let request = requests[i];
                values[request.from] = {_id:request._id, accepted:request.accepted, vue:request.vue};
            }
            mongoose.model("Users").find({_id:{$in:userIds}}, ['picture','nom','prenom', 'email', 'validated','createdAt','updatedAt']).then(users => {
                for(let i in users){
                    let u = users[i];
                    let v = values[u._id];
                    users[i].request = {_id:v._id, vue:v.vue, accepted:v.accepted};
                }
                resolve(users);
            }, err => reject(err));
        }, err => reject(err));
    });
}



userSchema.methods.updateFriends = function(){
    return new Promise((resolve, reject) => {
        this.getFriendsAccepted().then(users => {
            this.findOneAndUpdate({_id:this._id}, {friends:users}, {returnOriginal: false}).then(me => resolve(me), err => reject(err));
        }, err => reject(err));
    })
}



userSchema.methods.getNotifications = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Notifications").find({_id:{$in:this.notifications}}, ['from', 'to', 'picture', 'album','createdAt']).then(notifications => resolve(notifications), err => reject(err));
    });
}


userSchema.methods.getPhotos = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Photos").find({_id:{$in:this.photos}}, ['src', 'createdAt']).then(photos => resolve(photos), err => reject(err));
    });
}


userSchema.methods.getRequestSend = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("FriendRequest").find({_id:{$in:this.friendRequests_send}, from:this._id, vue:false}, ['accepted', 'vue','to', 'createdAt']).then(requests => {
            Promise.all(requests.map(request => {
                return new Promise((res, rej) => {
                    mongoose.model("Users").findOne({_id:request.to}, ['picture','nom','prenom', 'email','validated','albums','friends','createdAt','updatedAt']).then(user => {
                        request.to = user;
                        res(request);
                    }, err => rej(err));
                })
            })).then(requests => resolve(requests), err => reject(err));
        }, err => reject(err));
    });
}

userSchema.methods.getRequestReceive = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("FriendRequest").find({_id:{$in:this.friendRequests_receive}, to:this._id, vue:false}, ['accepted', 'vue','from', 'createdAt']).then(requests => {
            Promise.all(requests.map(request => {
                return new Promise((res, rej) => {
                    mongoose.model("Users").findOne({_id:request.from}, ['picture','nom','prenom', 'email','validated','albums','friends','createdAt','updatedAt']).then(user => {
                        request.from = user;
                        res(request);
                    }, err => rej(err));
                })
            })).then(requests => resolve(requests), err => reject(err));
        }, err => reject(err));
    });
}

userSchema.methods.getAlbums = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Albums").find({_id:{$in:this.albums}}, ['name','description','photos','tags','author','dateCreated','show','nbCommentaires','nbLikes']).then(albums => {
            Promise.all(albums.map(album => album.load())).then(albumsData => resolve(albumsData), err => reject(err));
        }, err => reject(err));
    });
}

userSchema.methods.getCommentaires = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Commentaires").find({_id:{$in:this.commentaires}}, ['text','photo','createdAt']).then(commentaires => {
            Promise.all(commentaires.map(com => com.get())).then(coms => resolve(coms), err => reject(err));
        }, err => reject(err));
    });
}

userSchema.methods.getLikes = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Likes").find({_id:{$in:this.likes}}, ['value','photo','createdAt']).then(likes => {
            Promise.all(likes.map(like => like.get())).then(liks => resolve(liks), err => reject(err));
        }, err => reject(err));
    });
}



module.exports = mongoose.model('Users', userSchema);