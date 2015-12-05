var mongoose = require("mongoose");
var user = require('../models/user_model');
var post = require('../models/post_model');
var assert = require('assert');

mongoose.createConnection('mongodb://localhost/post_test');

describe("Post Model Test", function(){
	var testPost;
	beforeEach(function(done){
		user.removeAll(function(err){
			if(err){
				console.log(err);
			}
		});
		post.deleteAllPosts(function(err){
			if(err){
				//console.log(err);
			}
		});

		user.addUser("annie", "123123", "annie@gmail.com", function(err){
			if(err){
				console.log(err);
			}
		});
		post.newPost("annie", "A cute cat looking for sitter!",null, "832 Bay Street, Toronto", "meeko@gmail.com", "2015-12-23", "2015-12-28", null, function(err){
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
				//console.log(err);
			}
		});
		done();
	});

	it("create a valid new post", function(done){
		post.newPost("jenna", "A cute ginger looking for sitter!", "200 Bay Street, Toronto", "jenna@gmail.com", "2015-12-25", "2016-01-03", function(doc){
			assert.equal(doc, null);
		});
		done();
	});

	it("create an invalid post without creator", function(done){
		post.newPost("", "A cute cat looking for sitter!", "832 Bay Street, Toronto", "meeko@gmail.com", "2015-12-23", "2015-12-28", function(doc){
			assert.equal("ValidationError", doc);
		});
		done();
	});

	it("returns all posts in the database", function(){
		all = post.allPosts();
		assert.equal(all, testPost);
	});
});
