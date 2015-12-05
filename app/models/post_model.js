var mongoose = require('mongoose');
var user = require('../models/user_model');
var fs = require('fs');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

mongoose.createConnection('mongodb://localhost/kitty');

var postSchema = new Schema({
	username: {type: String, required: true},
	title: {type: String, required: true},
	description: {type: String, required: false},
	address: {type: String, required: true},
	contact: {type: String, required: true},
	startDate: {type: Date, required: true},
	endDate: {type: Date, required: true},
	photo: {type: photoSchema, required: false},
});

var photoSchema = new Schema({
	img: {type: Buffer, contentType: String}
});

var PostModel = mongoose.model('Post', postSchema);
var PhotoModel = mongoose.model('Photo', photoSchema);

exports.newPost = function(creator, title, address, contact, startDate, endDate, photo, callback){
	if(photo){
		p = new PhotoModel({
			img: {data: fs.readFileSync(photo), contentType: 'image/png'}
		});
		p.save(function(err){
			if(err){
				callback(err);
			}
		});
	}
	post = new PostModel({
		creator: creator,
		title: title,
		address: address,
		contact: contact,
		startDate: startDate,
		endDate: endDate,
		photo: photo
	});
	post.save(function(err){
		if(err){
			callback(err.name);
		}
		else{
			console.log("Successfully added new post");
			console.log(post.id);
			callback(null);
		}
	});
};

exports.findPost = function(id, callback){
	PostModel.findById(id, function(err, post){
		if(err){
			callback(err);
		}
		else{
			callback(post);
		}
	});
}

exports.deletePost = function(id, callback){
	PostModel.findByIdAndRemove(id, function(err){
		if(err) 
			{callback(err);}
		else{
			callback(null);
		}
	});
};

exports.deleteAllPosts = function(callback){
	PostModel.remove({}, function(err){
		if(err){
			callback(err);
		}
		else{
			callback(null);
		}
	});
}
exports.allPosts = function(callback){
	PostModel.find({}, function(err, posts){
		if(!err){
			callback(posts);
		}
		else {
			callback(err);
		}
	})
};