var express = require('express');
var router = express.Router();
var model = require('../models/model');
var avgmod = require('../helper/avg');

/* GET users listing. */
router.get('/:username', function(req, res, next) {
	var username = req.params.username;
	var cur_user = req.cookies.username;
	model.findUser(username, function(err, doc){
		if(err){
			res.status(500).send('Internal server error');
		}
		if(!doc){
			res.status(500).send('Internal server error');
		}
		else{
			user = doc[0];
			avg = avgmod.avg(user.rating);
			res.render('user', {loginStatus: {status: true, username: cur_user},
						postData:{
							username: user.username,
							email: user.email,
							about: user.about,
							comment: user.comment,
							rating: avg
						}});
		}
	});
});

router.get('/edit', function(req, res, next) {
	var username = req.params.username;
	var cur_user = req.cookies.username;
  	res.render('editProfile', {loginStatus: {status: true, username: cur_user},
						postData:{
							username: "Allen",
							email: "allen.uc.uoft@icloud.com",
							about: "Hi my name is lmao.",
							comment: [{commenter: "allen", text: "Aloha hahdsaoi halsadhoad"},
										{commenter: "blah", text: "dhaishdiuahsd"}],
							rating: 4.98
						}});
});

module.exports = router;
