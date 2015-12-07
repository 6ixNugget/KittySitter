var assert = require('assert');
var http = require('http');
var server = require('../app.js');

describe('Server Tests', function(){
	before(function(){
		server.listen(3000);
	});

	after(function(){
		server.close();
	});

	it('should get the index page', function(done){
		http.get('http://localhost:3000', function(response){
			console.log(response);
		});
	});
});