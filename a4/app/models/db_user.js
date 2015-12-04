var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/app';
var util = require('./db_utility');
var assert = require('assert');

exports.newUser = function(userInfo, callback) {
    newUser = userInfo;
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        util.findOne(db, {email: userInfo.email}, "users", function(user) {
            if (user != null) {callback({status: false, err:"existedEmail"}); return;}
            db.collection("users").count(function(err,count){
                if(count == 0)
                    newUser.type = "System Admin";
                else
                    newUser.type = "Regular User";
                util.insertDocuments(db, newUser, "users", function() {
                    db.close();
                    callback({status: true, });
                    return;
                });
            });
        });

    });
}



exports.allUsers = function(callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        //db.collection('documents').remove({});
        util.findAll(db, "users", function(docs) {
            db.close();
            callback(docs);
            return;
        });
    });
}



exports.updateUser = function(userInfo, newInfo, callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        util.removeOne(db, {email: userInfo.email}, "users", function(){
            util.insertDocuments(db, newInfo, "users", function(){
                db.close();
                callback();
            });
        });
    });
}

exports.oneUser = function(req, callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        //db.collection('documents').remove({});
        util.findOne(db, req, "users", function(docs) {
            db.close();
            callback(docs);
            return;
        });
    });
}

// Get all comments by a particular user
exports.deleteAll = function(callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        util.removeAll(db, "users", function() {
            db.close();
            callback();
        });
    });
}

exports.deleteOne = function(userInfo, callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        util.removeOne(db, {email: userInfo.email}, "users", function() {
            db.close();
            callback();
        });
    });
}
