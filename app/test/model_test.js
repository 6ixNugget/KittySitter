var mongoose = require("mongoose");
var user = require('../models/model');
var avg = require('../helper/avg');
var assert = require('assert');
var compare = require('comparejs');
var model = user.UserModel;

mongoose.createConnection('mongodb://localhost/user_test');

describe("User Model Test", function(){
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

	it("add a new valid user", function(done){
		user.addUser("adele", "password", "hello@gmail.com", function(err, status){
			assert.equal(status.username, "adele");
			assert.equal(status.password, "password");
			assert.equal(status.email, "hello@gmail.com");
		});
		done();
	});

	it("add an invalid user with no email", function(done){
		user.addUser("jenny", "hellojenny", null, function(err, status){
			assert.equal("ValidationError", err.name);
		});
		done();
	});

	it("add an invalid user with no username", function(done){
		user.addUser(null, "hellojenny", "jenny@gmail.com", function(err, status){
			assert.equal("ValidationError", err.name);
		});
		done();
	});

    it("add a duplicate user", function(done){
		user.addUser("meeko", "hellojenny", "jenny@gmail.com", function(err, status){
			assert.equal("MongoError", err.name);
		});
		done();
	});

	it("use find user exists and expect the user to exist", function(done){
		user.findUser("meeko", function(err, data){
			assert.equal("meeko", data[0].username);
			assert.equal("123123", data[0].password);
			assert.equal("meeko@gmail.com", data[0].email);
		});
		done();
	});

	it("find a null user", function(done){
		user.findUser("", function(err, data){
			compare.eq(data, null);
		});
		done();
	});

	it("find a user that does not exist", function(done){
		user.findUser("Allen", function(err, data){
			compare.eq(data, null);
		});
		done();
	});

	it("login with valid credentials", function(){
		user.findUser("meeko", "123123", function(err, status){
			assert.equal("meeko", status.username);
			assert.equal("123123", status.password);
		});
	});

	it("delete user test", function(done){
		user.deleteUser("meeko", function(err, data){
			user.findAllUsers(function(err, data){
				compare.equal([], data);
			})
		});
		done();
	});

	// it("add a comment to meeko user", function(done){
	// 	user.addComment("meeko", "anna", "cutest cat ever", function(err, data){
	// 		if(err) console.log(err);
	// 		else{
	// 			user.findUser("meeko", function(err, data){
	// 				assert.equal(data[0].comment[1], "cutest cat ever");
	// 			});
	// 		}
	// 	});
	// 	done();
	// });

	it("finds all users when there is none", function(done){
		user.removeAll(function(err, data){
			if(!err){
				user.findAllUsers(function(err, data){
					compare.equal(data, []);
				});
			}
		});
		done();
	});

	it("finds all users when there is only one user", function(done){
		user.findAllUsers(function(err, data){
			assert.equal(data[0].username, "meeko");
			assert.equal(data[0].password, "123123");
			assert.equal(data[0].email, "meeko@gmail.com")
		});
		done();
	});

	it("add a new rating to a user with no ratings before", function(done){
		user.newRating("annie", 5, function(err, data){
			if(!err){
				user.findUser("annie", function(err, data){
					assert.equal(data[0].rating, [5]);
				});
			}
		});
		done();
	});

	it("add an invalid rating to a user with no ratings before", function(done){
		user.newRating("annie", "ho", function(err, data){
			if(!err){
				user.findUser("annie", function(err, data){
					assert.equal(data.rating,null);
				});
			}
		});
		done();
	});

	it("add an valid rating to a user that does not exist", function(done){
		user.newRating("allen", 5, function(err, data){
			if(!err){
				user.findUser("allen", function(err, data){
					compare.equal(data, null);
				});
			}
		});
		done();
	});
});
