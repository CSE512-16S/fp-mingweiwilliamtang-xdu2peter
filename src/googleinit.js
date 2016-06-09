var myCenter=new google.maps.LatLng(47.669874, -122.310221);
var markers = [];
var marker;
var locations; 
var iconUp = {
  path: "M0 -10 L-10 0 L-4 0 L-4 10 L4 10 L4 0 L10 0 Z",
  fillColor: '#088A08',
  fillOpacity: .6,
  anchor: new google.maps.Point(0,0),
  strokeWeight: 0,
  scale: 0.8
}

var iconDown = {       
  path: "M0 10 L-10 0 L-4 0 L-4 -10 L4 -10 L4 0 L10 0 Z",
  fillColor: '#FF0000',
  fillOpacity: .6,
  anchor: new google.maps.Point(0,0),
  strokeWeight: 0,
  scale: 0.8
}

// helper function: round to 2 decimal place
function roundToTwo(num) {    
  return +(Math.round(num + "e+2")  + "e-2");
}

//----------- Styles Start----------
var styleArray = [
{
   "featureType": "landscape.natural",
   "elementType": "geometry.fill",
   "stylers": [
   { "color": "#ffffff" }
    ]
},
{
   "featureType": "landscape.man_made",
   "stylers": [
   { "color": "#ffffff" },
   { "visibility": "on" }
   ]
},
{
   "featureType": "water",
   "stylers": [
   { "color": "#CEECF5" },  // applying map water color
   { "saturation": 10 }
   ]
},
{
   "featureType": "road.arterial",
   "elementType": "geometry",
   "stylers": [
       { "color": "#E6E6E6" },
       {"opacity":0.2}
    ]
}
,{
   "elementType": "labels.text.stroke",
   "stylers": [
   { "visibility": "off" }
  ]
}
,{
   "elementType": "labels.text",
   "stylers": [
   { "color": "#444444" }
   ]
}
,{
   "featureType": "poi",
   "stylers": [
   { "visibility": "off" }
   ]
}
];
//------------Styles End--------------

//var hist = [ ];

//hist[0]=1;

var hist = [];
function initialize(data)
{
  locations = data;

	var slider = $('#slider').slideReveal({
    position: "left",
    width: 400,
	  speed: 700,
  });
	slider.slideReveal("hide");

  var lat = 47.669874;
  var lng = -122.310221;
	var mapProp = {
  	center:new google.maps.LatLng(lat, lng),
  	zoom:10,
  	mapTypeId:google.maps.MapTypeId.ROADMAP,
		styles: styleArray
 	};
    
	var map = new google.maps.Map(document.getElementById("map"),mapProp);

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(50, 50)
      };

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
});

/*var marker=new google.maps.Marker({
  position:myCenter,
  animation:google.maps.Animation.DROP
  });
marker.addListener('click', toggleBounce);

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

marker.setMap(map);*/

/*
for (var i = 0; i < locations.length; i++) {
//    hist[i] = locations[i]["QoQ"];
    hist[i] = locations[i]["QoQ"];
}*/


    
	for (var i = 0; i < locations.length; i++) {
		addMarkerWithTimeout(locations[i], i );
 //   console.log(markers.length);
  	}

   	function addMarkerWithTimeout(position, i) {
   		var icon;
   		if (position['MoM'] < 0)
   		    icon = iconDown;
   		else
   		    icon = iconUp;
  		window.setTimeout(function() {      
   		var marker1 = new google.maps.Marker({
      		position: {lat: position["latitude"], lng: position["longitude"]},
      		map: map,
      		animation: google.maps.Animation.DROP,
      		icon: icon,
      		title: 'Percent increased ' + roundToTwo(100 * position['MoM']) + '%',
      		customInfo: i
   		});
       	markers[i] = marker1;
//       	if (marker1.getAnimation() == null)
//      		marker1.setAnimation(google.maps.Animation.BOUNCE);
	    marker1.addListener('click', toggleBounce);
  		}, i * 20);
  
	}

	// bounce animation to marker
	function toggleBounce() {
	    console.log(this.customInfo);

		
		//$('#slider').slideReveal().slideReveal("show");
    	if (this.getAnimation() !== null) {
    		slider.slideReveal("hide");
    		this.setAnimation(null);
  		} else {
        map.setCenter(this.position);
  		  slider.slideReveal("show");  
    		this.setAnimation(google.maps.Animation.BOUNCE);
		    sideInfo.intSideInfo(this.customInfo);
  		}
	}

}

google.maps.event.addDomListener(window, 'load',   d3.json("/fp-mingweiwilliamtang-xdu2peter/dat/WA_zip.json", initialize) );





