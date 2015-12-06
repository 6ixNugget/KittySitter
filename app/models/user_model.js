var mongoose = require('mongoose');

var Schema = mongoose.Schema;

mongoose.createConnection('mongodb://localhost/kitty');

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
	salt: {type: Number}
});

var UserModel = mongoose.model('User', userSchema);
var CommentModel = mongoose.model('Comment', commentSchema);

exports.addUser = function(username, password, email, callback){
	user = new UserModel({
		username: username,
		password: password,
		email: email,
		about: null,
		comment: null,
		rating: null,
		salt: 0
	});
	user.save(function(err){
		if(err) {
			callback(err);
		}
		else {
			console.log("Successfully added new user " + username);
			callback(null);
		}
	});
};

exports.updateSalt = function(username, salt, callback){
	UserModel.findOneAndUpdate(
		{username: username},
		{$set: {salt: salt}},
		{new: true}, function(err, doc){
			if(err){
				callback(err);
			}
			else{
				callback(null);
			}
	});
}

exports.verifySalt = function(username, salt, callback){
	query = UserModel.where({username: username});
	query.findOne(function(err, data){
		if(err){
			callback(err);
		}
		if(data){
			if(data.salt == salt){
				callback(data);
			}
			else{
				callback(null);
			}
		}
	});
}

exports.loginUser = function(username, password, callback){
	query = UserModel.where({username: username});
	query.findOne(function(err, doc){
		if(err) {
			callback(err);
		}
		else if(!doc){
			callback(null);
		}
		else if(password == doc.password){
			callback(doc);
		}
		else if(password != doc.password){
			callback(null);
		}
	});
}

exports.findUserExists = function(username, callback){
	query = UserModel.where({username: username});
	query.findOne(function(err, data){
		if(err) {
			console.log(err);
		}
		else if(data){
			callback(true);
		}
		else if(!data){
			callback(false);
		}
	});
}

exports.findUser = function(username, callback){
	query = UserModel.where({username: username});
	query.findOne(function(err, data){
		if(err) {callback(err);}
		else if(!data){
			callback(null);
		}
		else{
			callback(data);
		}
	});
}

exports.deleteUser = function(username, callback){
	query = UserModel.where({username: username});
	query.findOneAndRemove(function(err){
		if(err) callback(err);
		else{
			callback(null);
		}
	});
}
exports.addComment = function(target, commenter, comment, callback){
	query = UserModel.where({username: target});
	newcomment = new Comment({
		commenter: commenter,
		text: comment
	});
	UserModel.findOneAndUpdate(
		query,
		{$push: {comment: newcomment}},
		function(err) {
			if(err) {callback(err);}
			else {
				console.log("Successfully added comment");
				callback(null);
			}
		});
}

exports.rating = function(username, callback){
	query = UserModel.where({username:username});
	UserModel.findOneAndUpdate(username, function(err, data){
		if(err){
			callback(err);
		}
		else if(data){
			callback(data.rating);
		}
		else if(!data){
			callback("User does not exist!");
		}
	});
}

exports.newRating = function(username, newrating, callback){
	query = UserModel.where({username: username});
	UserModel.findOneAndUpdate(
		query,
		{$push: {rating: newrating}},
		function(err, model){
			if(err){
				callback(err);
			}
			else{
				console.log("Successfully added new rating");
				callback(null);
			}
		});
}

exports.avgRating = function(username, callback){
	query = UserModel.where({username: username});
	UserModel.findone(username, function(err, data){
		if(err){
			callback(err);
		}
		else if(data.rating){
			sum = 0;
			for(i = 0; i < data.rating.length; i++){
				sum += data.rating[i];
			}
			avg = sum/data.rating.length;
			callback(avg);
		}
	});
}

exports.removeAll = function(callback){
	UserModel.remove({}, function(err, removed){
		if(err){callback(err);}
	});
}