var map;

var locations = [{name: "832 Bay Street", lat: 43.663, lng: -79.3864},
                  {name: "Casa Loma", lat: 43.678041, lng: -79.4116326},
                  {name: "Eglinton station", lat: 43.7053655, lng: -79.400579}]


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
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.663, lng: -79.3864},
    zoom: 12,
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.BOTTOM_LEFT
    }
  });

  for (var i in locations){
    createMarker(locations[i]);
  }
}