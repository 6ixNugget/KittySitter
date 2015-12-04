var express = require('express');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var util = require('./utility')
var db_user = require('../models/db_user')
var app = express();

app.set('view engine','jade');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/signup', function(req, res){
    newUser = req.body;
    valid_info = util.isValidInfo(newUser);
    if(valid_info.valid){
        db_user.newUser(newUser, function(statusInfo){
            if (statusInfo.status) {
                res.cookie('userEmail',newUser.email);
                res.send({status:true});
                return;
            }else{
                var error_msg = [];
                if(statusInfo.err == "existedEmail")
                    error_msg.push("the email you entered already existed");
                res.send({status: false, msg: error_msg});
                return;
            }
        });
    }else{
        res.send({status: false, msg: valid_info.msg});
    }
});

app.post('/api/signin', function(req, res){
    userInfo = req.body;
    db_user.oneUser({email: userInfo.email}, function(user){
        if (user == null) {
            res.send({status: false, msg: "the email you entered is incorrect."});
        }else{
            if (user.password === req.password){
                res.cookie('userEmail',userInfo.email);
                res.send({status:true});
                return;
            }else{
                res.send({status: false, msg: "the password does not match our record."});
                return;
            }
        }
    });
});

app.post('/api/typeChange', function(req, res){
    userInfo = req.body;
    db_user.oneUser({email: userInfo.email}, function(user){
        user = user[0];
        if (user != null) {
            newInfo = user;
            newInfo.type = userInfo.type;
            db_user.updateUser({email: userInfo.email}, newInfo, function(){
                res.send({status: true});
                return;
            });
        }
    });
});

app.post('/api/userUpdate', function(req, res){
    newInfo = req.body;
    db_user.oneUser({email: newInfo.email}, function(user){
        user = user[0];
        if (user != null) {
            console.log(newInfo);
            db_user.updateUser({email: newInfo.email}, newInfo, function(){
                res.send({status: true});
                return;
            });
        }
    });
});

app.get('/api/allUsers', function(req, res){
    db_user.allUsers(function(docs){
        res.send(docs);
    });
});


app.get('/api/userType', function (req, res) {
    email = req.cookies.userEmail;
    if(email == undefined) {res.render('login'); return;}
    db_user.oneUser({email: email}, function(user){
        user = user[0];
        if (user!=null)
            res.send(user.type);
        else
            res.send(null);
    });
});

app.get('/api/getUser', function (req, res) {
    email = req.cookies.userEmail;
    if(email == undefined) {res.render('login'); return;}
    db_user.oneUser({email: email}, function(user){
        user = user[0];
        if (user!=null)
            res.send(user);
        else
            res.send(null);
    });
});

app.get('/test/deleteAll', function(req, res){
    db_user.deleteAll(function(){
        res.send("done");
    });
});

app.post('/api/deleteUser', function(req, res){
    email = req.body.email;
    db_user.deleteOne({email: email}, function(){
        res.send({status: true});
    });
});

module.exports = app;
