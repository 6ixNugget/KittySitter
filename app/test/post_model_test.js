var mongoose = require("mongoose");
var user = require('../models/user_model');
var post = require('../models/post_model');
var assert = require('assert');

mongoose.connection.close();

mongoose.createConnection('mongodb://localhost/post_test');

describe("Post Model Test", function(){
	beforeEach(function(done){
		user.removeAll(function(err){
			if(err){
				console.log(err);
			}
		});
		post.deleteAllPosts(function(err){
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
		//console.log(img.path);
		post.newPost("annie", "A cute cat looking for sitter!",null, "832 Bay Street, Toronto", "meeko@gmail.com", "2015-12-23", "2015-12-28", img, function(err){
			if(err){
				console.log(err);
			}
		});
		post.newPost("annie", "A blue eye!",null, "832 Bay Street, Toronto", "meeko@gmail.com", "2015-12-23", "2015-12-28", img, function(err){
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
		post.deleteAllPosts(function(err){
			if(err){
				console.log(err);
			}
		});
		mongoose.connection.close();
		done();
	});

	// it("create testing", function(done){
	// 	console.log(123);
	// 	post.test(function(err, data){
	// 		console.log(data);
	// 	});
	// 	done();
	// });

	it("create a valid new post without picture", function(done){	
		post.newPost("annie", "A cute ginger looking for sitter!", "Hi I'm Nice!", "200 Bay Street Toronto", "jenna@gmail.com", "2015-12-25", "2016-01-03", null, function(err, doc){
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
		post.newPost("", "A cute cat looking for sitter!", null, "832 Bay Street, Toronto", "meeko@gmail.com", "2015-12-23", "2015-12-28", img, function(err, doc){
			assert.equal(err.name, "ValidationError")
		});
		done();
	});

	it("create a valid post without description and img", function(done){
		post.newPost("jen", "A cute cat looking for sitter!", null, "222 College St", "123@mail.com", "2015-09-23", "2016-09-25", null, function(err, doc){
			assert.equal(doc.username, "jen");
			assert.equal(doc.title, "A cute cat looking for sitter!");
			assert.equal(doc.address, "222 College St");
			assert.equal(doc.contact, "123@mail.com");
		});
		done();
	})

	it("returns all posts in the database when there is only one post", function(done){
		post.allPosts(function(err, posts){
			assert.equal(posts[0].username, "annie");
			assert.equal(posts[0].title, "A cute cat looking for sitter!");
			assert.equal(posts[0].description, null);
			assert.equal(posts[0].address, "832 Bay Street, Toronto");
			assert.equal(posts[0].contact, "meeko@gmail.com");
		});
		done();
	});

	it("testing deleteAllPosts with one post in the database", function(){
		post.deleteAllPosts(function(err,data){
			post.allPosts(function(err, data){
				console.log(data);
				assert.notDeepEqual(data, []);
			});
		});
	});

	it("testing deleteAllPosts with two posts", function(done){
		post.newPost("jen", "A cute cat looking for sitter!", null, "222 College St", "123@mail.com", "2015-09-23", "2016-09-25", null, function(err, doc){
			if(err) console.log(err);
		}
		post.deleteAllPosts(function(err, data){
			if(!err){
				post.allPosts, function(err, data){
					//assert.equal(data, []);
				}
			}
		});
		done();
	});

	it("gets all the posts by a specific user", function(done){
		post.getPostByUser("annie", function(err, posts){
			assert.equal(posts[0].title, "A cute cat looking for sitter!");
			assert.equal(posts[0].description, null);
			assert.equal(posts[0].address, "832 Bay Street, Toronto");
			assert.equal(posts[0].contact, "meeko@gmail.com");
		});
		done();
	});	
});