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
      // link: function($scope) {
      //   $scope.$on('taxonCardReady', function(evt, data) {
      //     console.log('=== MINI TILE: ' + JSON.stringify(data));
      //     $scope.imageData = data;
      //   });
      // }
    };
  });
