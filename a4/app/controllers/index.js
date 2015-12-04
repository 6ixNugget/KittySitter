var express = require('express');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var db_user = require('../models/db_user')
var app = express();

app.set('view engine','jade');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    email = req.cookies.userEmail;
    if(email == undefined) {res.render('login'); return;}
    db_user.oneUser({email: email},function(user){
        if (user!=null)
            res.render('index');
        else
            res.render('login');
    });
});

app.get('/test',function(req, res){
    res.render('index');
});

module.exports = app;
