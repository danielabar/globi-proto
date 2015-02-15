'use strict';

/**
 * @ngdoc function
 * @name globiProtoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the globiProtoApp
 */
 angular.module('globiProtoApp')
 .controller('MainCtrl', function ($scope, closeMatch, images, $rootScope, interactionTypes) {

  $scope.search = {};
  $scope.taxon = {};
  $scope.interactions = [];

  interactionTypes.get().$promise.then(function(response) {
    Object.keys(response).forEach(function(interactionType) {
      $scope.interactions.push({
        name: interactionType,
        source: response[interactionType].source,
        target: response[interactionType].target
      });
    });
  });

  $scope.getResults = function(val) {
    return closeMatch.get({taxon: val}).$promise.then(function(response) {
      return response.data.map(function(item) {
        return item[0];
      });
    });
  };

  $scope.taxonSelected = function(item) {
    images.get({taxon: item}).$promise.then(function(response) {
      $scope.taxon = {
        scientificName: response.scientificName,
        commonName: response.commonName,
        thumbnailURL: response.thumbnailURL,
        imageURL: response.imageURL,
        infoURL: response.infoURL
      };
      $rootScope.$emit('taxonEvent', $scope.taxon);
      $rootScope.$broadcast('taxonEvent', $scope.taxon);
    }, function(err) {
      console.dir(err);
      $scope.taxon = {};
      $rootScope.$emit('taxonEvent', $scope.taxon);
      $rootScope.$broadcast('taxonEvent', $scope.taxon);
    });
  };

});
