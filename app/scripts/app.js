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
    'toaster',
    'ngAria',
    'ngCookies',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
      .state('landing', {
        url: '/landing',
        views: {
          'nav' : {
            templateUrl: 'views/nav.html',
            controller: 'NavCtrl'
          },
          'content' : {
            templateUrl: 'views/landing.html'
          }
        }
      })
      .state('main', {
        url: '/main?sourceTaxon&interactionType',
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
      .state('network', {
        url: '/network?sourceTaxon&interactionType',
        views: {
          'nav' : {
            templateUrl: 'views/navNetwork.html',
            controller: 'NavNetworkCtrl'
          },
          'content' : {
            templateUrl: 'views/network.html',
            controller: 'NetworkCtrl'
          }
        }
      })
      .state('labs', {
        url: '/labs',
        views: {
          'nav' : {
            templateUrl: 'views/nav.html',
            controller: 'NavCtrl'
          },
          'content' : {
            templateUrl: 'views/labs.html'
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
    $urlRouterProvider.otherwise('/landing');

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
