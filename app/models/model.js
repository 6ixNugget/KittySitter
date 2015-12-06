var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/kitty');

var Schema = mongoose.Schema;
var commentSchema = new Schema({
	commenter: {type: String},
	text: {type: String}
});

var userSchema = new Schema({
	username: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true}, 
	about: {type: String, required: false, default: null},
	comment: {type: [commentSchema]},
	rating: {type: [Number]},
	salt: {type: String}
});

var UserModel = mongoose.model('User', userSchema);
var CommentModel = mongoose.model('Comment', commentSchema);

exports.addUser = function(username, password, email, callback){
	var user = new UserModel({
		username: username,
		password: password,
		email: email,
		about: null,
		comment: null,
		rating: null,
		salt: null
	});
	user.save(callback);
};

exports.updateSalt = function(username, salt, callback){
	UserModel.findOneAndUpdate(
		{username: username},
		{$set: {salt: salt}},
		{new: true}, function(err, doc){
			callback(err, doc);
	});
}

exports.findUser = function(username, callback){
	console.log("in find user");
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
exports.addComment = function(target, commenter, comment, cb){
	query = UserModel.where({username: target});
	newcomment = new CommentModel({
		commenter: commenter,
		text: comment
	});
	UserModel.findOneAndUpdate(
		query,
		{$push: {comment: newcomment}},
		function(err, data) {
			cb(err, data);
		});
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

exports.newPost = function(creator, title, description, address, contact, startDate, endDate, inputPhoto, callback){
	if(inputPhoto != null){
		img = {
			data: fs.readFileSync(inputPhoto.path),
			contentType: inputPhoto.type
		}
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
	PostModel.find(function(err, posts){
		callback(err, posts);
	});
}

exports.getPostByUser = function(username, callback){
	PostModel.find({username: username}, function(err, posts){
		callback(err, posts);
	});
}