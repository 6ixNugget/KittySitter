$('#login_submit').click(function(e){
    e.preventDefault();
    userInfo = {
        email: $('#login_username').val(),
        password: $('#login_password').val()
    }
    $.post('/api/signin',userInfo, function(data){
        if(data.status){
            window.location.replace("/");
        }else{
            $('.error_display_signin').html("<p>"+data.msg+"</p>")
        }
    });
});
$('#signup_submit').click(function(e){
    e.preventDefault();
    if($('#signup_password').val() != $('#signup_reenter').val()){
        $('.error_display_signup').html("<p>"+"Password and re-enter do not match."+"</p>");
        return;
    }

    userInfo = {
        email: $('#signup_username').val(),
        password: $('#signup_password').val()
    }
    $.post('/api/signup',userInfo, function(data){
        if(data.status){
            window.location.replace("/");
        }else{
            for (var i = 0; i < data.msg.length; i++)
                $('.error_display_signup').html("<p>"+data.msg[i]+"</p>")
        }
    });
});
