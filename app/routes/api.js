var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var user_db = require('../models/user_model');
var post_db = require('../models/post_model');
var app = express();

mongoose.connect('mongodb://localhost/kittysitter');

app.set('view engine','jade');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/signin', function (req, res){
	username = req.body.username;
	password = req.body.password;
	if(username == undefined) {res.render('login'); return;}
	// user_db.findUser(username, function(err, doc){
	// 	if(err){
	// 		res.send({status: false, error: err});
	// 	}
	// 	else if(!doc){
	// 		res.send({status: false, error: "Please check your username!"});
	// 	}
	// 	else if(doc.password == password){
	// 		res.send({status: true, salt=""});
	// 	}
	// 	else if(doc.password != password){
	// 		res.send({status: false, error: "Please check your password!"});
	// 	}
	// });
	user_db.loginUser(username, password, function(status){
		if(!status){
			res.send({status: true, salt="", username: username});
		}
		else{
			res.send({status: false, error: "Please check your credentials!"})
		}
	});
});

app.post('/api/signup', function (req, res) {
	username = req.body.username;
	password = req.body.password;
	email = req.body.email;
	user_db.addUser(username, password, email, function(status){
		if(status == "ValidationError"){
			res.send({status: false, error: "username is taken"});
		}
		else if(!status){
			res.send({status: true, salt: "", username: username});
		}
	});
});

app.post('/api/newPost', function(req, res){
	username = req.cookie.username;
	title = req.body.title;
	address = req.body.address;
	contact = req.body.contact;
	startDate = req.body.startDate;
	endDate = req.body.endDate;
	photo = req.body.photo;
	post_db.newPost(username, title, address, contact, startDate, endDate, photo, function(status){
		if(!status){
			res.send({status: true});
		}
		else if(status){
			res.send(status: false);
		}
	});
});

app.post('/api/newComment', function(req, res){
	commenter = req.cookie.username;
	target = req.body.username;
	text = req.body.text;
	user.db.addComment(target, commenter, text, function(status){
		if(!status){
			res.send({status: true});
		}
		else{
			res.send({status: false});
		}
	});
});

app.post('/api/newRating', function(req, res){
	rating = req.body.rating;
	target = req.body.username;
	user.db.newRating(target, rating, function(status){
		if(!status){
			res.send({status: true});
		}
		else{
			console.log(status);
			res.send({status: false});
		}
	});
});

app.get('/api/getAllPosts', function(req, res){
	post_db.allPosts(function(err, posts){
		if(err){
			res.send({status: false});
		}
		else if(posts){
			res.send({status: true, posts: posts});
		}
		else if(!posts){
			res.send({status: true, posts: null});
		}
	});
});

app.get('/api/getUserByUsername', function(req, res){
	user_db.findUser(function(err, user){
		if(err){
			res.send({status: false});
		}
		else if(user){
			res.send({status: true, user: user});
		}
		else if(!user){
			res.send({status: false, error: "The user does not exist"});
		}
	});
});

app.get('/api/getPostById', function(req, res){
	id = req.body.id;
	post_db.findPost(function(err, post){
		if(err){
			res.send({status: false});
		}
		else if(post){
			res.send({status:true, post: post});
		}
		else if(!post){
			res.send({status:false, error: "The post does not exist"});
		}
	});
});

app.post('/api/avgratings', function(req, res){
	user = req.body.username;
	user_db.avgRatings(function(err, data){
		if(err){
			res.send({status: false});
		}
		else if(data){
			res.send({status: true, avg: data});
		}
		else{
			res.send({status: false, error: "Unkown error"});
		}
	});
});