$('#signin-form').submit(function(event){
	username = $('#signin-email').val();
	password = $('#signin-password').val();

	$('#signin-email').removeClass('has-error').next('span').removeClass('is-visible');
	$('#signin-password').removeClass('has-error').next('span').removeClass('is-visible');
	if (username.length > 16 || username.length < 8){
		$('#signin-email').toggleClass('has-error').next('span').toggleClass('is-visible');
		event.preventDefault();
		return;
	}
	if (password.length > 16 || username.length < 6){
		$('#signin-password').toggleClass('has-error').next('span').toggleClass('is-visible');
		event.preventDefault();
		return;
	}


	$.post('/api/signin', {username: username, password: password}, function(data){
		alert(data.error);
		event.preventDefault();
		// if (data.status){
		// 	Cookies.set('salt', data.salt);
		// 	Cookies.set('username', data.username);
		// 	window.location.replace("/");
		// }else{
		// 	$('#login-error').text(data.error);
		// 	$('#login-error').toggleClass('is-visible');
		// 	event.preventDefault();
		// }
	});
});