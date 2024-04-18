const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationsSchema = new Schema({
	from:{type: Schema.Types.ObjectId, ref:'Users'},
	to:{type: Schema.Types.ObjectId, ref:'Users'},
	
	picture:{type: Schema.Types.ObjectId, ref:'Pictures'},
	album:{type: Schema.Types.ObjectId, ref:'Albums'},

	content:{type:String}
	vue:{type:Boolean, default:false},

	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

notificationsSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});


notificationsSchema.methods.getFrom = async function(){
	return new Promise((resolve, reject) => {
        mongoose.model("Users").findOne({_id:this.from}, ['picture','nom','prenom','validated','createdAt','updatedAt']).then(user => resolve(user), err => reject(err));
	});
}


notificationsSchema.methods.getTo = async function(){
	return new Promise((resolve, reject) => {
        mongoose.model("Users").findOne({_id:this.to}, ['picture','nom','prenom','validated','createdAt','updatedAt']).then(user => resolve(user), err => reject(err));
	});
}

module.exports = mongoose.model('Notifications', notificationsSchema);