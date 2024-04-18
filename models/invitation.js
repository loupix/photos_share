const mongoose = require('mongoose')
const Schema = mongoose.Schema

const invitSchema = new Schema({
    email:{
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    },

    from:{type: Schema.Types.ObjectId, ref:'Users'},
    request:{type:Schema.Types.ObjectId, ref:'FriendRequest', default:null},

    validated:{type:Boolean, default:false},
    sended:{type:Boolean, default:false},
    received:{type:Boolean, default:false},

    createdAt: {type: Date, default: Date.now}
})

invitSchema.methods.getFrom = async function(){
    return new Promise((resolve, reject) => {
        mongoose.model("Users").findOne({_id:this.from}, ['picture','nom','prenom','validated','createdAt','updatedAt']).then(user => resolve(user), err => reject(err));
    });
}


invitSchema.methods.getRequest = async function(){
    return new Promise((resolve, reject) => {
        mongoose.model("FriendRequest").findOne({_id:this.from}, ['from','to','prenom','validated','createdAt','updatedAt']).then(request => {
            request.getFrom().then(user => {
                request.from = user;
                request.getTo().then(user => {
                    request.to = user;
                    resolve(request);
                }, err => reject(err));
            }, err => reject(err));
        }, err => reject(err));
    });
}

module.exports = mongoose.model('Invitations', invitSchema);