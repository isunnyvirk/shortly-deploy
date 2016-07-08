var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var Schema = mongoose.Schema; 

var linkSchema = new Schema({
  url: {type: String, unique: true},
  baseUrl: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0 }
},
{ timestamps: { createdAt: 'created_at'}
});

var userSchema = new Schema({
  username: {type: String, unique: true},
  password: String,
},
{ timestamps: { createdAt: 'created_at'}
});

exports.linkSchema = linkSchema; 
exports.userSchema = userSchema; 

