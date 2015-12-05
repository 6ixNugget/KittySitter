var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var postSchema = new Schema({
	id: ObjectId,
	title: {type: String, required: true},
	description: {type: String, required: false},
	address: {type: String, required: true},
	contact: {type: String, required: true},
	startDate: {type: Date, required: true},
	endDate: {type: Date, required: true},
	photo: {data: Buffer, required: false},
});

var PostModel = mongoose.model('Post', postSchema);

exports.newPost = function(post){
	post = new Post{
		title = post.title,
		address = post.address,
		contact = post.contact,
		startDate = post.startDate,
		endDate = post.endDate
	}
	post.save(function(err){
		if(err){
			console.log(err);
		}
		else{
			console.log("Successfully added new post");
		}
	})
};

exports.deletePost = function(id){
	Post.findByIdAndRemove(id, function(err){
		if(err) console.log(err);
	})
};

exports.allPosts = function(){
	Post.find({}, function(err, posts){
		if(!err){
			return posts;
		}
		else {throw err;}
	})
};