var template = '\
<div class="profile_row">\
  <div class="col-lg-12"> \
    <div class="profile_media"><a href="#" class="pull-left"><img src="imageSourcePlaceholder" style="width: 100px;height:100px;" class="media-object profile_dp img-circle"/></a>\
      <div class="media-body">\
        <h4 class="media-heading">emailPlaceholder<small> displayNamePlaceholder</small></h4>\
        <h5>descriptionPlaceholder<a href=""> typePlaceholder</a></h5>\
        <hr style="margin:8px auto"/>\
        <span class="hidden">placeholder<span>\
      </div>\
    </div>\
  </div>\
</div>\
';

var btn_template = '<span class="label label-default deleteUser hidden">Delete</span><span class="label label-default editUser hidden">Edit</span><span class="label label-info assignAdmin hidden">Assign admin</span><span class="label label-default unassignAdmin hidden">Unassign admin</span>'

$(function(){
    $.get('api/userType',function(type){
        if(type != null){
            var userType = type;
            localStorage.setItem("userType", type);
        }else
            window.location.replace('/');
        $.get('api/allUsers',function(data){
            for(var i = 0; i < data.length; i++){
                user = data[i];
                new_template = template;
                console.log(user);
                if (user.profile_pic != undefined)
                    new_template = new_template.replace("imageSourcePlaceholder", user.profile_pic);
                else{
                    new_template = new_template.replace("imageSourcePlaceholder", "https://qph.is.quoracdn.net/main-qimg-3b0b70b336bbae35853994ce0aa25013?convert_to_webp=true");
                }

                if (user.display_name != undefined)
                    new_template = new_template.replace("displayNamePlaceholder", user.display_name);
                else
                    new_template = new_template.replace("displayNamePlaceholder", "");


                if (user.description != undefined)
                    new_template = new_template.replace("descriptionPlaceholder", user.description);
                else
                    new_template = new_template.replace("descriptionPlaceholder", "");

                new_template = new_template.replace("emailPlaceholder", user.email);
                new_template = new_template.replace("typePlaceholder", user.type);
                if (user.email != $.cookie("userEmail") && (user.type == "Regular User" || userType == "System Admin")){
                    new_template = new_template.replace('<span class="hidden">placeholder<span>',btn_template);
                }
                $('.grid_container').append(new_template);
            }
            if(userType == "System Admin"){
                $('.assignAdmin').removeClass("hidden");
                $('.unassignAdmin').removeClass("hidden");
                $('.deleteUser').removeClass("hidden");
                $('.editUser').removeClass("hidden");
            }else if(userType == "Admin"){
                $('.deleteUser').removeClass("hidden");
                $('.editUser').removeClass("hidden");
            }
            $('.assignAdmin').click(function(){
                email = $(this).closest('.profile_row').find('h4').text().trim();
                $.post('/api/typeChange',{email: email, type:"Admin"}, function(data){
                    if(data.status) location.reload();
                })
            });
            $('.unassignAdmin').click(function(){
                email = $(this).closest('.profile_row').find('h4').text().trim();
                $.post('/api/typeChange',{email: email, type:"Regular User"}, function(data){
                    if(data.status) location.reload();
                })
            });
            $('.deleteUser').click(function(){
                email = $(this).closest('.profile_row').find('h4').text().trim();
                $.post('/api/deleteUser',{email: email}, function(data){
                    if(data.status) location.reload();
                })
            });
            $('.editUser').click(function(){
                email = $(this).closest('.profile_row').find('h4').text().trim();
                console.log(email);
            });

            $.get('/templates/myModal.html',function(data){
                template = data;
                $.get('/api/getUser', function(user){
                    template = template.replace('display_name_ph', user.display_name);
                    template = template.replace('description_ph', user.description);
                    template = template.replace('profile_pic_ph', "https://qph.is.quoracdn.net/main-qimg-3b0b70b336bbae35853994ce0aa25013?convert_to_webp=true");
                    $('.myModalPlaceholder').html(template);
                    $('#profile').click(function(){
                        $('#myModal').modal();
                    });
                    $('#savechanges').click(function(){
                        newInfo = user;
                        newInfo.display_name = $('#display_name_update').val();
                        newInfo.description = $('#description_update').val();
                        $.post('/api/userUpdate',newInfo, function(data){
                            if(data.status) location.reload();
                        });
                    });
                });
            });
        });
    });
});
