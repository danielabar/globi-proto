'use strict';

/**
 * @ngdoc function
 * @name globiProtoApp.controller:ImagetileCtrl
 * @description
 * # ImagetileCtrl
 * Controller of the globiProtoApp
 */
angular.module('globiProtoApp')
  .controller('ImagetileCtrl', function ($scope, $rootScope) {

    $scope.follow = function(imageData) {
      $rootScope.$broadcast('followEvent', imageData);
    };

  });
