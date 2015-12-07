$('#nav-signout').click(function(event){
	event.preventDefault();
	Cookies.remove('username');
	Cookies.remove('salt');
	window.location.replace("/login");
});
$("#search_form").submit(function(event) {
	event.preventDefault();
	var searchInput = $('#searchbox').val();
	window.location.replace("/user/"+searchInput);
});