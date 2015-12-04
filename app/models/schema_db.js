var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: false}, 
	about: {type: String, required: false},
	comment: {type: Array, "default": []}
});

var postSchema = new Schema({
	id: {type: Number, required: false},
	title: {type: String, required: true},
	description: {type: String, required: false},
	address: {type: String, required: true},
	contact: {type: String, required: true},
	StartDate: {type: Date, required: true},
	EndDate: {type: Date, required: true},
	photo: {data: Buffer, required: false},
});


