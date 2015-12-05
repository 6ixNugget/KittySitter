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
	//query = user_db.where({username: username});
	if(username == undefined) {res.render('login'); return;}
	// query.findOne(function (err, doc){
	// 	if(err) console.log(err);
	// 	else if (!doc)
	// 		res.send({status: false, error: "Please check your username"});
	// 	else if(doc.password != password){
	// 		res.send({status: false, error: "Please check your password"});
	// 	}
	// 	else if(doc.password == password){
	// 		res.send({status: true, salt:"", username: username});
	// 	}
	// })
	expected = user_db.findUser(username);
	if(expected == "The user does not exist!"){
		res.send({status: false, error: "Please check your username"});
	}
	else if(expected == true){
		res.send({status: true, salt:"", username: username});
	}
	else if(expected == "The password is not correct"){
		res.send({status: false, error: "Please check your password"});
	}
	else{
		res.send({status: false, error: "Unkown error!"});
	}
});

app.post('/api/signup', function (req, res) {
	username = req.body.username;
	password = req.body.password;
	email = req.body.email;
	if(user_db.findUser){
		res.send({status: false, error: "The username is taken."});
	}
	user_db.addUser(username, password, email);
	res.send({status: true, salt: "", username: username});
});

app.post('/api/newPost', function(req, res){

});

app.post('/api/newComment', function(req, res){
	commenter = req.cookie.username;
	target = req.body.username;
	text = req.body.text;
	user.db.addComment(target, commenter, text);
});

app.post('/api/newRate', function(req, res){
	
});

app.get('/api/getAllPosts', function(req, res){

});

app.get('/api/getUserByUsername', function(req, res){

});

app.get('/api/getPostById', function(req, res){

});

