var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:username', function(req, res, next) {
	var username = req.params.username;
  	res.render('user', {loginStatus: {status: true, username: "username"},
						postData:{
							username: "Allen",
							email: "allen.uc.uoft@icloud.com",
							about: "Hi my name is lmao.",
							comment: [{commenter: "allen", text: "Aloha hahdsaoi halsadhoad"},
										{commenter: "blah", text: "dhaishdiuahsd"}],
							rating: 4.98
						}});
});

router.get('/edit', function(req, res, next) {
	var username = req.params.username;
  	res.render('editProfile', {loginStatus: {status: true, username: "username"},
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
