const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vueSchema = new Schema({
    author:{type: Schema.Types.ObjectId, ref:'Users'},
    photo:{type: Schema.Types.ObjectId, ref:'Photos'},
    createdAt: {type: Date, default: Date.now}
})

const Vue = mongoose.model('Vues', vueSchema);

const photoSchema = new Schema({
    src:{
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    },


    album:{type: Schema.Types.ObjectId, ref:'Albums'},
    author:{type: Schema.Types.ObjectId, ref:'Users'},

    vues:[{type: Schema.Types.ObjectId, ref:'Vues'}],
    nbVues:{type: Number, default:0},

    commentaires:[{type: Schema.Types.ObjectId, ref:'Commentaires'}],
    nbCommentaires:{type: Number, default:0},

    likes:[{type: Schema.Types.ObjectId, ref:'Likes'}],
    nbLikes:{type: Number, default:0},
    isLiked:{type: Boolean, default:false},

    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

photoSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

photoSchema.methods.getData = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Photos").findOne({_id:this._id}, ['src','createdAt']).then(photo => resolve(photo), err => reject(err));
    });
}


photoSchema.methods.getVues = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Vues").find({_id:{$in:this.vues}}).then(vues => resolve(vues), err => reject(err));
    });
}


photoSchema.methods.addVues = function(user){
    let vue = new Vue({author:user._id});
    vue = vue.save()
    return Photos.findOneAndUpdate({_id:this._id}, {$push:{vues:vue}}).then(photo => resolve(photo), err => reject(err));
}


photoSchema.methods.getCommentaires = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Commentaires").find({_id:{$in:this.commentaires}}, ['text', 'author', 'photo', 'createdAt', 'updatedAt']).then(coms => {
            Promise.all(coms.map(com => {
                return new Promise((res, rej) => {
                    com.getAuthor().then(author => {
                        com.author = author;
                        com.getPhoto().then(pict => {
                            com.photo = pict;
                            res(com);
                        }, err => rej(err));
                    }, err => rej(err));
                });
            })).then(commentaires => resolve(commentaires), err => reject(err));
        }, err => reject(err));
    });
}

photoSchema.methods.getLikes = function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Likes").find({_id:{$in:this.likes}}, ['value', 'author', 'photo', 'createdAt', 'updatedAt']).then(likes => {
            Promise.all(likes.map(like => {
                return new Promise((res, rej) => {
                    like.getAuthor().then(author => {
                        like.author = author;
                        like.getPhoto().then(pict => {
                            like.photo = pict;
                            res(like);
                        }, err => rej(err));
                    }, err => rej(err));
                });
            })).then(likes => resolve(likes), err => reject(err));
        }, err => reject(err));
    })
}

photoSchema.methods.getAuthor = function(){
    return new Promise((resolve, reject) =>{
        mongoose.model("Users").findOne({_id:this.author}, ['picture','nom','prenom', 'validated','createdAt','updatedAt']).then(user => resolve(user), err => reject(err));
    });
}

photoSchema.methods.getAlbum = function(){
    return new Promise((resolve, reject) =>{
        mongoose.model("Albums").findOne({_id:this.album}, ['name','description','photos','tags','author','show','dateCreated']).then(user => resolve(user), err => reject(err));
    });
}

photoSchema.methods.getNext = function(id){
    return new Promise((resolve, reject) =>{
        mongoose.model("Albums").findOne({_id:this.album}, ['photos']).then(rep => {
            let photos = rep.photos;
            let pos = photos.indexOf(id);
            if(pos>=photos.length-1)
                pos = 0
            else
                pos = pos +1;
            resolve(photos[pos]);
        }, err => reject(err));
    });
}


module.exports = mongoose.model('Photos', photoSchema);
module.exports.Vue = Vue;
