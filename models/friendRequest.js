const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendRequestSchema = new Schema({
	from:{type: Schema.Types.ObjectId, ref:'Users'},
	to:{type: Schema.Types.ObjectId, ref:'Users'},

	accepted:{type:Boolean, default:false},
	vue:{type:Boolean, default:false},

	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

friendRequestSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

friendRequestSchema.methods.getFrom = async function(){
	return new Promise((resolve, reject) => {
        mongoose.model("Users").findOne({_id:this.from}, ['picture','nom','prenom','validated','createdAt','updatedAt']).then(user => resolve(user), err => reject(err));
	});
}


friendRequestSchema.methods.getTo = async function(){
	return new Promise((resolve, reject) => {
        mongoose.model("Users").findOne({_id:this.to}, ['picture','nom','prenom','validated','createdAt','updatedAt']).then(user => resolve(user), err => reject(err));
	});
}


module.exports = mongoose.model('FriendRequest', friendRequestSchema);