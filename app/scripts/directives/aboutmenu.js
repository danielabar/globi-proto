'use strict';

/**
 * @ngdoc directive
 * @name globiProtoApp.directive:aboutMenu
 * @description
 * # aboutMenu
 */
angular.module('globiProtoApp')
  .directive('aboutMenu', function () {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'views/aboutMenu.html'
    };
  });
