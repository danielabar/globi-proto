'use strict';

/*jshint camelcase: false*/

/**
 * @ngdoc function
 * @name globiProtoApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the globiProtoApp
 */
angular.module('globiProtoApp')
  .controller('MapCtrl', function ($scope, $state, taxonInteractionDetails, images) {

    // TODO in a real app, this should go in MarkerService
    var buildMarkers = function(data) {
      var uniqueHolder = {};
      data.forEach(function(item) {
        if (item.study && item.latitude && item.longitude) {
          // str.replace(/\s|\-/g,'')
          var uniqueKey = item.study.replace(/\s|\-/g, '') + item.latitude.toString().replace('-','#') + '_' + item.longitude.toString().replace('-','#');
          if (uniqueHolder[uniqueKey]) {
            uniqueHolder[uniqueKey].itemCount += 1;
            uniqueHolder[uniqueKey].message = item.study + ', ' + uniqueHolder[uniqueKey].itemCount + ' Observations';
          } else {
            uniqueHolder[uniqueKey] = {
              lat: item.latitude,
              lng: item.longitude,
              message: item.study + ', 1 Observations',
              focus: true,
              draggable: false,
              itemCount: 1
            };
          }
        }
      });
      return uniqueHolder;
    };

    var calculateCenter = function(markers) {
      var totalLat = 0;
      var totalLng = 0;
      Object.keys(markers).forEach(function(key) {
        totalLat += markers[key].lat;
        totalLng += markers[key].lng;
      });
      return {
        lat: totalLat / Object.keys(markers).length,
        lng: totalLng / Object.keys(markers).length,
        zoom: 2
      };
    };

    var buildSourceImage = function(item) {
      console.dir(item);
      images.get({taxon: item.source_taxon_name}).$promise.then(function(response) {
        $scope.sourceTaxon = {
          scientificName: response.scientificName,
          commonName: response.commonName,
          thumbnailURL: response.thumbnailURL,
          imageURL: response.imageURL,
          infoURL: response.infoURL,
        };
      }, function(err) {
        console.dir(err);
        $scope.taxon = {};
      });
    };

    var buildTargetImage = function(item) {
      images.get({taxon: item.target_taxon_name}).$promise.then(function(response) {
        $scope.targetTaxon = {
          scientificName: response.scientificName,
          commonName: response.commonName,
          thumbnailURL: response.thumbnailURL,
          imageURL: response.imageURL,
          infoURL: response.infoURL,
        };
      }, function(err) {
        console.dir(err);
        $scope.taxon = {};
      });
    };

    $scope.center = {};
    taxonInteractionDetails.query({
      interactionType: $state.params.interactionType,
      sourceTaxon: $state.params.sourceTaxon,
      targetTaxon: $state.params.targetTaxon
    }, function(response) {
      buildSourceImage(response[0]);
      buildTargetImage(response[0]);
      $scope.markers = buildMarkers(response);
      $scope.center = calculateCenter($scope.markers);
      // TODO If no markers found - display error and/or redirect back to Learn
    }, function(err) {
      console.dir(err);
    });

  });
