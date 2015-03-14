'use strict';

/**
 * @ngdoc function
 * @name globiProtoApp.controller:MainCtrl
 * @description (see friendly interaction names at http://www.globalbioticinteractions.org/)
 * # MainCtrl
 * Controller of the globiProtoApp
 */
 angular.module('globiProtoApp')
 .controller('MainCtrl', function ($scope, closeMatch, images, $rootScope, interactionTypes, taxonInteraction, $state) {

  var doSearch = function() {
    $scope.searchResults = [];
    taxonInteraction.get({taxon: $scope.query.name, interaction: $scope.query.interaction}).$promise.then(function(response) {
      var speciesList = response.data[0][2];
      speciesList.forEach(function(item) {
        images.get({taxon: item}).$promise.then(function(imageResponse) {
          $scope.searchResults.push({
            scientificName: imageResponse.scientificName,
            commonName: imageResponse.commonName,
            thumbnailURL: imageResponse.thumbnailURL,
            imageURL: imageResponse.imageURL,
            infoURL: imageResponse.infoURL
          });
          $rootScope.$emit('taxonEvent', $scope.searchResults[$scope.searchResults.length-1]);
          $rootScope.$broadcast('taxonEvent', $scope.searchResults[$scope.searchResults.length-1]);
        }, function(err) {
          console.dir(err);
        });
      });
    }, function(err) {
      console.dir(err);
    });
  };

  var handleTaxonSelected = function(item) {
    images.get({taxon: item}).$promise.then(function(response) {
      $scope.taxon = {
        scientificName: response.scientificName,
        commonName: response.commonName,
        thumbnailURL: response.thumbnailURL,
        imageURL: response.imageURL,
        infoURL: response.infoURL
      };
    }, function(err) {
      console.dir(err);
      $scope.taxon = {};
    });
  };

  $scope.query = {
    name: $state.params.name,
    interaction: $state.params.interaction
  };

  if ($scope.query.name) {
    handleTaxonSelected($scope.query.name);
    if ($scope.query.interaction) {
      doSearch();
    }
  }

  $scope.taxon = {};
  $scope.interactions = [];
  $scope.searchResults = [];

  interactionTypes.get().$promise.then(function(response) {
    Object.keys(response).forEach(function(interactionType) {
      if (!interactionType.match(/^\$/)) {
        $scope.interactions.push({
          name: interactionType,
          source: response[interactionType].source,
          target: response[interactionType].target
        });
      }
    });
  });

  $scope.getResults = function(val) {
    return closeMatch.get({taxon: val}).$promise.then(function(response) {
      return response.data.map(function(item) {
        return {
          scientificName: item[0],
          commonName: getEnglishCommonName(item[1])
        };
      });
    });
  };

  var getEnglishCommonName = function(commonNames) {
    var result = '';
    var allLanguages;
    var parts;

    if (commonNames) {
      allLanguages = commonNames.split(' | ');
      allLanguages.forEach(function(item) {
        if (item.match(/@en/)) {
          parts = item.split('@');
          result = parts[0];
        }
      });
    }
    return result;
  };

  $scope.taxonSelected = function(item) {
    $scope.query.name = item.scientificName;
    $scope.query.interaction = null;
    $scope.searchResults = [];
    $state.transitionTo('main', $scope.query, {location: true, reload: true});
  };

  $scope.search = function() {
    $state.transitionTo('main', $scope.query, {location: true, reload: true});
  };

  $scope.clear = function() {
    $scope.query = {};
    $scope.taxon = {};
    $scope.searchResults = [];
    $state.transitionTo('main', $scope.query, {location: true, reload: true});
  };

  $scope.$on('followEvent', function(evt, eventData) {
    $scope.query.name = eventData.imageData.scientificName;
    $scope.query.interaction = eventData.interactionType;
    $scope.searchResults = [];
    $state.transitionTo('main', $scope.query, {location: true, reload: true});
  });

});