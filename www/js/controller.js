var posArray = [];
var locations = [
      ['Bondi Beach', -33.890542, 151.274856, 4],
      ['Coogee Beach', -33.923036, 151.259052, 5],
      ['Cronulla Beach', -34.028249, 151.157507, 3],
      ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
      ['Maroubra Beach', -33.950198, 151.259302, 1]
    ];
angular.module('starter.controllers', ['ionic'])
  .controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS){
    $scope.username = AuthService.username();

    $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
      var alertPopup = $ionicPopup.alert({
        title: 'Unauthorized!',
        template: 'You are not allowed to access this resource.'
      });
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
      AuthService.logout();
      $state.go('login');
      var alertPopup = $ionicPopup.alert({
        title: 'Session Lost!',
        template: 'Sorry, You have to login again.'
      });
    });

    $scope.setCurrentUsername = function(name) {
      $scope.username = name;
    };
  })
  .controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService){
    $scope.data = {};

    $scope.login = function(data) {
      AuthService.login(data.username, data.password).then(function(authenticated) {
        $state.go('main.map', {}, {reload: true});
        $scope.setCurrentUsername(data.username);
      }, function(err) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
    };
  })
  .controller('MainCtrl', function($scope, $state, $http, $ionicPopup, AuthService){
    $scope.logout = function() {
      AuthService.logout();
      $state.go('login');
    };

    $scope.performValidRequest = function() {
    $http.get('http://localhost:8100/valid').then(
      function(result) {
        $scope.response = result;
      });
    };

    $scope.performUnauthorizedRequest = function() {
      $http.get('http://localhost:8100/notauthorized').then(
        function(result) {
          // No result here..
        }, function(err) {
          $scope.response = err;
        });
    };

    $scope.performInvalidRequest = function() {
      $http.get('http://localhost:8100/notauthenticated').then(
        function(result) {
          // No result here..
        }, function(err) {
          $scope.response = err;
        });
    };
  })
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

    console.log('current click', lat, lgt);
    posArray.push({lat, lgt});




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

            // var data = [];

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                  var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  };
                  console.log(pos);

                  map.setCenter(pos);
                }, function() {
                  handleLocationError(true, map.getCenter());
                });
              } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, map.getCenter());
              }


            var marker;

            var myLatlng = new google.maps.LatLng(lat,lng),
            mapOptions = {
                  zoom: zValue,
                  center: myLatlng
              },
            map = new google.maps.Map(element[0],mapOptions);
            for(var i = 0; i < locations.length; i++){
              marker = new google.maps.Marker({
                  position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                  map: map,
                  draggable:true
              });
            }

            google.maps.event.addListener(marker, 'dragend', function(evt){
              scope.$parent.user.latitude = evt.latLng.lat();
      		    scope.$parent.user.longitude = evt.latLng.lng();
      		    scope.$apply();
              console.log('Current Latitude:',evt.latLng.lat(),'Current Longitude:',evt.latLng.lng());

            });
        }
    };
});
