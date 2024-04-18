const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tagSchema = new Schema({
    value:{
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    },

    albums:[{type: Schema.Types.ObjectId, ref:'Albums'}],
    photos:[{type: Schema.Types.ObjectId, ref:'Photos'}],

    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})


tagSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
})

module.exports = mongoose.model('Tags', tagSchema);