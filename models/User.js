var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
  email: { type: String, unique: true, required: true },
  role: String,
  phone: String,
  description: String,
  website_url: String,
  avatar: Object,
  name: String,
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false }));