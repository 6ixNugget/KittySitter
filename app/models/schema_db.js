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

var UserModel = mongoose.model('User', userSchema);
var PostModel = mongoose.model('Post', postSchema);

exports.addUser = function(user){
	user = new User{
		username: user.username,
		password: user.password
	}
	user.save(function(err){
		if(err) return handleError(err);
	});
};

exports.addComment = function(comment){
	query = comment.target;
	User.findOneAndUpdate(
		query,
		{$push: {"comment": {user: username, comment: comment:text}}},
		{safe: true, upsert: true},
		function(err) {
			if(err) console.log(err);
			else console.log("Successfully added commnet");
		});

}

exports.newPost = function(title, address, )
