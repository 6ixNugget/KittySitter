var mongoose = require('mongoose');
var fs = require('fs');
mongoose.connect('mongodb://localhost/kitty');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true}, 
	about: {type: String, required: false, default: null},
	comment: Array,
	rating: Array,
	salt: {type: String}
});

var UserModel = mongoose.model('User', userSchema);

//adding a new user to the database
exports.addUser = function(username, password, email, callback){
	var user = new UserModel({
		username: username,
		password: password,
		email: email,
		about: null,
		comment: ["A new user"],
		rating: [0],
		salt: null
	});
	user.save(callback);
};

//once the users credentials match, the salt is updated
exports.updateSalt = function(username, salt, callback){
	UserModel.findOneAndUpdate(
		{username: username},
		{$set: {salt: salt}},
		{new: true}, function(err, doc){
			callback(err, doc);
	});
}

exports.findUser = function(username, callback){
	UserModel.find({username: username}, callback);
}

exports.findAllUsers = function(callback){
	UserModel.find(function(err, data){
		callback(err, data);
	});
}

exports.deleteUser = function(username, callback){
	query = UserModel.where({username: username});
	query.findOneAndRemove(function(err, data){
		callback(err, data);
	});
}
exports.addComment = function(target, commenter, comment, callback){
	query = UserModel.where({username: target});
	newcomment = {
		commenter: commenter,
		text: comment
	}
	UserModel.update(
		{"username": target},
		{$push: {"comment": newcomment}},
		callback);
}

exports.newRating = function(username, newrating, callback){
	query = UserModel.where({username: username});
	UserModel.findOneAndUpdate(
		query,
		{$push: {rating: newrating}},
		function(err, data){
			callback(err, data);
		});
}

exports.removeAll = function(callback){
	UserModel.remove({}, function(err, data){
		callback(err, data);
	});
}

var postSchema = new Schema({
	username: {type: String, required: true},
	title: {type: String, required: true},
	description: {type: String, required: false},
	address: {type: String, required: true},
	contact: {type: String, required: true},
	startDate: {type: Date, required: true},
	endDate: {type: Date, required: true},
	photo: {data: Buffer, contentType: String, required: false},
});

var PostModel = mongoose.model('Post', postSchema);

//creating a new post
exports.newPost = function(creator, title, description, address, contact, startDate, endDate, inputPhoto, callback){
	if(inputPhoto != null){
		img = {
			data: fs.readFileSync(inputPhoto.path),
			contentType: inputPhoto.type
		}
		post = new PostModel({
			username: creator,
			title: title,
			description: description,
			address: address,
			contact: contact,
			startDate: startDate,
			endDate: endDate,
			photo: img
		});
	}
	else{
		post = new PostModel({
			username: creator,
			title: title,
			description: description,
			address: address,
			contact: contact,
			startDate: startDate,
			endDate: endDate,
			photo: null
		});
	}		
	post.save(function(err, poster){
		callback(err, poster);
	});
}

exports.findPost = function(id, callback){
	PostModel.findById(id, function(err, post){
		callback(err, post);
	});
}

exports.deletePost = function(id, callback){
	PostModel.findByIdAndRemove(id, function(err, post){
		callback(err, post);
	});
}

exports.deleteAllPosts = function(callback){
	PostModel.remove({}, function(err, data){
		callback(err, data);
	});
}

exports.allPosts = function(callback){
	PostModel.find(callback);
}

exports.getPostByUser = function(username, callback){
	console.log(username);
	PostModel.find({username: username}, function(err, posts){
		callback(err, posts);
	});
}