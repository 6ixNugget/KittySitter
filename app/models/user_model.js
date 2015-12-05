var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true}, 
	about: {type: String, required: false, default: null},
	comment: {type: [commentSchema]},
	rating: {type: [Numbers]}
});

var commentSchema = new Schema({
	commenter: {type: String, required: true},
	text: {type: String, required: true}
});

var UserModel = mongoose.model('User', userSchema);
var CommentModel = mongoose.model('Comment', commentSchema);

exports.addUser = function(username, password, email){
	user = new User{
		username: username,
		password: password,
		email: email,
		about: null,
		comment: null,
		rating: null
	}
	user.save(function(err){
		if(err) {return err;}
		else {console.log("Successfully added new user");}
	});
};

exports.LoginUser = function(username, password){
	query = User.where({username: username});
	query.findOne(function(err, doc){
		if(err) {console.log(err);}
		else if(!doc){
			return "The user does not exist!";
		}
		else if(password == doc.password){
			return true;
		}
		else{
			return "The password is not correct";
		}
	}
};

exports.findUserExists = function(username){
	findOne(username, function(err, data){
		if(err) {console.log(err);}
		else if(!data){
			return true;
		}
		else{
			return false;
		}
	})
};

exports.findUser = function(username){
	findOne(username, function(err, data){
		if(err) {console.log(err);}
		else if(!data){
			return null;
		}
		else{
			return data;
		}
	})
};

exports.deleteUser = function(username){
	query = User.where({username: username});
	query.findOneAndRemove(function(err, doc){
		if(err) return err;
		else if(!doc){
			return "The user does not exist!";
		}
	})
};

exports.addComment = function(target, commenter, comment){
	query = User.where({username: target})
	comment = new Comment{
		commenter: commenter,
		text: comment
	}
	User.findOneAndUpdate(
		query,
		{$push: comment},
		function(err) {
			if(err) {console.log(err);}
			else {console.log("Successfully added comment");}
		})
};

exports.rating = function(username){
	findOne(username, function(err, data){
		if(err){
			console.log(err);
			return null;
		}
		else if(data){
			return data.rating;
		}
		else if(!data){
			return "User does not exist!";
		}
	})
};

