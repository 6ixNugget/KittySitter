var express = require('express');
var router = express.Router();
var model = require('../models/model');

var data = {id: 123123123213,
			username: "allen",
			title: "Cutest kitty in the mission!",
			description: "Meeko is one of the cutest cat in the world, but we have to leave a couple of days. Please help us kittysitting Meeko, we will provide small compensation.",
			address: "832 Bay St",
			contact: "user@example.com",
			startDate: null,
			endDate: null,
			photo: null
			}

// GET Index page.
router.get('/', function(req, res, next) {
	var username = req.cookies.username;
	if(!username) {
		res.redirect('/login');
		return;
	}
	model.allPosts(function(err, posts){
		if(err){
			 res.status(500).send('Internal server error');
		}
		else{
			res.render('index', {posts: posts,
								loginStatus: {status: true, username: username}});
		}
	});
});

router.get('/post/:post_id', function(req, res, next){
	var id = req.params.post_id;
	var username = req.cookies.username;
	model.findPost(id, function(err, doc){
		if(err){
			res.redirect('/404');
		}
		else if(!doc){
			res.redirect('/404');
		}
		else if(doc){
			res.render('post', {postData: doc, 
								loginStatus: {status: true, username: username}
							});
		}
	});
});

router.get('/newPost', function(req, res, next){
	username = req.cookies.username;
	res.render('newPost', {loginStatus: {status: true, username: username}
						});
});


module.exports = router;
