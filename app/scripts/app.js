'use strict';

/**
 * @ngdoc overview
 * @name globiProtoApp
 * @description
 * # globiProtoApp
 *
 * Main module of the application.
 */
angular
  .module('globiProtoApp', [
    'ui.router',
    'ngResource',
    'ngProgress',
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'leaflet-directive'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
      .state('main', {
        url: '/main?name&interaction',
        views: {
          'nav' : {
            templateUrl: 'views/nav.html',
            controller: 'NavCtrl'
          },
          'content' : {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          }
        }
      })
      .state('map', {
        url: '/map?sourceTaxon&targetTaxon&interactionType',
        views: {
          'nav' : {
            templateUrl: 'views/nav.html',
            controller: 'NavCtrl'
          },
          'content' : {
            templateUrl: 'views/map.html',
            controller: 'MapCtrl'
          }
        }
      })
      .state('network', {
        url: '/network?taxon&interaction',
        views: {
          'nav' : {
            templateUrl: 'views/nav.html',
            controller: 'NavCtrl'
          },
          'content' : {
            templateUrl: 'views/network.html',
            controller: 'NetworkCtrl'
          }
        }
      })
      .state('play', {
        url: '/play',
        views: {
          'nav' : {
            templateUrl: 'views/nav.html',
            controller: 'NavCtrl'
          },
          'content' : {
            templateUrl: 'views/play.html',
            controller: 'PlayCtrl'
          }
        }
      })
      .state('about', {
        url: '/about',
        views: {
          'nav' : {
            templateUrl: 'views/nav.html',
            controller: 'NavCtrl'
          },
          'content' : {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl'
          }
        }
      });
    $urlRouterProvider.otherwise('/main');

    // Connect all HTTP events to the $rootScope bus, so that we can connect them to ngProgress in run() function
    $httpProvider.interceptors.push(function($q, $rootScope){
      return {
        'request': function(config) {
          $rootScope.$emit('start request');
          return config;
        },
        'requestError': function(rejection) {
          $rootScope.$emit('end request');
          return $q.reject(rejection);
        },
        'response': function(response) {
          $rootScope.$emit('end request');
          return response;
        },
        'responseError': function(rejection) {
          $rootScope.$emit('end request');
          return $q.reject(rejection);
        }
      };
    });//$httpProvider.interceptors

  });// config

/**
 * Main entry point for application
 */
angular.module('globiProtoApp').run(function(
  $rootScope,
  ngProgress) {

  // Hook up starting and ending of HTTP requests to ngProgress, for pretty progress bar
  $rootScope.$on('end request', function(){
    ngProgress.complete();
  });

  $rootScope.$on('start request', function(){
    ngProgress.reset();
    ngProgress.start();
  });

});//run
