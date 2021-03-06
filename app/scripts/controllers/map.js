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
  .controller('MapCtrl', function ($scope, $state, taxonInteractionDetails, images, toaster) {

    // Pre-populate a good example if one is not provided by the user
    $scope.query = {
      sourceTaxon: $state.params.sourceTaxon || 'Sphyrnidae',
      interactionType: $state.params.interactionType || 'eats',
      targetTaxon: $state.params.targetTaxon || 'Actinopterygii'
    };

    var buildMarkers = function(data) {
      var uniqueHolder = {};
      data.forEach(function(item) {
        if (item.study_title && item.latitude && item.longitude) {
          var uniqueKey = item.study_title.replace(/\s|\-/g, '') + item.latitude.toString().replace('-','#') + '_' + item.longitude.toString().replace('-','#');
          if (uniqueHolder[uniqueKey]) {
            uniqueHolder[uniqueKey].itemCount += 1;
            uniqueHolder[uniqueKey].message = uniqueHolder[uniqueKey].itemCount + ' Observations, ' + '<a href="' + item.study_url + '">' + item.study_title + '</a>';
          } else {
            uniqueHolder[uniqueKey] = {
              lat: item.latitude,
              lng: item.longitude,
              message: '1 Observation, ' + '<a href="' + item.study_url + '">' + item.study_title + '</a>',
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
    taxonInteractionDetails.query($scope.query, function(response) {
      buildSourceImage(response[0]);
      buildTargetImage(response[0]);
      $scope.markers = buildMarkers(response);
      if (angular.equals({}, $scope.markers)) {
        toaster.pop('note', 'Sorry', 'No geographic information found for: ' + $scope.query.sourceTaxon + ' ' + $scope.query.interactionType + ' ' + $scope.query.targetTaxon);
      } else {
        $scope.center = calculateCenter($scope.markers);
      }
    }, function(err) {
      console.dir(err);
    });

  });
