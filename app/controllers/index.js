var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var user_db = require('../models/user_model');
var app = express();

mongoose.connect('mongodb://localhost/kittysitter');

app.set('view engine','jade');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res){
	username = req.cookies.username;
	if(username == undefined) {res.render('login'); return;}
	else {res.render('dashboard'); return;}
});
