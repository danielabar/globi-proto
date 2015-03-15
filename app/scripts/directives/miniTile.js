'use strict';

/**
 * @ngdoc directive
 * @name globiProtoApp.directive:imageTile
 * @description
 * # imageTile
 */
angular.module('globiProtoApp')
  .directive('miniTile', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        imageData: '=miniTile'
      },
      templateUrl: 'views/miniTile.html'
    };
  });
