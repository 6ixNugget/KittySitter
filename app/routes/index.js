var express = require('express');
var router = express.Router();

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
	username = req.cookies.username;
	res.render('index', {loginStatus: {status: true, username: username}});
});

router.get('/post/:post_id', function(req, res, next){
	data.startDate = new Date();
	data.endDate = new Date();
	console.log(data.startDate);
	res.render('post', {postData: data, 
						post_id: req.params.post_id,
						loginStatus: {status: true, username: "Allen"}
					});
});

router.get('/newPost', function(req, res, next){
	res.render('newPost', {postData: data, 
							post_id: req.params.post_id,
							loginStatus: {status: true, username: "Allen"}
						});
});


module.exports = router;
