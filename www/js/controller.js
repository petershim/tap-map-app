var locations = [
  {
    id: 1,
    lat: 34.00891646077737,
    lng: -118.47911469882814
  },
  {
    id:2,
 lat: 34.00891646077737,
  lng: -118.46400849765627

},
  {
    id:3,
lat: 34.00891646077737,
 lng: -118.44203584140627
  },
{
  id:4,
  lat: 34.00094735458521,
  lng: -118.44203584140627
}
];


angular.module('starter.controllers', ['ionic'])
  .controller('MapCtrl', ['$scope', function($scope, $ionicPopup) {
  // Code will be here


  $scope.showAlert = function() {
	    $ionicPopup.alert({
	        title: 'iMapApp',
	        template: 'Your location has been saved!!'
	    });
	};

  $scope.saveDetails = function(){
    var lat = $scope.user.latitude;
    var lgt = $scope.user.longitude;


    console.log('click', lat, lgt);


    // Code to write to Firebase will be here
  };

  }])
  .directive('map', function() {
    return {
        restrict: 'AE',
        link:function(scope, element, attrs){
            // Code will be here
            var zValue = scope.$eval(attrs.zoom);
            var lat = scope.$eval(attrs.lat);
            var lng = scope.$eval(attrs.lng);
            console.log(scope.test);
            var firstCoordinate = new google.maps.LatLng(locations[0].lat,locations[0].lng);
            mapOptions = {
              zoom: 12,
              center: firstCoordinate
            };
            map = new google.maps.Map(element[0],mapOptions);

            function addMarker(new_lat, new_lng){
              var new_marker = {
                id: locations.length + 1,
                lat: new_lat,
                lng: new_lng
              };
              console.log(new_marker);
              locations.push(new_marker);
              PlaceMarkerAndPanTo(new_marker, map)
              google.maps.event.trigger(map,'resize');
              //populate();
            };

            function PlaceMarkerAndPanTo(new_marker, map){
              var LatLng = new google.maps.LatLng(new_marker.lat,new_marker.lng);
              console.log(new_marker.id);
              marker = new google.maps.Marker({
                position: LatLng,
                map: map,
                draggable:true

              });
              map.panTo(LatLng);
            }

          function populate(){
            locations.forEach(function(location){
                var LatLng = new google.maps.LatLng(location.lat,location.lng);
                console.log(location.id);
                marker = new google.maps.Marker({
                  position: LatLng,
                  map: map,
                  draggable:true
                });
                console.log(LatLng);
              });
          }
          populate();

            google.maps.event.addListener(marker, 'dragend', function(evt){
              scope.$parent.user.latitude = evt.latLng.lat();
      		    scope.$parent.user.longitude = evt.latLng.lng();
      		    scope.$apply();
              // console.log('lat:',evt.latLng.lat(),'lng:',evt.latLng.lng());
            });
          map.addListener('click', function(evt) {
            var new_lat = evt.latLng.G;
            var new_lng = evt.latLng.K;
            console.log(new_lat);
            console.log(new_lng);
            addMarker(new_lat,new_lng);
          });
        }
    };
});
