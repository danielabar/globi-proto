'use strict';

/*jshint loopfunc: true */

/**
 * @ngdoc function
 * @name globiProtoApp.controller:MainCtrl
 * @description (see friendly interaction names at http://www.globalbioticinteractions.org/)
 * # MainCtrl
 * Controller of the globiProtoApp
 */
 angular.module('globiProtoApp')
 .controller('MainCtrl', function ($scope, closeMatch, images, $rootScope, toaster,
   interactionTypes, taxonInteraction, $state, interactionService) {

  var doSearch = function() {
    $scope.searchResults = [];
    taxonInteraction.query({
      sourceTaxon: $scope.query.sourceTaxon,
      interactionType: $scope.query.interactionType
    }).$promise.then(function(response) {
        var deduped,
          speciesOnly;

      if (response.length > 0) {
        deduped = interactionService.removeDuplicateTargets(response);
        speciesOnly = interactionService.removeShallowTaxonPaths(deduped);
        for (var i=0; i<speciesOnly.length; i++) {
          images.get({taxon: speciesOnly[i].target_taxon_name}).$promise.then(function(imageResponse) {
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
        }
      } else {
        toaster.pop('note', 'Sorry', 'No interactions found for: ' + $scope.query.sourceTaxon + ' ' + $scope.query.interactionType);
      }
    }, function(err) {
      console.dir(err);
    });
  };//doSearch

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
    sourceTaxon: $state.params.sourceTaxon,
    interactionType: $state.params.interactionType
  };

  if ($scope.query.sourceTaxon) {
    handleTaxonSelected($scope.query.sourceTaxon);
    if ($scope.query.interactionType) {
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
    $scope.query.sourceTaxon = item.scientificName;
    $scope.query.interactionType = null;
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

  $scope.network = function() {
    $state.transitionTo('network', {
      sourceTaxon: $scope.query.sourceTaxon,
        interactionType: $state.params.interactionType || 'eats'
      },
      {location: true, reload: true}
    );
  };

  $scope.$on('followEvent', function(evt, eventData) {
    $scope.query.sourceTaxon = eventData.imageData.scientificName;
    $scope.query.interactionType = eventData.interactionType;
    $scope.searchResults = [];
    $state.transitionTo('main', $scope.query, {location: true, reload: true});
  });

  $scope.$on('networkEvent', function(evt, eventData) {
    $state.transitionTo('network', {
        sourceTaxon: eventData.imageData.scientificName,
        interactionType: $state.params.interactionType || 'eats'
      },
      {location: true, reload: true}
    );
  });

});
