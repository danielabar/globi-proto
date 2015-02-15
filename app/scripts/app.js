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
    'ui.bootstrap'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main', {
        url: '/main?name&interaction',
        views: {
          'nav' : {
            templateUrl: 'views/nav.html'
          },
          'content' : {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          }
        }
      })
      .state('about', {
        url: '/about',
        views: {
          'nav' : {
            templateUrl: 'views/nav.html'
          },
          'content' : {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl'
          }
        }
      });
    $urlRouterProvider.otherwise('/main');
  });
