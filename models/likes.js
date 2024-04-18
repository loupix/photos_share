const mongoose = require('mongoose')
const Schema = mongoose.Schema

const likeSchema = new Schema({
    photo:{type: Schema.Types.ObjectId, ref:'Photos'},
    author:{type: Schema.Types.ObjectId, ref:'Users'},

    value:{type:Boolean, default:true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

likeSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

likeSchema.methods.getData = async function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Likes").findOne({_id:this._id}, ['photo','value','createdAt']).then(like => resolve(like), err => reject(err));
    });
}

likeSchema.methods.getAuthor = async function(){
    return new Promise((resolve, reject) =>{
        mongoose.model("Users").findOne({_id:this.author}, ['picture','nom','prenom', 'validated','createdAt','updatedAt']).then(user => resolve(user), err => reject(err));
    });
}

likeSchema.methods.getPhoto = async function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Photos").findOne({_id:this.photo}, ['src','author','createdAt']).then(photo => resolve(photo), err => reject(err));
    })
}

module.exports = mongoose.model('Likes', likeSchema);