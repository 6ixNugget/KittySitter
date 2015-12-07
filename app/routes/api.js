var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var model = require('../models/model');
var auth = require('../helper/auth');
var avg = require('../helper/avg');
var url = require('url');
var app = express();

app.set('view engine','jade');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', function (req, res){
	username = req.body.username;
	password = req.body.password;
	if(!username) {res.send({status: false, error: "Username is undefined"});return;}
	model.findUser(username, function(err, docs){
		if(err){
			res.send({status: false, error:"Unknown!"});
		}
		else if(docs.length == 0){
			res.send({status: false, error: "Please check your username"});
		}
		else if(docs[0].password == password){
			salt = auth.makeSalt();
			model.updateSalt(username, salt, function(err, doc){
				if(err){
					res.send({status: false, error:"Unknown!"});
				}
				else if(doc){
					res.send({status: true, salt: salt, username: username});					
				}
			});
		}
	});
});

app.post('/signup', function (req, res) {
	username = req.body.username;
	password = req.body.password;
	email = req.body.email;
	model.addUser(username, password, email, function(err, status){
		if(status){
			salt = auth.makeSalt();
			model.updateSalt(username, salt, function(err, data){
				if(err){
					res.send({status: false, error:"Unknown!"});
				}
				else if(data){
					res.send({status: true, salt: salt, username: username});
				}
			});
		}
		else if(err){
			if(err.name == "MongoError"){
				res.send({status: false, error: "username is taken"});
				return;
			};
			res.send({status: false, error:err});
		}
		else if(!status){
			res.send({status: false, error: "Unkown error!"});
		}
	});
});

app.post('/newPost', function(req, res){
	username = req.cookies.username;
	salt = req.cookies.salt;
	title = req.body.title;
	address = req.body.address;
	description = req.body.description;
	contact = req.body.contact;
	startDate = req.body.startDate;
	endDate = req.body.endDate;
	photo = req.body.photo;
	model.findUser(username, function(err, data){
		if(err || !data){
			res.send({status:false, error: "Unknown error!"});
		}
		else if(data){
			if(data[0].salt != salt){
				res.redirect('/login');
			}
			else{
				model.newPost(username, title, description, address, contact, startDate, endDate, photo, function(err, data){
					if(err){
						res.send({status:false, error: "Something went wrong"});
					}
					else{
						res.send({status: true, post_id: data.id});
					}
				});
			}
		}
	});
});

app.post('/newComment', function(req, res){
	commenter = req.cookies.username;
	salt = req.cookies.salt;
	target = req.body.username;
	text = req.body.text;
	model.findUser(commenter, function(err, data){
		if(err){
			res.send({status:false, error: "Unknown error!"});
		}
		else if(data){
			if(data[0].salt != salt){
				res.redirect('/login');
			}
			else{
				model.addComment(target, commenter, text, function(err, numAffected){
					console.log(err);
					if(err){
						res.send({status:false, error: "Something went wrong"});
					}
					else{
						res.send({status: true});
					}
				});
			}
		}
		else{
			res.send({status:false, error: "Please make sure who you are commenting"});
		}
	});
});	

app.post('/newRating', function(req, res){
	rating = req.body.rating;
	target = req.body.username;
	salt = req.cookies.salt;
	rater = req.cookies.username;
	model.findUser(rater, function(err, data){
		if(err){
			res.send({status:false, error: "Unknown error!"});
		}
		else if(data){
			if(data[0].salt != salt){
				res.redirect('/login');
			}
			else{
				model.newRating(target, rating, function(err, data){
					if(err){
						res.send({status:false, error: "Something went wrong"});
					}
					else{
						res.send({status: true});
					}
				});
			}
		}
	});	
});

app.get('/getAllPosts', function(req, res){
	model.allPosts(function(err, posts){
		if(err){
			res.send({status: false});
		}
		else{
			res.send({status: true, posts: posts});
		}
	});
});

app.get('/getAllUsers', function(req, res){
	res.send({status: true});
});

app.get('/getUserByUsername', function(req, res){
	query = url.parse(req.url);
	username = query.query.split("=")[1];
	model.findUser(username, function(err, doc){
		if(err){
			res.send({status: false});
		}
		else if(doc.length == 0){
			res.send({status: false, error: "The user does not exist"});
		}
		else if(doc){
			res.send({status: true, user: doc[0]});
		}

	});
});

app.get('/getPostById', function(req, res){
	query = url.parse(req.url);
	id = query.query.split("=")[1];
	model.findPost(id, function(err, post){
		if(err){
			res.send({status: false});
		}
		else if(post.length == 0){
			res.send({status:false, error: "The post does not exist"});
		}
		else if(post){
			res.send({status:true, post: post});
		}
	});
});

app.post('/updateProfile', function(req, res){
	username = req.cookies.username;
	salt = req.cookies.salt;
	password = req.body.password;
	email = req.body.email;
	about = req.body.about;
	model.findUser("username", function(err, data){
		if(err){
			res.send({status:false});
		}
		else if(data[0].salt != salt){
			res.redirect('/login');
		}
		else{
			model.updateUser(username, password, email, about, model, function(err, data){
				if(err){
					res.send({status:false});
				}
				else{
					res.send({status:true});
				}
			});
		}
	});
});

app.post('/removeAllUsers', function(req, res){
	model.removeAll(function(err, data){
		if(err){
			res.send({status: false, error: "Database error"});
		}
		else{
			res.send({status: true});
		}
	});
});

app.post('/avgRating', function(req, res){
	user = req.body.username;
	model.findUser(user, function(err, data){
		if(err){
			res.send({status: false, error: err});
		}
		else if(data){
			avg = avg.avg(data[0].rating);
			res.send({status: true, avg: avg});
		}
		else if(!data){
			res.send({status: false, error: "Please check the username"});
		}
		else{
			res.send({status: false, error: "Unkown error"});
		}
	});
});

app.post('/getUserPosts', function(req, res){
	user = req.body.username;
	model.getPostByUser(user, function(err, posts){
		if(err){
			res.send({status: false, error: err})
		}
		else{
			res.send({status: true, posts: posts});
		}
	})
});

module.exports = app;