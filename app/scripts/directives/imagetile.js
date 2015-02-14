'use strict';

/**
 * @ngdoc directive
 * @name globiProtoApp.directive:imageTile
 * @description
 * # imageTile
 */
angular.module('globiProtoApp')
  .directive('imageTile', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        imageData: '=imageTile'
      },
      templateUrl: 'views/imageTile.html',
      controller: 'ImagetileCtrl'
    };
  });
