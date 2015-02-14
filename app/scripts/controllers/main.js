'use strict';

/**
 * @ngdoc function
 * @name globiProtoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the globiProtoApp
 */
 angular.module('globiProtoApp')
 .controller('MainCtrl', function ($scope, closeMatch, images, $rootScope) {

  $scope.taxon = {
    // imageURL: 'http://placehold.it/250x250'
  };

  $scope.getResults = function(val) {
    return closeMatch.get({taxon: val}).$promise.then(function(response) {
      return response.data.map(function(item) {
        return item[0];
      });
    });
  };

  $scope.taxonSelected = function(item) {
    images.get({taxon: item}).$promise.then(function(response) {
      console.dir(response);
      $scope.taxon.commonName = response.commonName;
      $scope.taxon.thumbnailURL = response.thumbnailURL;
      $scope.taxon.imageURL = response.imageURL;
      $scope.taxon.infoURL = response.infoURL;

      $rootScope.$emit('taxonEvent', $scope.taxon);
      $rootScope.$broadcast('taxonEvent', $scope.taxon);
    });
  };

});
