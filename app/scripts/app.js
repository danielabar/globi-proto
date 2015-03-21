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
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'leaflet-directive'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
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
  });
