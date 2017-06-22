var mongoose = require('mongoose');
var User = require('../models/User.js');

var ReviewSchema = new mongoose.Schema({
	address: String,
	availability: Boolean,
	baths: Number,
    beds: Number,
    city: String,
    country: String,
    description: String,
    price: Number,
    location: [String],
    video: Object,
    price_type: String,
    property_type: String,
    square: Number,
    state: String,
    zipcode: String,
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('Review', ReviewSchema);