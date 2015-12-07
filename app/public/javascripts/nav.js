$('#nav-signout').click(function(event){
	Cookies.remove('username');
	Cookies.remove('salt');
	window.location.replace("/login");
});