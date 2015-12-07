var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', {loginStatus: {status: false, username: "this is wrong"}});
});

module.exports = router;
