var map;

var api = "https://maps.googleapis.com/maps/api/geocode/json?address=ADDRESS_PLACE_HOLDER&key=AIzaSyBtH3mU3MCHy5eit3re5KJl12UUOySL9cc"
var address = $('#address').text();
address = address.split(' ').join('+');
api = api.replace("ADDRESS_PLACE_HOLDER", address);

function createMarker(location){
  var infoString = '<a href="http://google.com/">'+ location.name +'</a>'
  var infowindow = new google.maps.InfoWindow({
    content: infoString
  });

  marker = new google.maps.Marker({
    map: map,
    draggable: false,
    animation: google.maps.Animation.DROP,
    position: {lat: location.lat, lng: location.lng}
  });

  google.maps.event.addListener(marker, 'click', (function(marker) {
    return function() {
      infowindow.setContent(infoString);
      infowindow.open(map, marker);
    }
  })(marker));
}

function initMap() {
  $.get(api, function(geodata){
    var location = {name: geodata.results[0].formatted_address,
                  lat: geodata.results[0].geometry.location.lat,
                  lng: geodata.results[0].geometry.location.lng
                };
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 43.663, lng: -79.3864},
      zoom: 12,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.BOTTOM_LEFT
      }
    });
    createMarker(location);
  });
}