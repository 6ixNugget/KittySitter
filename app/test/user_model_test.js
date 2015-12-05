var mongoose = require("mongoose");
var user = require('../models/user_model');
var assert = require('assert');
var model = user.UserModel;

mongoose.createConnection('mongodb://localhost/user_test');

describe("User Model Test", function(){
	var currentUser;

	before(function(done){
		user.removeAll(function(err){
			if(err){
				console.log(err);
			}
		});
		done();
	});

	beforeEach(function(done){
		user.addUser("meeko", "123123", "meeko@gmail.com", function(err){
			if(err){
				console.log(err);
			}
		});
		done();
	});

	afterEach(function(done){
		user.removeAll(function(err){
			if(err){
				console.log(err);
			}
		});
		done();
	});

	it("use findUserExists and expect the user to exist", function(){
		user.findUserExists("meeko", function(status){
			assert.equal(status, true);
		});
	});

	it("add a new valid user", function(done){
		user.addUser("adele", "password", "hello@gmail.com", function(status){
			if(!status){
				user.findUser("adele", function(user){
					assert.equal("adele", user.username);
					assert.equal("password", user.password);
					assert.equal("hello@gmail.com", user.email);
				});
			}
		});
		done();
	});

	it("add an invalid user", function(done){
		user.addUser("jenny", "hellojenny", null, function(doc){
			assert.equal("ValidationError", doc);
		});
		done();
	});

	it("find a valid user", function(done){
		user.findUser("meeko", function(doc){
			assert.equal(doc.username, "meeko");
			assert.equal(doc.password, "123123");
			assert.equal(doc.email, "meeko@gmail.com");
		});
		done();
	});

	it("find a null user", function(done){
		user.findUser("", function(doc){
			assert.equal(null, doc);
		});
		done();
	});

	it("find a user that does not exist", function(done){
		user.findUser("Allen", function(doc){
			assert.equal(null, doc);
		});
		done();
	});

	it("login with valid credentials", function(){
		user.loginUser("meeko", "123123", function(status){
			assert.equal(null, status);
		})
	});

	it("delete user test", function(done){
		user.deleteUser("meeko", function(doc){
			assert.equal(null, doc);
		});
		done();
	});
});