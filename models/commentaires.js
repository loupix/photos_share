const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    text:{
        type: String,
        lowercase: true,
        trim: true,
        unique: false,
        required: true
    },

    photo:{type: Schema.Types.ObjectId, ref:'Photos'},
    author:{type: Schema.Types.ObjectId, ref:'Users'},

    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

commentSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});


commentSchema.methods.getData = async function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Commentaires").findOne({_id:this._id}, ['photo','text', 'author','createdAt']).then(com => resolve(com), err => reject(err));
    });
}

commentSchema.methods.getAuthor = async function(){
    return new Promise((resolve, reject) =>{
        mongoose.model("Users").findOne({_id:this.author}, ['picture','nom','prenom','validated','createdAt','updatedAt']).then(user => resolve(user), err => reject(err));
    });
}


commentSchema.methods.getPhoto = async function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Photos").findOne({_id:this.photo}, ['src','author','createdAt']).then(photo => resolve(photo), err => reject(err));
    })
}

module.exports = mongoose.model('Commentaires', commentSchema);