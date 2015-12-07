$('#add_comment').click(function(){
	text = $('#new_comment').val();
	username = $('#username').text();
	console.log(text);
	console.log(username);
	$.post('/api/newComment',{text: text, username: username},function(data){
		if(data.status){
			location.reload();
		}
	});
});

$('#add_rating').click(function(){
	rating = $('#new_rating').val();
	username = $('#username').text();
	console.log(rating);
	console.log(username);
	$.post('/api/newRating',{rating: rating, username: username},function(data){
		if(data.status){
			location.reload();
		}
	});
});