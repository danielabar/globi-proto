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

    $scope.follow = function(imageData, interactionType) {
      var eventData = {
        imageData: imageData,
        interactionType: interactionType
      };
      $rootScope.$broadcast('followEvent', eventData);
    };

    $scope.map = function(imageData) {
      var eventData = {
        imageData: imageData
      };
      $rootScope.$broadcast('mapEvent', eventData);
    };

    $scope.network = function(imageData) {
      var eventData = {
        imageData: imageData
      };
      $rootScope.$broadcast('networkEvent', eventData);
    };

  });
