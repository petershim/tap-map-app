angular.module('starter.controllers', ['ionic'])
  .controller('MapCtrl', ['$scope', function($scope, $ionicPopup) {
  // Code will be here
  $scope.user = {};

  $scope.showAlert = function() {
	    $ionicPopup.alert({
	        title: 'iMapApp',
	        template: 'Your location has been saved!!'
	    });
	};

  $scope.saveDetails = function(){
    var lat = $scope.user.latitude;
    var lgt = $scope.user.longitude;
    var des = $scope.user.desc;

    console.log('click', lat, lgt);


    // Code to write to Firebase will be here
  };

  }])
  .directive('map', function() {
    return {
        restrict: 'A',
        link:function(scope, element, attrs){
            // Code will be here
            var zValue = scope.$eval(attrs.zoom);
            var lat = scope.$eval(attrs.lat);
            var lng = scope.$eval(attrs.lng);

            var myLatlng = new google.maps.LatLng(lat,lng),
            mapOptions = {
                  zoom: zValue,
                  center: myLatlng
              },
            map = new google.maps.Map(element[0],mapOptions),
            marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                draggable:true
            });
            google.maps.event.addListener(marker, 'dragend', function(evt){
              scope.$parent.user.latitude = evt.latLng.lat();
      		    scope.$parent.user.longitude = evt.latLng.lng();
      		    scope.$apply();
              console.log('Current Latitude:',evt.latLng.lat(),'Current Longitude:',evt.latLng.lng());
            });
        }
    };
});
