$('#np_form').submit(function(event){
    event.preventDefault();
    photo = $('#np_image').val();
    title = $('#np_title').val();
    description = $('#np_description').val();
    address = $('#np_address').val();
    contact = $('#np_email').val();
    startDate = $('#np_start_date').val();
    endDate = $('#np_end_date').val();
    var new_post = {
        photo: photo,
        title: title,
        description: description,
        address: address,
        contact: contact,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
    };
    $.post('/api/newPost',new_post,function(data){
        if(data.status){
            window.location.replace('/post/'+ data.post_id);
        }
    });
});