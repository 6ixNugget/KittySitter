$('#signout-btn').click(function(){
    document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    window.location.replace("/");
});
