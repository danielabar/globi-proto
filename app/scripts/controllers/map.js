'use strict';

/**
 * @ngdoc function
 * @name globiProtoApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the globiProtoApp
 */
angular.module('globiProtoApp')
  .controller('MapCtrl', function ($scope) {
    $scope.center = {
        lat: 45,
        lng: 18,
        zoom: 8
    };
    // angular.extend($scope, {
    //   defaults: {
    //     // scrollWheelZoom: false
    //   }
    // });
  });
