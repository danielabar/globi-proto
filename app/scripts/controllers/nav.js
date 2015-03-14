'use strict';

/**
 * @ngdoc function
 * @name globiProtoApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the globiProtoApp
 */
angular.module('globiProtoApp')
  .controller('NavCtrl', function ($scope) {

    $scope.$on('$stateChangeSuccess', function(event, toState) {
      $scope.state = toState.name;
    });
    
  });
