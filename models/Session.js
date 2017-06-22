var mongoose = require('mongoose');
var User = require('../models/User.js');

var SessionSchema = new mongoose.Schema({
	title: { type: String, required: true },
	desription: String,
	agenda: [String],
	date: Date,
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	attendies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	createdAt: { type: Date, default: Date.now },
}, { versionKey: false });

module.exports = mongoose.model('Session', SessionSchema);