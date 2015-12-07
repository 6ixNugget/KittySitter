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
			assert.equal(data, null);
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

describe("Post Model Test", function(){
	beforeEach(function(done){
		user.removeAll(function(err){
			if(err){
				console.log(err);
			}
		});
		user.deleteAllPosts(function(err){
			if(err){
				console.log(err);
			}
		});

		user.addUser("annie", "123123", "annie@gmail.com", function(err){
			if(err){
				console.log(err);
			}
		});
		img = {
			path: "/Users/zowang/Desktop/cat.jpg",
			type: "jpg"
		}
		user.newPost("annie", "A cute cat looking for sitter!",null, "832 Bay Street, Toronto", "meeko@gmail.com", "2015-12-23", "2015-12-28", null, function(err){
			if(err){
				console.log(err);
			}
		});
		user.newPost("annie", "A blue eye!",null, "832 Bay Street, Toronto", "meeko@gmail.com", "2015-12-23", "2015-12-28", img, function(err){
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
		user.deleteAllPosts(function(err){
			if(err){
				console.log(err);
			}
		});
		done();
	});

	it("create a valid new post without picture", function(done){	
		user.newPost("annie", "A cute ginger looking for sitter!", "Hi I'm Nice!", "200 Bay Street Toronto", "jenna@gmail.com", "2015-12-25", "2016-01-03", null, function(err, doc){
			assert.equal(doc.username, "annie");
			assert.equal(doc.title, "A cute ginger looking for sitter!");
			assert.equal(doc.description, "Hi I'm Nice!");
			assert.equal(doc.address, "200 Bay Street Toronto");
			assert.equal(doc.contact, "jenna@gmail.com");
			assert.equal(doc.endDate, "Sat Jan 02 2016 19:00:00 GMT-0500 (EST)");
			assert.equal(doc.startDate, "Thu Dec 24 2015 19:00:00 GMT-0500 (EST)");
		});
		done();
	});

	it("create an invalid post without creator", function(done){
		img = {
			path: "/Users/zowang/Desktop/cat.jpg",
			type: "jpg"
		}		
		user.newPost("", "A cute cat looking for sitter!", null, "832 Bay Street, Toronto", "meeko@gmail.com", "2015-12-23", "2015-12-28", img, function(err, doc){
			assert.equal(err.name, "ValidationError")
		});
		done();
	});

	it("create a valid post without description and img", function(done){
		user.newPost("jen", "A cute cat looking for sitter!", null, "222 College St", "123@mail.com", "2015-09-23", "2016-09-25", null, function(err, doc){
			assert.equal(doc.username, "jen");
			assert.equal(doc.title, "A cute cat looking for sitter!");
			assert.equal(doc.address, "222 College St");
			assert.equal(doc.contact, "123@mail.com");
		});
		done();
	})

	it("returns all posts in the database when there is only one post", function(done){
		user.allPosts(function(err, posts){
			assert.equal(posts[0].username, "annie");
			assert.equal(posts[0].title, "A cute cat looking for sitter!");
			assert.equal(posts[0].description, null);
			assert.equal(posts[0].address, "832 Bay Street, Toronto");
			assert.equal(posts[0].contact, "meeko@gmail.com");
		});
		done();
	});

	it("testing deleteAllPosts with one post in the database", function(){
		user.deleteAllPosts(function(err,data){
			user.allPosts(function(err, data){
				compare.eq(data, []);
			});
		});
	});

	it("testing deleteAllPosts with two posts", function(done){
		user.newPost("jen", "A cute cat looking for sitter!", null, "222 College St", "123@mail.com", "2015-09-23", "2016-09-25", null, function(err, doc){
			if(err) console.log(err);
		});
		user.deleteAllPosts(function(err, data){
			if(!err){
				post.allPosts, function(err, data){
					compare.equal(data, []);
				}
			}
		});
		done();
	});

	it("gets all the posts by a specific user", function(done){
		user.getPostByUser("annie", function(err, posts){
			assert.equal(posts[0].title, "A cute cat looking for sitter!");
			assert.equal(posts[0].description, null);
			assert.equal(posts[0].address, "832 Bay Street, Toronto");
			assert.equal(posts[0].contact, "meeko@gmail.com");
		});
		done();
	});	
});
