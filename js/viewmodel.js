// MODEL :

var locations = [
  {title: 'Shridi Sai Baba Temple', location: {lat: 13.0329391, lng: 80.2646984}},
  {title: 'Besant Nagar Beach', location: {lat: 12.9988983, lng: 80.27185559999998}},
  {title: 'That Madras Place', location: {lat: 13.005928, lng: 80.250697}},
  {title: 'Amethyst', location: {lat: 12.99328, lng: 80.2597}},
  {title: 'Marina Beach', location: {lat: 13.0500, lng: 80.2824}},
  {title: 'Murugan Idli Shop', location: {lat: 12.9786705, lng: 80.2191934}},
  {title: 'lAmandier', location: {lat: 13.027204292156357, lng: 80.25462280576745}},
];

var map;
var markers=[];

//is called from index.html
var initMap = function()  {
  var styles = [
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 30
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#6c6c6c"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#cacaca"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefdfd"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#6c6c6c"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#474747"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit.station.rail",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    }
 ];

  var chennai = {lat: 13.08268, lng: 80.27072};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    styles: styles,
    center: chennai
  });



  for(var i=0; i<locations.length; i++){
    var position = locations[i].location;
    var title = locations[i].title;
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    markers.push(marker);

    //and marker alloted to each location
    locations[i].marker = marker;

    var largeInfowindow = new google.maps.InfoWindow();
     google.maps.event.addListener(marker, 'click', (function(marker) {
          return function() {
            toggleBounce(this);
            populateInfoWindow(this, largeInfowindow);
          }
     })(marker));
  }
}

//sets content in marker info window
function populateInfoWindow(marker, infowindow) {

    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);

    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });

    // FOURSQUARE API
    var fourSquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + marker.position.lat() + ','  + marker.position.lng()  + '&client_id=2W5P1KI1A3DFG0AS2UBGMJAL32PME33EG33FQEPKEHSWUZDR&client_secret=1NJEBDG4VT4KJEEKFDGRDNJSTCM5YDJJCNR3YPRM1PJSYJXC&v=20161016';
    $.getJSON(fourSquareURL).done(function(response){
      var firstResponse = response.response.venues[0] || "";
      var formattedaddress = firstResponse.location.formattedAddress;
      var phoneNo = (firstResponse.contact.formattedPhone === undefined)? 'None': firstResponse.contact.formattedPhone;
      var url = (firstResponse.url === undefined)? 'None': firstResponse.url;

      infowindow.setContent( '<div> <strong>Name: ' + marker.title + ' </strong> </div>' +
                             '<div>Address: ' + formattedaddress + '</div>' +
                             '<div>Phone: ' + phoneNo + '</div>' +
                             '<div>FourSquare Link: ' + '<a href="' + url + '">' + url + '</a>' + '</div>' );

      infowindow.open(map, marker);
    }).fail(function(){
      console.log('getJSON failed') });
}

//animation and timeout for the marker
var toggleBounce= function(marker)  {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout (function () {
            marker.setAnimation(null)
          }, 1000);
        }
};

//            ViewModel

function appViewModel(){
  var self = this;
  this.query = ko.observable('');

  this.locationArray = ko.observableArray([]);
  locations.forEach(function(item){
    self.locationArray().push(item);
  });

  //called from click binding ko prop in index.html
  self.setLoc = function(clickedLoc) {
    var clickedData = clickedLoc.marker;
    //trigger marker click everytime there is input on clickedData
    google.maps.event.trigger(clickedData, 'click');
  };

  self.filteredItems = ko.computed(function(){
    var filter = self.query().toLowerCase();
    //for no textInput
    if(!filter){
     //loop to check the locations array
      for (i = 0; i < locations.length; i++) {
          if (locations[i].marker) //checks to see that markers exist
          locations[i].marker.setVisible(true); // set marker
      }
      //display the observableArray
      return self.locationArray();
    }
      //array.prototype.filter to pass true values in the array
      return this.locationArray().filter(function (item){
      //indexOf returns true for every match
      var passedFilter = item.title.toLowerCase().indexOf(filter) > -1;
      item.marker.setVisible(passedFilter); // sets marker based on input
      return passedFilter;
    });
  }, self);
}
ko.applyBindings(new appViewModel());

//error handling
function error(){
	alert("Error while loading google maps");
}
