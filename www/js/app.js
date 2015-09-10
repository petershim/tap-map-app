// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'ngMockE2E'])

  // .run(function($ionicPlatform) {
  //   $ionicPlatform.ready(function() {
  //     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
  //     // for form inputs)
  //     if(window.cordova && window.cordova.plugins.Keyboard) {
  //       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  //     }
  //     if(window.StatusBar) {
  //       StatusBar.styleDefault();
  //     }
  //   });
  // })
  .run(function($httpBackend){
    $httpBackend.whenGET('http://localhost:8100/valid')
          .respond({message: 'This is my valid response!'});
    $httpBackend.whenGET('http://localhost:8100/notauthenticated')
          .respond(401, {message: "Not Authenticated"});
    $httpBackend.whenGET('http://localhost:8100/notauthorized')
          .respond(403, {message: "Not Authorized"});

    $httpBackend.whenGET(/templates\/\w+.*/).passThrough();
   })
  .config(function($stateProvider, $urlRouterProvider, USER_ROLES) {
      $stateProvider
          .state('login', {
              url: '/login',
              templateUrl: 'templates/login.html',
              controller: 'LoginCtrl'
          })
          .state('main', {
              url: '/',
              abstract: true,
              templateUrl: 'templates/main.html'
          })
          .state('main.login', {
              url: 'main/login',
              views: {
                'login-tab':{
                  templateUrl: 'templates/login.html',
                  controller: 'LoginCtrl'
                }
              }
          })
          .state('main.subscribed', {
              url: 'main/subscribed',
              views: {
                'admin-tab':{
                  templateUrl: 'templates/subscribed.html'
                }
              },
            data: {
              authorizedRoles: [USER_ROLES.subscribed]
            }
          })
          .state('main.map', {
              url: 'main/map',
              views: {
                'public-tab':{
                  templateUrl: 'templates/map.html',
                  controller: 'MapCtrl'
                }
              }
          });
      $urlRouterProvider.otherwise(function ($injector, $location) {
        var $state = $injector.get("$state");
        $state.go("main.login");
      });

  });
